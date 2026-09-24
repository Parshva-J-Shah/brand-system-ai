"""Consistency stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.schemas.critique import CriticOutput
from app.schemas.consistency import ConsistencyOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class ConsistencyAgent:
    """Agent responsible for Stage 6: Consistency."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "consistency.txt").read_text(encoding="utf-8")

    def run(
        self,
        positioning: PositioningOutput | dict[str, Any],
        shape: BrandShapeOutput | dict[str, Any],
        visual: VisualOutput | dict[str, Any],
        critique: CriticOutput | dict[str, Any],
    ) -> ConsistencyOutput:
        """Execute Stage 6 cross-stage consistency audit."""
        pos_dict = positioning.model_dump() if isinstance(positioning, PositioningOutput) else positioning
        shape_dict = shape.model_dump() if isinstance(shape, BrandShapeOutput) else shape
        vis_dict = visual.model_dump() if isinstance(visual, VisualOutput) else visual
        crit_dict = critique.model_dump() if isinstance(critique, CriticOutput) else critique

        context = {
            "positioning_summary": pos_dict,
            "shape_summary": {
                "personality": shape_dict.get("personality"),
                "selected_name": shape_dict.get("selected_name"),
                "tagline": shape_dict.get("tagline"),
                "voice": shape_dict.get("voice"),
                "message_hierarchy": shape_dict.get("message_hierarchy"),
            },
            "visual_summary": vis_dict,
            "critic_summary": crit_dict,
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=ConsistencyOutput,
            stage="consistency",
        )
