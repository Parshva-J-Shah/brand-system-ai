"""Project management and decision routing service."""

import logging
import uuid
from typing import Any, List, Optional
from pydantic import ValidationError

from app.database.repositories import ProjectRepository
from app.models.project import Project
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.schemas.delivery import DeliveryOutput
from app.schemas.project import ProjectInput
from app.services.workflow_service import RUNNING_STATUSES, STAGE_ORDER, STAGE_TO_STATUS
from app.utils.errors import (
    AppException,
    InvalidDecisionFieldError,
    ProjectNotFoundError,
    WorkflowAlreadyRunningError,
)

logger = logging.getLogger(__name__)

# Field mapping table
INPUT_FIELDS = {"idea", "audience", "constraints", "tone", "references"}
DISCOVERY_FIELDS = {
    "problem",
    "target_user",
    "context",
    "known_value",
    "constraints",
    "open_questions",
    "follow_up_questions",
}
POSITIONING_FIELDS = {
    "category",
    "differentiator",
    "value_proposition",
    "competitive_angle",
}
SHAPE_FIELDS = {
    "personality",
    "traits_to_avoid",
    "naming_territories",
    "selected_name",
    "tagline",
    "one_line_pitch",
    "voice",
    "message_hierarchy",
}
VISUAL_FIELDS = {
    "typography",
    "color_mood",
    "composition",
    "symbols",
    "image_style",
    "concepts_to_avoid",
}
DELIVERY_FIELDS = {
    "brand_summary",
    "pitch",
    "naming_direction",
    "tagline",
    "personality",
    "voice_guide",
    "visual_brief",
    "landing_headline",
    "launch_message",
    "social_post",
    "changes_from_critique",
}


