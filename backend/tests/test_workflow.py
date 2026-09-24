"""End-to-end and background workflow tests."""

import pytest
from app.database.repositories import ProjectRepository
from app.services.ai_service import AIService, set_ai_service
from app.services.workflow_service import WorkflowService
from tests.conftest import MockAIService


def test_start_generation_returns_202(client):
    create_res = client.post(
        "/api/projects",
        json={
            "idea": "AI-powered brand strategy and identity design for indie developers.",
            "audience": "Indie hackers and solo founders",
        },
    )
    project_id = create_res.json()["project_id"]

    gen_res = client.post(f"/api/projects/{project_id}/generate")
    assert gen_res.status_code == 202
    assert gen_res.json()["project_id"] == project_id
    assert gen_res.json()["status"] == "DISCOVERING"


def test_complete_workflow_execution(test_db):
    repo = ProjectRepository()
    mock_ai = MockAIService()
    set_ai_service(mock_ai)

    # Create project directly
    from app.models.project import Project

    project = Project(
        id="test-full-flow-1",
        input={
            "idea": "AI-powered brand strategy and identity design for indie developers.",
            "audience": "Indie hackers and solo founders",
            "constraints": ["Fast turnaround"],
        },
        status="DRAFT",
    )
    repo.create(project)

    # Run workflow synchronously using the service
    workflow = WorkflowService(repository=repo, ai_service=mock_ai)
    workflow.execute_workflow(project.id, start_stage="discovery")

    # Fetch updated project
    completed_proj = repo.get(project.id)
    assert completed_proj.status == "COMPLETED"
    assert completed_proj.failed_stage is None
    assert completed_proj.error is None

    # Check that all 7 stages are populated
    assert completed_proj.discovery is not None
    assert completed_proj.positioning is not None
    assert completed_proj.shape is not None
    assert completed_proj.visual is not None
    assert completed_proj.critique is not None
    assert completed_proj.consistency is not None
    assert completed_proj.delivery is not None

    # Verify stage order in completed stages
    expected_stages = [
        "discovery",
        "positioning",
        "shape",
        "visual",
        "critique",
        "consistency",
        "delivery",
    ]
    assert completed_proj.get_completed_stages() == expected_stages


def test_workflow_already_running_returns_409(client):
    create_res = client.post(
        "/api/projects",
        json={
            "idea": "Autonomous customer interview platform for software founders.",
            "audience": "SaaS product managers",
        },
    )
    project_id = create_res.json()["project_id"]

    repo = ProjectRepository()
    repo.update_status(project_id, status="SHAPING")

    gen_res = client.post(f"/api/projects/{project_id}/generate")
    assert gen_res.status_code == 409
    data = gen_res.json()
    assert data["error"]["code"] == "WORKFLOW_ALREADY_RUNNING"


def test_ai_validation_failure_halts_workflow(test_db):
    repo = ProjectRepository()
    # Mock AI configured to fail on stage "visual"
    failing_ai = MockAIService(should_fail_stage="visual", fail_repair=True)
    set_ai_service(failing_ai)

    from app.models.project import Project

    project = Project(
        id="test-fail-flow-1",
        input={
            "idea": "An AI platform creating verified scientific citations.",
            "audience": "Researchers",
        },
        status="DRAFT",
    )
    repo.create(project)

    workflow = WorkflowService(repository=repo, ai_service=failing_ai)
    workflow.execute_workflow(project.id, start_stage="discovery")

    res = repo.get(project.id)
    assert res.status == "ERROR"
    assert res.failed_stage == "visual"
    assert res.error is not None
    assert res.error["code"] == "AI_OUTPUT_INVALID"
    assert res.error["stage"] == "visual"

    # Upstream stages succeeded
    assert res.discovery is not None
    assert res.positioning is not None
    assert res.shape is not None

    # Visual failed; downstream stages were NEVER executed
    assert res.visual is None
    assert res.critique is None
    assert res.consistency is None
    assert res.delivery is None


