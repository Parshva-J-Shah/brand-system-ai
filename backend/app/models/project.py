"""Project domain model."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, List, Optional
import json


@dataclass
class Project:
    id: str
    input: dict[str, Any]
    status: str
    failed_stage: Optional[str] = None
    discovery: Optional[dict[str, Any]] = None
    positioning: Optional[dict[str, Any]] = None
    shape: Optional[dict[str, Any]] = None
    visual: Optional[dict[str, Any]] = None
    critique: Optional[dict[str, Any]] = None
    consistency: Optional[dict[str, Any]] = None
    delivery: Optional[dict[str, Any]] = None
    decisions: dict[str, Any] = field(default_factory=dict)
    error: Optional[dict[str, Any]] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def get_completed_stages(self) -> List[str]:
        """Return ordered list of completed stage keys."""
        stages = []
        if self.discovery is not None:
            stages.append("discovery")
        if self.positioning is not None:
            stages.append("positioning")
        if self.shape is not None:
            stages.append("shape")
        if self.visual is not None:
            stages.append("visual")
        if self.critique is not None:
            stages.append("critique")
        if self.consistency is not None:
            stages.append("consistency")
        if self.delivery is not None:
            stages.append("delivery")
        return stages

    def to_dict(self) -> dict[str, Any]:
        """Serialize domain model to standard dictionary."""
        return {
            "project_id": self.id,
            "status": self.status,
            "input": self.input,
            "discovery": self.discovery,
            "positioning": self.positioning,
            "shape": self.shape,
            "visual": self.visual,
            "critique": self.critique,
            "consistency": self.consistency,
            "delivery": self.delivery,
            "decisions": self.decisions,
            "error": self.error,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
