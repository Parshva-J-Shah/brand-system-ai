"""Critic stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.schemas.critique import CriticOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class CriticAgent:
    """Agent responsible for Stage 5: Critic."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "critic.txt").read_text(encoding="utf-8")

    def run(
        self,
        discovery: DiscoveryOutput | dict[str, Any],
        positioning: PositioningOutput | dict[str, Any],
        shape: BrandShapeOutput | dict[str, Any],
        visual: VisualOutput | dict[str, Any],
    ) -> CriticOutput:
        """Execute Stage 5 adversarial critique and vulnerability analysis."""
        disc_dict = discovery.model_dump() if isinstance(discovery, DiscoveryOutput) else discovery
        pos_dict = positioning.model_dump() if isinstance(positioning, PositioningOutput) else positioning
        shape_dict = shape.model_dump() if isinstance(shape, BrandShapeOutput) else shape
        vis_dict = visual.model_dump() if isinstance(visual, VisualOutput) else visual

        context = {
            "discovery_summary": {
                "target_user": disc_dict.get("target_user"),
                "problem": disc_dict.get("problem"),
                "known_value": disc_dict.get("known_value"),
            },
            "positioning_summary": pos_dict,
            "shape_summary": {
                "personality": shape_dict.get("personality"),
                "selected_name": shape_dict.get("selected_name"),
                "tagline": shape_dict.get("tagline"),
                "voice": shape_dict.get("voice"),
            },
            "visual_summary": vis_dict,
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=CriticOutput,
            stage="critique",
        )
