"""Discovery stage schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field


class DiscoveryOutput(BaseModel):
    """Structured output for Stage 1: Discovery."""
    model_config = ConfigDict(extra="forbid")

    problem: str = Field(..., description="Core problem identified from the idea")
    target_user: str = Field(..., description="Detailed profile of the primary target user")
    context: str = Field(..., description="Market and environmental context")
    constraints: List[str] = Field(default_factory=list, description="Identified constraints and boundaries")
    known_value: str = Field(..., description="Validated or stated value proposition baseline")
    open_questions: List[str] = Field(default_factory=list, description="Unknowns and assumptions about the idea")
    follow_up_questions: List[str] = Field(default_factory=list, description="Concrete questions founder could answer to improve clarity")
