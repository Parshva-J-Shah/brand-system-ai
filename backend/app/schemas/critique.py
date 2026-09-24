"""Critic stage schema."""

from typing import List, Literal
from pydantic import BaseModel, ConfigDict, Field


class CritiqueIssue(BaseModel):
    model_config = ConfigDict(extra="forbid")

    issue: str = Field(..., description="The specific weakness or issue found")
    why_it_is_a_problem: str = Field(..., description="Explanation of why this damages the brand")
    suggested_change: str = Field(..., description="Actionable recommendation to fix the issue")
    severity: Literal["low", "medium", "high"] = Field(..., description="Severity level")
    affected_stage: Literal["positioning", "shape", "visual"] = Field(..., description="Which prior stage is affected")


class CriticOutput(BaseModel):
    """Structured output for Stage 5: Critic."""
    model_config = ConfigDict(extra="forbid")

    issues: List[CritiqueIssue] = Field(default_factory=list, description="Identified critical issues")
    overall_assessment: str = Field(..., description="Overall strategic critique summary")
