"""Workflow orchestrator for executing 7-stage brand intelligence pipeline."""

import logging
from typing import Any, List, Optional

from app.agents.discovery import DiscoveryAgent
from app.agents.positioning import PositioningAgent
from app.agents.brand_shape import BrandShapeAgent
from app.agents.visual_direction import VisualDirectionAgent
from app.agents.critic import CriticAgent
from app.agents.consistency import ConsistencyAgent
from app.agents.delivery import DeliveryAgent
from app.database.repositories import ProjectRepository
from app.services.ai_service import AIService, get_ai_service
from app.utils.errors import AppException

logger = logging.getLogger(__name__)

STAGE_ORDER = [
    "discovery",
    "positioning",
    "shape",
    "visual",
    "critique",
    "consistency",
    "delivery",
]

STAGE_TO_STATUS = {
    "discovery": "DISCOVERING",
    "positioning": "POSITIONING",
    "shape": "SHAPING",
    "visual": "VISUALIZING",
    "critique": "CHALLENGING",
    "consistency": "CHECKING",
    "delivery": "DELIVERING",
}

RUNNING_STATUSES = {
    "DISCOVERING",
    "POSITIONING",
    "SHAPING",
    "VISUALIZING",
    "CHALLENGING",
    "CHECKING",
    "DELIVERING",
}


class WorkflowService:
    """Orchestrates staged AI agents and updates project state."""

    def __init__(
        self,
        repository: Optional[ProjectRepository] = None,
        ai_service: Optional[AIService] = None,
    ):
        self.repository = repository or ProjectRepository()
        self.ai_service = ai_service or get_ai_service()

        self.discovery_agent = DiscoveryAgent(self.ai_service)
        self.positioning_agent = PositioningAgent(self.ai_service)
        self.brand_shape_agent = BrandShapeAgent(self.ai_service)
        self.visual_direction_agent = VisualDirectionAgent(self.ai_service)
        self.critic_agent = CriticAgent(self.ai_service)
        self.consistency_agent = ConsistencyAgent(self.ai_service)
        self.delivery_agent = DeliveryAgent(self.ai_service)

    def execute_workflow(self, project_id: str, start_stage: str = "discovery") -> None:
        """Run workflow from start_stage to delivery."""
        project = self.repository.get(project_id)
        if not project:
            logger.error("Cannot run workflow for non-existent project: %s", project_id)
            return

        stage_idx = STAGE_ORDER.index(start_stage) if start_stage in STAGE_ORDER else 0
        stages_to_run = STAGE_ORDER[stage_idx:]

        for stage in stages_to_run:
            status_for_stage = STAGE_TO_STATUS[stage]
            self.repository.update_status(project_id, status=status_for_stage, failed_stage=None, error=None)

            try:
                # Reload project state for latest stage inputs
                current = self.repository.get(project_id)
                if not current:
                    break

                if stage == "discovery":
                    output = self.discovery_agent.run(
                        idea=current.input["idea"],
                        audience=current.input["audience"],
                        constraints=current.input.get("constraints", []),
                        tone=current.input.get("tone"),
                        references=current.input.get("references", []),
                    )
                    self.repository.update_stage_output(project_id, "discovery", output.model_dump())

                elif stage == "positioning":
                    output = self.positioning_agent.run(discovery=current.discovery)
                    self.repository.update_stage_output(project_id, "positioning", output.model_dump())

                elif stage == "shape":
                    output = self.brand_shape_agent.run(
                        discovery=current.discovery,
                        positioning=current.positioning,
                    )
                    self.repository.update_stage_output(project_id, "shape", output.model_dump())

                elif stage == "visual":
                    output = self.visual_direction_agent.run(
                        discovery=current.discovery,
                        positioning=current.positioning,
                        shape=current.shape,
                    )
                    self.repository.update_stage_output(project_id, "visual", output.model_dump())

                elif stage == "critique":
                    output = self.critic_agent.run(
                        discovery=current.discovery,
                        positioning=current.positioning,
                        shape=current.shape,
                        visual=current.visual,
                    )
                    self.repository.update_stage_output(project_id, "critique", output.model_dump())

                elif stage == "consistency":
                    output = self.consistency_agent.run(
                        positioning=current.positioning,
                        shape=current.shape,
                        visual=current.visual,
                        critique=current.critique,
                    )
                    self.repository.update_stage_output(project_id, "consistency", output.model_dump())

                elif stage == "delivery":
                    output = self.delivery_agent.run(
                        discovery=current.discovery,
                        positioning=current.positioning,
                        shape=current.shape,
                        visual=current.visual,
                        critique=current.critique,
                        consistency=current.consistency,
                        decisions=current.decisions,
                    )
                    self.repository.update_stage_output(project_id, "delivery", output.model_dump())

            except Exception as exc:
                logger.error("Workflow failed at stage '%s' for project %s: %s", stage, project_id, exc)
                safe_code = exc.code if isinstance(exc, AppException) else "AI_STAGE_FAILED"
                safe_message = exc.message if isinstance(exc, AppException) else f"Execution failed during stage '{stage}'."
                error_dict = {
                    "code": safe_code,
                    "message": safe_message,
                    "stage": stage,
                }
                self.repository.update_status(
                    project_id=project_id,
                    status="ERROR",
                    failed_stage=stage,
                    error=error_dict,
                )
                return

        # Mark completed upon finishing delivery
        self.repository.update_status(project_id, status="COMPLETED")
        logger.info("Workflow completed successfully for project %s", project_id)
