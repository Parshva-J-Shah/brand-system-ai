"""Delivery stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput
from app.schemas.visual import VisualOutput
from app.schemas.critique import CriticOutput
from app.schemas.consistency import ConsistencyOutput
from app.schemas.delivery import DeliveryOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class DeliveryAgent:
    """Agent responsible for Stage 7: Delivery."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "delivery.txt").read_text(encoding="utf-8")

    def run(
        self,
        discovery: DiscoveryOutput | dict[str, Any],
        positioning: PositioningOutput | dict[str, Any],
        shape: BrandShapeOutput | dict[str, Any],
        visual: VisualOutput | dict[str, Any],
        critique: CriticOutput | dict[str, Any],
        consistency: ConsistencyOutput | dict[str, Any],
        decisions: Optional[dict[str, Any]] = None,
    ) -> DeliveryOutput:
        """Execute Stage 7 final launch package synthesis."""
        disc_dict = discovery.model_dump() if isinstance(discovery, DiscoveryOutput) else discovery
        pos_dict = positioning.model_dump() if isinstance(positioning, PositioningOutput) else positioning
        shape_dict = shape.model_dump() if isinstance(shape, BrandShapeOutput) else shape
        vis_dict = visual.model_dump() if isinstance(visual, VisualOutput) else visual
        crit_dict = critique.model_dump() if isinstance(critique, CriticOutput) else critique
        con_dict = consistency.model_dump() if isinstance(consistency, ConsistencyOutput) else consistency

        context = {
            "discovery_summary": disc_dict,
            "positioning_summary": pos_dict,
            "shape_summary": shape_dict,
            "visual_summary": vis_dict,
            "critic_summary": crit_dict,
            "consistency_summary": con_dict,
            "decisions_summary": decisions or {},
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=DeliveryOutput,
            stage="delivery",
        )