def test_decision_update_partial_rerun(client, test_db):
    repo = ProjectRepository()
    mock_ai = MockAIService()
    set_ai_service(mock_ai)

    # 1. Create and run full project to completion
    from app.models.project import Project

    project = Project(
        id="test-decision-flow-1",
        input={
            "idea": "Smart coffee roasting automation system for specialty cafes.",
            "audience": "Artisan cafe owners",
        },
        status="DRAFT",
    )
    repo.create(project)

    workflow = WorkflowService(repository=repo, ai_service=mock_ai)
    workflow.execute_workflow(project.id, start_stage="discovery")

    initial_proj = repo.get(project.id)
    assert initial_proj.status == "COMPLETED"
    original_discovery = initial_proj.discovery

    # 2. Patch decision on positioning field: 'category'
    patch_res = client.patch(
        f"/api/projects/{project.id}/decisions",
        json={
            "field": "category",
            "value": "Artisan Coffee Precision Intelligence",
        },
    )
    assert patch_res.status_code == 202
    data = patch_res.json()
    assert data["project_id"] == project.id
    # Downstream stages should be shape through delivery
    assert data["rerun_stages"] == ["shape", "visual", "critique", "consistency", "delivery"]

    # 3. Check that positioning was updated in place and discovery is untouched
    updated_proj = repo.get(project.id)
    assert updated_proj.positioning["category"] == "Artisan Coffee Precision Intelligence"
    assert updated_proj.discovery == original_discovery

    # 4. Check decisions dict records the override
    assert "category" in updated_proj.decisions
    assert updated_proj.decisions["category"]["value"] == "Artisan Coffee Precision Intelligence"


def test_invalid_decision_field_returns_422(client):
    create_res = client.post(
        "/api/projects",
        json={
            "idea": "Smart coffee roasting automation system for specialty cafes.",
            "audience": "Artisan cafe owners",
        },
    )
    project_id = create_res.json()["project_id"]

    patch_res = client.patch(
        f"/api/projects/{project_id}/decisions",
        json={
            "field": "non_existent_field_xyz",
            "value": "invalid",
        },
    )
    assert patch_res.status_code == 422
    assert patch_res.json()["error"]["code"] == "INVALID_DECISION_FIELD"


def test_ai_not_configured_error():
    # If AIService is initialized with no key, it raises AINotConfiguredError
    service = AIService(api_key=None)
    with pytest.raises(Exception) as excinfo:
        service.generate_structured("prompt", {}, type, "discovery")
    from app.utils.errors import AINotConfiguredError

    assert isinstance(excinfo.value, AINotConfiguredError)
    assert excinfo.value.code == "AI_NOT_CONFIGURED"
    assert excinfo.value.status_code == 503


def test_ai_repair_retry_success(monkeypatch):
    """Test that if attempt 1 returns invalid json, attempt 2 repair succeeds."""
    calls = []

    def mock_call(self, prompt):
        calls.append(prompt)
        if len(calls) == 1:
            return "This is not json at all"
        # Attempt 2 returns valid json
        return '{"problem": "p", "target_user": "u", "context": "c", "constraints": [], "known_value": "v", "open_questions": [], "follow_up_questions": []}'

    monkeypatch.setattr(AIService, "_call_gemini_raw", mock_call)

    from app.schemas.discovery import DiscoveryOutput

    service = AIService(api_key="valid-test-key")
    result = service.generate_structured("template", {}, DiscoveryOutput, "discovery")
    assert isinstance(result, DiscoveryOutput)
    assert len(calls) == 2
    assert "[SYSTEM REPAIR INSTRUCTION]" in calls[1]


def test_ai_repair_retry_failure(monkeypatch):
    """Test that if attempt 1 and attempt 2 both fail, AIOutputInvalidError is raised."""
    calls = []

    def mock_call(self, prompt):
        calls.append(prompt)
        return "still invalid json"

    monkeypatch.setattr(AIService, "_call_gemini_raw", mock_call)

    from app.schemas.discovery import DiscoveryOutput
    from app.utils.errors import AIOutputInvalidError

    service = AIService(api_key="valid-test-key")
    with pytest.raises(AIOutputInvalidError) as excinfo:
        service.generate_structured("template", {}, DiscoveryOutput, "discovery")
    assert excinfo.value.code == "AI_OUTPUT_INVALID"
    assert excinfo.value.stage == "discovery"
    assert len(calls) == 2


def test_error_envelope_security(client):
    """Ensure error envelopes never leak credentials or internal stack traces."""
    response = client.post("/api/projects", json={"idea": "short", "audience": ""})
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert "code" in data["error"]
    assert "message" in data["error"]
    raw_text = response.text
    assert "Traceback" not in raw_text
    assert "GEMINI_API_KEY" not in raw_text
    assert "password" not in raw_text.lower()
