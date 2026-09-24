"""Pytest fixtures and test environment setup."""

import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from app.database.database import init_db, set_database_path
from app.main import app
from app.models.project import Project
from app.schemas.brand_shape import BrandShapeOutput, NamingTerritory, PersonalityTrait
from app.schemas.consistency import ConsistencyOutput
from app.schemas.critique import CriticOutput, CritiqueIssue
from app.schemas.delivery import DeliveryOutput, VoiceGuide
from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.visual import VisualOutput
from app.services.ai_service import AIService, set_ai_service


def get_mock_discovery() -> DiscoveryOutput:
    return DiscoveryOutput(
        problem="High customer acquisition costs for indie brands.",
        target_user="Early-stage bootstrap founders and solo creators.",
        context="Crowded direct-to-consumer software marketplace.",
        constraints=["Bootstrapped budget", "Launch in 30 days"],
        known_value="Automated high-conversion branding assets.",
        open_questions=["What is the primary organic acquisition channel?"],
        follow_up_questions=["Which specific industry vertical are you targeting first?"],
    )


def get_mock_positioning() -> PositioningOutput:
    return PositioningOutput(
        category="Automated Brand Intelligence Platform",
        differentiator="Multi-stage agentic reasoning with rigorous strategic critique",
        value_proposition="Turn rough ideas into launch-ready brand systems in minutes, not weeks.",
        competitive_angle="Strategic depth compared to surface-level one-shot prompt generators.",
    )


def get_mock_shape() -> BrandShapeOutput:
    return BrandShapeOutput(
        personality=[
            PersonalityTrait(trait="Pragmatic", reason="Resonates with no-nonsense bootstrap founders"),
            PersonalityTrait(trait="Insightful", reason="Instills strategic confidence in solo operators"),
            PersonalityTrait(trait="Audacious", reason="Inspires bold market entry"),
        ],
        traits_to_avoid=["Corporate bureaucracy", "Generic marketing fluff"],
        naming_territories=[
            NamingTerritory(
                territory="Speed and Velocity",
                rationale="Emphasizes fast time-to-market",
                example_names=["VeloceBrand", "SprintMark", "LaunchPulse"],
            ),
            NamingTerritory(
                territory="Clarity and Intelligence",
                rationale="Highlights deep strategic positioning",
                example_names=["BrandPrism", "FoundryAI", "Stratum"],
            ),
        ],
        selected_name="BrandPrism",
        tagline="Clarity from Idea to Launch",
        one_line_pitch="BrandPrism transforms raw startup concepts into battle-tested brand systems.",
        voice="Direct, authoritative, energetic, and transparent",
        message_hierarchy=["Instant brand architecture", "Adversarial critique", "Launch-ready assets"],
    )


def get_mock_visual() -> VisualOutput:
    return VisualOutput(
        typography="Display serif headline paired with geometric sans-serif body",
        color_mood="Deep obsidian slate with electric emerald accent for clarity and precision",
        composition="Generous whitespace, structured asymmetrical grid, typographic hierarchy",
        symbols=["Prism refraction icon", "Geometric convergence mark"],
        image_style="High-contrast monochromatic textures with laser-focused lighting",
        concepts_to_avoid=["Generic puzzle pieces", "Overused gradient blobs"],
    )


def get_mock_critic() -> CriticOutput:
    return CriticOutput(
        issues=[
            CritiqueIssue(
                issue="Tagline could be even sharper regarding execution speed",
                why_it_is_a_problem="Founders need immediate proof of speed",
                suggested_change="Highlight instantaneous execution in secondary copy",
                severity="low",
                affected_stage="shape",
            )
        ],
        overall_assessment="Strong positioning with defensible competitive angle.",
    )


def get_mock_consistency() -> ConsistencyOutput:
    return ConsistencyOutput(
        consistent=True,
        conflicts=[],
        recommendations=["Ensure launch post tone matches the energetic direct voice."],
    )


def get_mock_delivery() -> DeliveryOutput:
    return DeliveryOutput(
        brand_summary="BrandPrism delivers automated brand intelligence for high-velocity founders.",
        pitch="BrandPrism cuts out weeks of agency back-and-forth by running multi-stage reasoning to build complete brand systems.",
        naming_direction="BrandPrism: balances optics of precision and multifaceted intelligence.",
        tagline="Clarity from Idea to Launch",
        personality=[
            PersonalityTrait(trait="Pragmatic", reason="Resonates with no-nonsense bootstrap founders"),
            PersonalityTrait(trait="Insightful", reason="Instills strategic confidence in solo operators"),
            PersonalityTrait(trait="Audacious", reason="Inspires bold market entry"),
        ],
        voice_guide=VoiceGuide(
            description="Direct and authoritative voice focused on actionable execution.",
            do=["Be direct and concise", "Use concrete data points"],
            dont=["Avoid corporate buzzwords like synergy or seamless"],
        ),
        visual_brief="Obsidian slate background with electric emerald accents and crisp typography.",
        landing_headline="From Raw Concept to Launch-Ready Brand in Minutes",
        launch_message="Today we are unveiling BrandPrism: the first staged AI brand intelligence engine.",
        social_post="Stop wasting weeks on generic branding. Announcing BrandPrism: staged AI reasoning for founders. #startup #branding",
        changes_from_critique=["Tightened tagline copy to emphasize execution speed based on Critic feedback."],
    )


class MockAIService(AIService):
    """Deterministic mock of AIService for test suites."""

    def __init__(self, should_fail_stage: str | None = None, fail_repair: bool = True):
        super().__init__(api_key="mock-key-for-tests")
        self.should_fail_stage = should_fail_stage
        self.fail_repair = fail_repair
        self.repair_called = False
        self.call_history = []

    def generate_structured(self, prompt_template: str, context: dict, schema: type, stage: str):
        self.call_history.append((stage, schema))

        if self.should_fail_stage == stage:
            if not self.repair_called:
                self.repair_called = True
                if not self.fail_repair:
                    # Repair succeeds on attempt 2
                    return self._get_mock_output(stage)
            from app.utils.errors import AIOutputInvalidError
            raise AIOutputInvalidError(f"Simulated failure in stage {stage}", stage=stage)

        return self._get_mock_output(stage)

    def _get_mock_output(self, stage: str):
        generators = {
            "discovery": get_mock_discovery,
            "positioning": get_mock_positioning,
            "shape": get_mock_shape,
            "visual": get_mock_visual,
            "critique": get_mock_critic,
            "consistency": get_mock_consistency,
            "delivery": get_mock_delivery,
        }
        gen = generators.get(stage.lower())
        if gen:
            return gen()
        raise ValueError(f"Unknown mock stage {stage}")


@pytest.fixture
def mock_ai():
    service = MockAIService()
    set_ai_service(service)
    yield service


@pytest.fixture
def test_db(tmp_path):
    db_file = str(tmp_path / "test_app.db")
    set_database_path(db_file)
    init_db()
    yield db_file


@pytest.fixture
def client(test_db, mock_ai):
    with TestClient(app) as c:
        yield c
