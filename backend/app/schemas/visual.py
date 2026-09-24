"""Visual Direction stage schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field


class VisualOutput(BaseModel):
    """Structured output for Stage 4: Visual Direction."""
    model_config = ConfigDict(extra="forbid")

    typography: str = Field(..., description="Typography direction and font personality")
    color_mood: str = Field(..., description="Color palette atmosphere and psychological mood")
    composition: str = Field(..., description="Spatial layout and design composition rules")
    symbols: List[str] = Field(default_factory=list, description="Key iconography, visual motifs, or symbolic marks")
    image_style: str = Field(..., description="Photography, illustration, and rendering style")
    concepts_to_avoid: List[str] = Field(default_factory=list, description="Visual clichés and patterns to avoid")
