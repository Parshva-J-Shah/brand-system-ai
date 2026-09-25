"""Project endpoints and input validation tests."""

import pytest


def test_create_project_valid(client):
    payload = {
        "idea": "An AI platform that creates automated brand architectures for startups.",
        "audience": "Solo founders, indie hackers, and pre-seed startups.",
        "constraints": ["Fast turnaround", "Budget friendly"],
        "tone": "Direct and insightful",
        "references": ["Linear", "Stripe"],
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "project_id" in data
    assert data["status"] == "DRAFT"


def test_create_project_constraints_string_normalized(client):
    payload = {
        "idea": "An AI platform that creates automated brand architectures for startups.",
        "audience": "Solo founders",
        "constraints": "Single constraint string",
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 201
    project_id = response.json()["project_id"]

    get_res = client.get(f"/api/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["input"]["constraints"] == ["Single constraint string"]


def test_create_project_too_short_idea(client):
    payload = {
        "idea": "Too short",
        "audience": "Founders",
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "traceback" not in response.text


def test_create_project_missing_audience(client):
    payload = {
        "idea": "An AI platform that creates automated brand architectures for startups.",
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_create_project_extra_field_forbidden(client):
    payload = {
        "idea": "An AI platform that creates automated brand architectures for startups.",
        "audience": "Founders",
        "unexpected_field": "Not allowed",
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_get_project_success(client):
    create_res = client.post(
        "/api/projects",
        json={
            "idea": "Automated legal contract intelligence and compliance checker.",
            "audience": "Lawyers and compliance officers",
        },
    )
    project_id = create_res.json()["project_id"]

    get_res = client.get(f"/api/projects/{project_id}")
    assert get_res.status_code == 200
    body = get_res.json()
    assert body["project_id"] == project_id
    assert body["status"] == "DRAFT"
    assert body["discovery"] is None
    assert body["delivery"] is None
    assert body["decisions"] == {}
    assert "created_at" in body
    assert "updated_at" in body


def test_get_project_not_found(client):
    response = client.get("/api/projects/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "PROJECT_NOT_FOUND"
    assert "00000000-0000-0000-0000-000000000000" in data["error"]["message"]


def test_get_project_status(client):
    create_res = client.post(
        "/api/projects",
        json={
            "idea": "Automated legal contract intelligence and compliance checker.",
            "audience": "Lawyers and compliance officers",
        },
    )
    project_id = create_res.json()["project_id"]

    status_res = client.get(f"/api/projects/{project_id}/status")
    assert status_res.status_code == 200
    data = status_res.json()
    assert data["project_id"] == project_id
    assert data["status"] == "DRAFT"
    assert data["completed_stages"] == []
    assert data["failed_stage"] is None
