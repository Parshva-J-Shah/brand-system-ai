"""Brand Shape stage schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field


class PersonalityTrait(BaseModel):
    model_config = ConfigDict(extra="forbid")
    trait: str = Field(..., description="Brand personality trait")
    reason: str = Field(..., description="Why this trait connects to the target audience")


class NamingTerritory(BaseModel):
    model_config = ConfigDict(extra="forbid")
    territory: str = Field(..., description="Creative naming theme or territory")
    rationale: str = Field(..., description="Strategic reasoning for this territory")
    example_names: List[str] = Field(..., description="List of concrete candidate names")


class BrandShapeOutput(BaseModel):
    """Structured output for Stage 3: Brand Shape."""
    model_config = ConfigDict(extra="forbid")

    personality: List[PersonalityTrait] = Field(
        ..., min_length=3, max_length=5, description="3-5 personality traits with audience-connected reasons"
    )
    traits_to_avoid: List[str] = Field(default_factory=list, description="Traits and tones the brand must avoid")
    naming_territories: List[NamingTerritory] = Field(
        ..., min_length=2, max_length=5, description="3-4 distinct creative naming territories"
    )
    selected_name: str = Field(..., description="Primary recommended brand name")
    tagline: str = Field(..., description="Memorable brand tagline")
    one_line_pitch: str = Field(..., description="Concise one-line elevator pitch")
    voice: str = Field(..., description="Overall voice and tone guidance")
    message_hierarchy: List[str] = Field(default_factory=list, description="Ranked key brand messages")
