"""Workflow and decision execution endpoints."""

from fastapi import APIRouter, BackgroundTasks, Depends, status
from app.schemas.project import (
    DecisionUpdateRequest,
    DecisionUpdateResponse,
    ProjectGenerateResponse,
)
from app.services.project_service import ProjectService
from app.services.workflow_service import WorkflowService

router = APIRouter(prefix="/projects", tags=["workflow"])


def get_project_service() -> ProjectService:
    return ProjectService()


def get_workflow_service() -> WorkflowService:
    return WorkflowService()


@router.post(
    "/{project_id}/generate",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ProjectGenerateResponse,
)
def start_generation(
    project_id: str,
    background_tasks: BackgroundTasks,
    project_service: ProjectService = Depends(get_project_service),
    workflow_service: WorkflowService = Depends(get_workflow_service),
) -> ProjectGenerateResponse:
    """Trigger brand generation workflow in the background."""
    project, start_stage = project_service.prepare_generation(project_id)
    background_tasks.add_task(workflow_service.execute_workflow, project_id, start_stage)
    return ProjectGenerateResponse(
        project_id=project.id,
        status=project.status,
    )


@router.patch(
    "/{project_id}/decisions",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=DecisionUpdateResponse,
)
def update_decision(
    project_id: str,
    decision: DecisionUpdateRequest,
    background_tasks: BackgroundTasks,
    project_service: ProjectService = Depends(get_project_service),
    workflow_service: WorkflowService = Depends(get_workflow_service),
) -> DecisionUpdateResponse:
    """Record user decision, directly update stage output, and trigger partial rerun in background."""
    rerun_stages, rerun_from_stage = project_service.apply_decision(
        project_id=project_id,
        field_name=decision.field,
        value=decision.value,
    )
    background_tasks.add_task(
        workflow_service.execute_workflow,
        project_id,
        rerun_from_stage,
    )
    current_status = project_service.get_project(project_id).status
    return DecisionUpdateResponse(
        project_id=project_id,
        status=current_status,
        rerun_stages=rerun_stages,
    )
