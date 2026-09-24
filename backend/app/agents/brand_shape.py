"""Brand Shape stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class BrandShapeAgent:
    """Agent responsible for Stage 3: Brand Shape."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "brand_shape.txt").read_text(encoding="utf-8")

    def run(
        self,
        discovery: DiscoveryOutput | dict[str, Any],
        positioning: PositioningOutput | dict[str, Any],
    ) -> BrandShapeOutput:
        """Execute Stage 3 brand identity and naming architecture."""
        disc_dict = discovery.model_dump() if isinstance(discovery, DiscoveryOutput) else discovery
        pos_dict = positioning.model_dump() if isinstance(positioning, PositioningOutput) else positioning

        context = {
            "target_user": disc_dict.get("target_user", ""),
            "problem": disc_dict.get("problem", ""),
            "category": pos_dict.get("category", ""),
            "differentiator": pos_dict.get("differentiator", ""),
            "value_proposition": pos_dict.get("value_proposition", ""),
            "competitive_angle": pos_dict.get("competitive_angle", ""),
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=BrandShapeOutput,
            stage="shape",
        )
