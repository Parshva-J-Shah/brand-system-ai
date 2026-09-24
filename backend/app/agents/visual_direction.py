"""Visual Direction stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class VisualDirectionAgent:
    """Agent responsible for Stage 4: Visual Direction."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "visual.txt").read_text(encoding="utf-8")

    def run(
        self,
        discovery: DiscoveryOutput | dict[str, Any],
        positioning: PositioningOutput | dict[str, Any],
        shape: BrandShapeOutput | dict[str, Any],
    ) -> VisualOutput:
        """Execute Stage 4 structured visual guidance synthesis."""
        disc_dict = discovery.model_dump() if isinstance(discovery, DiscoveryOutput) else discovery
        pos_dict = positioning.model_dump() if isinstance(positioning, PositioningOutput) else positioning
        shape_dict = shape.model_dump() if isinstance(shape, BrandShapeOutput) else shape

        context = {
            "category": pos_dict.get("category", ""),
            "target_user": disc_dict.get("target_user", ""),
            "personality": shape_dict.get("personality", []),
            "selected_name": shape_dict.get("selected_name", ""),
            "tagline": shape_dict.get("tagline", ""),
            "voice": shape_dict.get("voice", ""),
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=VisualOutput,
            stage="visual",
        )