class ProjectService:
    """Manages project lifecycle, decision injection, and stage invalidation."""

    def __init__(self, repository: Optional[ProjectRepository] = None):
        self.repository = repository or ProjectRepository()

    def create_project(self, input_data: ProjectInput) -> Project:
        """Create and persist a new project in DRAFT status."""
        project_id = str(uuid.uuid4())
        project = Project(
            id=project_id,
            input=input_data.model_dump(),
            status="DRAFT",
        )
        return self.repository.create(project)

    def get_project(self, project_id: str) -> Project:
        """Retrieve a project by ID or raise 404."""
        project = self.repository.get(project_id)
        if not project:
            raise ProjectNotFoundError(project_id)
        return project

    def get_project_status(self, project_id: str) -> dict[str, Any]:
        """Return structured status with completed stages and failure info."""
        project = self.get_project(project_id)
        return {
            "project_id": project.id,
            "status": project.status,
            "completed_stages": project.get_completed_stages(),
            "failed_stage": project.failed_stage,
        }

    def prepare_generation(self, project_id: str) -> tuple[Project, str]:
        """Verify project state and determine starting stage for generation."""
        project = self.get_project(project_id)

        if project.status in RUNNING_STATUSES:
            raise WorkflowAlreadyRunningError(project_id)

        start_stage = "discovery"
        if project.status == "ERROR" and project.failed_stage:
            # Check if prior stage requirements are intact
            failed_stage = project.failed_stage.lower()
            if failed_stage in STAGE_ORDER:
                start_stage = failed_stage

        initial_status = STAGE_TO_STATUS[start_stage]
        self.repository.update_status(project_id, status=initial_status, failed_stage=None, error=None)
        updated_project = self.get_project(project_id)
        return updated_project, start_stage

    def apply_decision(self, project_id: str, field_name: str, value: Any) -> tuple[list[str], str]:
        """Validate decision edit, write directly to stage data, and return rerun stages."""
        project = self.get_project(project_id)

        if project.status in RUNNING_STATUSES:
            raise WorkflowAlreadyRunningError(project_id)

        target_stage: str
        rerun_from_stage: str
        rerun_stages: list[str]

        if field_name in INPUT_FIELDS:
            target_stage = "input"
            # Validate input field
            temp_input = dict(project.input)
            temp_input[field_name] = value
            try:
                validated_input = ProjectInput.model_validate(temp_input)
                project.input = validated_input.model_dump()
                self.repository.update(project)
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422)

            rerun_from_stage = "discovery"
            rerun_stages = list(STAGE_ORDER)

        elif field_name in DISCOVERY_FIELDS:
            target_stage = "discovery"
            if not project.discovery:
                raise AppException(
                    code="VALIDATION_ERROR",
                    message="Cannot update discovery field before Discovery stage has completed.",
                    status_code=422,
                    stage="discovery",
                )
            temp_stage = dict(project.discovery)
            temp_stage[field_name] = value
            try:
                validated = DiscoveryOutput.model_validate(temp_stage)
                self.repository.update_stage_output(project_id, "discovery", validated.model_dump())
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422, stage="discovery")

            rerun_from_stage = "positioning"
            idx = STAGE_ORDER.index("positioning")
            rerun_stages = STAGE_ORDER[idx:]

        elif field_name in POSITIONING_FIELDS:
            target_stage = "positioning"
            if not project.positioning:
                raise AppException(
                    code="VALIDATION_ERROR",
                    message="Cannot update positioning field before Positioning stage has completed.",
                    status_code=422,
                    stage="positioning",
                )
            temp_stage = dict(project.positioning)
            temp_stage[field_name] = value
            try:
                validated = PositioningOutput.model_validate(temp_stage)
                self.repository.update_stage_output(project_id, "positioning", validated.model_dump())
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422, stage="positioning")

            rerun_from_stage = "shape"
            idx = STAGE_ORDER.index("shape")
            rerun_stages = STAGE_ORDER[idx:]

        elif field_name in SHAPE_FIELDS:
            target_stage = "shape"
            if not project.shape:
                raise AppException(
                    code="VALIDATION_ERROR",
                    message="Cannot update shape field before Brand Shape stage has completed.",
                    status_code=422,
                    stage="shape",
                )
            temp_stage = dict(project.shape)
            temp_stage[field_name] = value
            try:
                validated = BrandShapeOutput.model_validate(temp_stage)
                self.repository.update_stage_output(project_id, "shape", validated.model_dump())
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422, stage="shape")

            rerun_from_stage = "visual"
            idx = STAGE_ORDER.index("visual")
            rerun_stages = STAGE_ORDER[idx:]

        elif field_name in VISUAL_FIELDS:
            target_stage = "visual"
            if not project.visual:
                raise AppException(
                    code="VALIDATION_ERROR",
                    message="Cannot update visual field before Visual Direction stage has completed.",
                    status_code=422,
                    stage="visual",
                )
            temp_stage = dict(project.visual)
            temp_stage[field_name] = value
            try:
                validated = VisualOutput.model_validate(temp_stage)
                self.repository.update_stage_output(project_id, "visual", validated.model_dump())
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422, stage="visual")

            rerun_from_stage = "critique"
            idx = STAGE_ORDER.index("critique")
            rerun_stages = STAGE_ORDER[idx:]

        elif field_name in DELIVERY_FIELDS:
            target_stage = "delivery"
            if not project.delivery:
                raise AppException(
                    code="VALIDATION_ERROR",
                    message="Cannot update delivery field before Delivery stage has completed.",
                    status_code=422,
                    stage="delivery",
                )
            temp_stage = dict(project.delivery)
            temp_stage[field_name] = value
            try:
                validated = DeliveryOutput.model_validate(temp_stage)
                self.repository.update_stage_output(project_id, "delivery", validated.model_dump())
            except ValidationError as e:
                raise AppException(code="VALIDATION_ERROR", message=str(e), status_code=422, stage="delivery")

            rerun_from_stage = "delivery"
            rerun_stages = ["delivery"]

        else:
            raise InvalidDecisionFieldError(field_name)

        # Record decision
        self.repository.record_decision(project_id, field_name, value)

        # Clear downstream stages in DB
        self.repository.clear_downstream_stages(project_id, rerun_stages)

        # Update status to the first rerun stage's status
        initial_status = STAGE_TO_STATUS[rerun_from_stage]
        self.repository.update_status(project_id, status=initial_status, failed_stage=None, error=None)

        return rerun_stages, rerun_from_stage
