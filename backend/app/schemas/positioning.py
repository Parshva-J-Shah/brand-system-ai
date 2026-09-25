"""Positioning stage schema."""

from pydantic import BaseModel, ConfigDict, Field


class PositioningOutput(BaseModel):
    """Structured output for Stage 2: Positioning."""
    model_config = ConfigDict(extra="forbid")

    category: str = Field(..., description="Defined market or product category")
    differentiator: str = Field(..., description="Primary point of differentiation")
    value_proposition: str = Field(..., description="Clear, compelling value proposition statement")
    competitive_angle: str = Field(..., description="Strategic angle against alternatives or competitors")
