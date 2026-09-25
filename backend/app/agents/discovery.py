"""Discovery stage agent."""

from pathlib import Path
from typing import Any, List, Optional
from app.schemas.discovery import DiscoveryOutput
from app.services.ai_service import AIService, get_ai_service

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


class DiscoveryAgent:
    """Agent responsible for Stage 1: Discovery."""

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or get_ai_service()
        self.prompt_template = (PROMPTS_DIR / "discovery.txt").read_text(encoding="utf-8")

    def run(
        self,
        idea: str,
        audience: str,
        constraints: Optional[List[str]] = None,
        tone: Optional[str] = None,
        references: Optional[List[str]] = None,
    ) -> DiscoveryOutput:
        """Execute Stage 1 discovery analysis."""
        context = {
            "idea": idea,
            "audience": audience,
            "constraints": constraints or [],
            "tone": tone or "Not specified",
            "references": references or [],
        }
        return self.ai_service.generate_structured(
            prompt_template=self.prompt_template,
            context=context,
            schema=DiscoveryOutput,
            stage="discovery",
        )
