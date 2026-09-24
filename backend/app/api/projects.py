"""Projects API endpoints."""

from fastapi import APIRouter, Depends, status
from app.schemas.project import (
    ProjectCreateResponse,
    ProjectInput,
    ProjectResponse,
    ProjectStatusResponse,
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


def get_project_service() -> ProjectService:
    return ProjectService()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ProjectCreateResponse)
def create_project(
    payload: ProjectInput,
    service: ProjectService = Depends(get_project_service),
) -> ProjectCreateResponse:
    """Create a new brand system project in DRAFT state."""
    project = service.create_project(payload)
    return ProjectCreateResponse(
        project_id=project.id,
        status=project.status,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    service: ProjectService = Depends(get_project_service),
) -> ProjectResponse:
    """Fetch complete project state including inputs, stage deliverables, and decisions."""
    project = service.get_project(project_id)
    return ProjectResponse(**project.to_dict())


@router.get("/{project_id}/status", response_model=ProjectStatusResponse)
def get_project_status(
    project_id: str,
    service: ProjectService = Depends(get_project_service),
) -> ProjectStatusResponse:
    """Query current pipeline status, completed stages, and failure stage."""
    status_info = service.get_project_status(project_id)
    return ProjectStatusResponse(**status_info)
