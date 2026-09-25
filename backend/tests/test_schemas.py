"""Unit tests for Pydantic schema validation across all stages."""

import pytest
from pydantic import ValidationError

from app.schemas.discovery import DiscoveryOutput
from app.schemas.positioning import PositioningOutput
from app.schemas.brand_shape import BrandShapeOutput, PersonalityTrait, NamingTerritory
from app.schemas.visual import VisualOutput
from app.schemas.critique import CriticOutput, CritiqueIssue
from app.schemas.consistency import ConsistencyOutput
from app.schemas.delivery import DeliveryOutput, VoiceGuide
from tests.conftest import (
    get_mock_discovery,
    get_mock_positioning,
    get_mock_shape,
    get_mock_visual,
    get_mock_critic,
    get_mock_consistency,
    get_mock_delivery,
)


def test_discovery_schema_valid():
    disc = get_mock_discovery()
    assert disc.problem
    assert len(disc.open_questions) > 0


def test_discovery_schema_extra_fields_forbidden():
    data = get_mock_discovery().model_dump()
    data["extra_unwanted"] = "value"
    with pytest.raises(ValidationError):
        DiscoveryOutput.model_validate(data)


def test_positioning_schema_valid():
    pos = get_mock_positioning()
    assert pos.category
    assert pos.differentiator


def test_brand_shape_personality_length_constraints():
    shape = get_mock_shape()
    # Less than 3 personality items should fail
    data = shape.model_dump()
    data["personality"] = [
        {"trait": "Fast", "reason": "Speed"}
    ]
    with pytest.raises(ValidationError):
        BrandShapeOutput.model_validate(data)


def test_visual_schema_valid():
    vis = get_mock_visual()
    assert vis.typography
    assert vis.color_mood


def test_critic_schema_severity_literal():
    crit = get_mock_critic()
    data = crit.model_dump()
    data["issues"][0]["severity"] = "critical"  # Not in ("low", "medium", "high")
    with pytest.raises(ValidationError):
        CriticOutput.model_validate(data)


def test_consistency_schema_valid():
    con = get_mock_consistency()
    assert con.consistent is True
    assert isinstance(con.conflicts, list)


def test_delivery_schema_valid():
    deliv = get_mock_delivery()
    assert deliv.brand_summary
    assert len(deliv.changes_from_critique) > 0
    assert deliv.voice_guide.description
