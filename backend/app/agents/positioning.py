"""Positioning stage agent."""

from pathlib import Path
from typing import Any, Optional
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class PositioningAgent:
    """Agent responsible for Stage 2: Positioning."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "positioning.txt").read_text(encoding="utf-8")

    def run(self, discovery: DiscoveryOutput | dict[str, Any]) -> PositioningOutput:
        """Execute Stage 2 strategic positioning."""
        disc_dict = discovery.model_dump() if isinstance(discovery, DiscoveryOutput) else discovery
        context = {
            "problem": disc_dict.get("problem", ""),
            "target_user": disc_dict.get("target_user", ""),
            "context": disc_dict.get("context", ""),
            "constraints": disc_dict.get("constraints", []),
            "known_value": disc_dict.get("known_value", ""),
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=PositioningOutput,
            stage="positioning",
        )
