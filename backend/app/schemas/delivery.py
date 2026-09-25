"""Delivery stage schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.brand_shape import PersonalityTrait


class VoiceGuide(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str = Field(..., description="Brand voice persona summary")
    do: List[str] = Field(default_factory=list, description="Writing practices to follow")
    dont: List[str] = Field(default_factory=list, description="Writing patterns to strictly avoid")


class DeliveryOutput(BaseModel):
    """Structured output for Stage 7: Delivery."""
    model_config = ConfigDict(extra="forbid")

    brand_summary: str = Field(..., description="Executive brand synthesis")
    pitch: str = Field(..., description="Refined launch pitch")
    naming_direction: str = Field(..., description="Final brand name and rationale")
    tagline: str = Field(..., description="Approved launch tagline")
    personality: List[PersonalityTrait] = Field(..., description="Final personality traits")
    voice_guide: VoiceGuide = Field(..., description="Actionable voice and tone guide")
    visual_brief: str = Field(..., description="Concise creative visual direction brief")
    landing_headline: str = Field(..., description="Primary landing page headline and subhead")
    launch_message: str = Field(..., description="Launch announcement email or press copy")
    social_post: str = Field(..., description="High-impact launch social post")
    changes_from_critique: List[str] = Field(
        default_factory=list,
        description="Explicit record of refinements made in response to Critic and Consistency reviews",
    )
