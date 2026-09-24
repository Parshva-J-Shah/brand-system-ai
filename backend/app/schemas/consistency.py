"""Consistency stage schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field


class ConsistencyOutput(BaseModel):
    """Structured output for Stage 6: Consistency."""
    model_config = ConfigDict(extra="forbid")

    consistent: bool = Field(..., description="Whether the entire brand architecture is internally coherent")
    conflicts: List[str] = Field(default_factory=list, description="Specific cross-stage contradictions or misalignments")
    recommendations: List[str] = Field(default_factory=list, description="Guidance to resolve conflicts prior to final delivery")
