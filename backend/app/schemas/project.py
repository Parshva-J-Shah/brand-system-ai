"""Pydantic schemas for project inputs, responses, and workflow status."""

from datetime import datetime
from typing import Any, List, Optional, Union
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.schemas.critique import CriticOutput
from app.schemas.consistency import ConsistencyOutput
from app.schemas.delivery import DeliveryOutput


class ProjectInput(BaseModel):
    """Input payload for creating a brand system project."""
    model_config = ConfigDict(extra="forbid")

    idea: str = Field(..., min_length=10, max_length=2000, description="The startup or product idea")
    audience: str = Field(..., min_length=1, description="Target audience definition")
    constraints: Optional[Union[List[str], str]] = Field(default_factory=list, description="Constraints or guidelines")
    tone: Optional[str] = Field(default=None, description="Desired brand tone")
    references: Optional[Union[List[str], str]] = Field(default_factory=list, description="Reference brands or products")

    @field_validator("constraints", mode="before")
    @classmethod
    def normalize_constraints(cls, v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, str):
            v = v.strip()
            return [v] if v else []
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return []

    @field_validator("references", mode="before")
    @classmethod
    def normalize_references(cls, v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, str):
            v = v.strip()
            return [v] if v else []
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return []


class ProjectCreateResponse(BaseModel):
    project_id: str
    status: str


class ProjectGenerateResponse(BaseModel):
    project_id: str
    status: str


class ProjectStatusResponse(BaseModel):
    project_id: str
    status: str
    completed_stages: List[str]
    failed_stage: Optional[str] = None


class DecisionUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    field: str
    value: Any


class DecisionUpdateResponse(BaseModel):
    project_id: str
    status: str
    rerun_stages: List[str]


class ErrorItem(BaseModel):
    code: str
    message: str
    stage: Optional[str] = None


class ErrorEnvelope(BaseModel):
    error: ErrorItem


class ProjectResponse(BaseModel):
    project_id: str
    status: str
    input: dict[str, Any]
    discovery: Optional[DiscoveryOutput] = None
    positioning: Optional[PositioningOutput] = None
    shape: Optional[BrandShapeOutput] = None
    visual: Optional[VisualOutput] = None
    critique: Optional[CriticOutput] = None
    consistency: Optional[ConsistencyOutput] = None
    delivery: Optional[DeliveryOutput] = None
    decisions: dict[str, Any] = Field(default_factory=dict)
    error: Optional[dict[str, Any]] = None
    created_at: str
    updated_at: str
