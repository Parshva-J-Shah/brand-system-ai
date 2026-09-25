"""Health check API route."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def get_health() -> dict[str, str]:
    """Check API server health. Operates without requiring AI keys."""
    return {"status": "ok"}
