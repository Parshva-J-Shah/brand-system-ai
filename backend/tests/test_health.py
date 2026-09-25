"""Health endpoint tests."""

import pytest
from app.config import settings


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_check_without_api_key(client, monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
