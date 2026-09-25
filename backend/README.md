# Founder-to-Launch Brand Intelligence Agent — Backend

A specialized AI backend service that transforms early-stage startup, community, or product concepts into launch-ready brand systems through a 7-stage sequential reasoning pipeline.

---

## 1. Project Purpose

Founders often struggle with generic marketing fluff and superficial naming generators that produce disconnected assets. This backend solves that problem by implementing a structured, multi-stage agentic workflow:

```
Discovery ➔ Positioning ➔ Brand Shape ➔ Visual Direction ➔ Critic ➔ Consistency ➔ Delivery
```

Each stage has:
- One distinct responsibility
- Dedicated prompt and agent module
- Strict Pydantic schema validation
- Automatic auto-repair if malformed output is generated
- Contextual state persistence in SQLite
- Human-in-the-loop decision updates with surgical downstream partial reruns

---

## 2. Backend Architecture & Structure

```
brand-system-ai/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app, lifespan, CORS, error handlers
│   │   ├── config.py                   # Environment settings & defaults
│   │   │
│   │   ├── api/                        # HTTP Endpoints (prefix /api)
│   │   │   ├── __init__.py
│   │   │   ├── health.py               # GET /api/health
│   │   │   ├── projects.py             # POST /api/projects, GET /api/projects/{id}
│   │   │   └── workflow.py             # POST /generate, PATCH /decisions
│   │   │
│   │   ├── schemas/                    # Pydantic v2 schemas
│   │   │   ├── __init__.py
│   │   │   ├── project.py              # Requests, responses, and error envelopes
│   │   │   ├── discovery.py            # Stage 1 schema
│   │   │   ├── positioning.py          # Stage 2 schema
│   │   │   ├── brand_shape.py          # Stage 3 schema
│   │   │   ├── visual.py               # Stage 4 schema
│   │   │   ├── critique.py             # Stage 5 schema
│   │   │   ├── consistency.py          # Stage 6 schema
│   │   │   └── delivery.py             # Stage 7 schema
│   │   │
│   │   ├── agents/                     # Independent AI Stage Agents
│   │   │   ├── __init__.py
│   │   │   ├── discovery.py
│   │   │   ├── positioning.py
│   │   │   ├── brand_shape.py
│   │   │   ├── visual_direction.py
│   │   │   ├── critic.py
│   │   │   ├── consistency.py
│   │   │   └── delivery.py
│   │   │
│   │   ├── prompts/                    # Runtime prompts (anti-cliché & data delimiting)
│   │   │   ├── discovery.txt
│   │   │   ├── positioning.txt
│   │   │   ├── brand_shape.txt
│   │   │   ├── visual.txt
│   │   │   ├── critic.txt
│   │   │   ├── consistency.txt
│   │   │   └── delivery.txt
│   │   │
│   │   ├── services/                   # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── ai_service.py           # Gemini SDK integration, repair retry, extraction
│   │   │   ├── project_service.py      # Project lifecycle & decision routing
│   │   │   ├── workflow_service.py     # Stage orchestrator & background execution
│   │   │   └── research_service.py     # Optional Tavily research integration
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── project.py              # Domain dataclass & stage serializations
│   │   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── database.py             # Safe SQLite connection management & WAL mode
│   │   │   └── repositories.py         # Project persistence repository (no raw SQL in routes)
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── errors.py               # Standardized error codes & exceptions
│   │       └── validators.py           # Input sanitization and array normalizers
│   │
│   ├── tests/                          # Automated pytest suite (zero real AI calls)
│   │   ├── __init__.py
│   │   ├── conftest.py                 # Mock AI fixtures and isolated SQLite DB
│   │   ├── test_health.py
│   │   ├── test_projects.py
│   │   ├── test_workflow.py
│   │   └── test_schemas.py
│   │
│   ├── .env.example                    # Template environment variables (empty keys)
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 3. Environment Variables

Create your local `.env` inside `backend/`:

```bash
cp backend/.env.example backend/.env
```

Configuration keys (`backend/.env.example`):
```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
TAVILY_API_KEY=
DATABASE_PATH=./data/app.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
AI_TIMEOUT_SECONDS=45
AI_MAX_RETRIES=2
```

> **Note**: The application boots safely even if `GEMINI_API_KEY` is omitted. The `/api/health` endpoint remains functional. Calling generation without a key yields an `AI_NOT_CONFIGURED` structured error (503).

---

## 4. Setup & Running

### 4.1 Create and Activate Virtual Environment

```bash
# From workspace root or backend directory
python -m venv venv

# Windows (cmd / PowerShell):
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

### 4.2 Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4.3 Configure Secrets

Manually copy `backend/.env.example` to `backend/.env` and add your real `GEMINI_API_KEY`.

### 4.4 Start Server

```bash
cd backend
uvicorn app.main:app --reload
```

- **Server URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 5. API Endpoints

Base URL prefix: `/api`

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/health` | Health check (no API key required) | `200 OK` |
| `POST` | `/api/projects` | Create a new project | `201 Created` |
| `GET` | `/api/projects/{id}` | Retrieve complete project and all stage outputs | `200 OK` |
| `GET` | `/api/projects/{id}/status` | Check pipeline execution status and progress | `200 OK` |
| `POST` | `/api/projects/{id}/generate` | Trigger asynchronous pipeline execution | `202 Accepted` |
| `PATCH` | `/api/projects/{id}/decisions` | Submit human override and trigger partial rerun | `202 Accepted` |

---

## 6. Request & Response Examples

### 6.1 Create Project (`POST /api/projects`)

**Request**:
```json
{
  "idea": "An AI platform that creates automated brand architectures for solo founders.",
  "audience": "Solo founders, indie hackers, and pre-seed startups.",
  "constraints": ["Fast turnaround", "Budget friendly"],
  "tone": "Direct and insightful",
  "references": ["Linear", "Stripe"]
}
```

**Response (HTTP 201)**:
```json
{
  "project_id": "7bf3cf77-d648-4cb5-b44c-2041ce04958f",
  "status": "DRAFT"
}
```

### 6.2 Start Generation (`POST /api/projects/{id}/generate`)

**Response (HTTP 202)**:
```json
{
  "project_id": "7bf3cf77-d648-4cb5-b44c-2041ce04958f",
  "status": "DISCOVERING"
}
```

### 6.3 Query Status (`GET /api/projects/{id}/status`)

**Response (HTTP 200)**:
```json
{
  "project_id": "7bf3cf77-d648-4cb5-b44c-2041ce04958f",
  "status": "CHALLENGING",
  "completed_stages": [
    "discovery",
    "positioning",
    "shape",
    "visual"
  ],
  "failed_stage": null
}
```

### 6.4 Submit Decision Override (`PATCH /api/projects/{id}/decisions`)

**Request**:
```json
{
  "field": "category",
  "value": "Automated Brand Intelligence Studio"
}
```

**Response (HTTP 202)**:
```json
{
  "project_id": "7bf3cf77-d648-4cb5-b44c-2041ce04958f",
  "status": "SHAPING",
  "rerun_stages": [
    "shape",
    "visual",
    "critique",
    "consistency",
    "delivery"
  ]
}
```

---

## 7. AI Pipeline Stages & Schemas

### Stage 1: Discovery (`DISCOVERING`)
Identifies the core problem, target buyer personas, context, boundaries, and separates validated knowledge from unknown assumptions.
- **Output Schema**: `problem`, `target_user`, `context`, `constraints`, `known_value`, `open_questions`, `follow_up_questions`.

### Stage 2: Positioning (`POSITIONING`)
Defines the market category, core differentiator, single-sentence value proposition, and competitive angle.
- **Output Schema**: `category`, `differentiator`, `value_proposition`, `competitive_angle`.

### Stage 3: Brand Shape (`SHAPING`)
Develops 3–5 audience-connected personality traits, negative traits to avoid, 3–4 creative naming territories with candidate names, a primary recommended name, tagline, elevator pitch, and voice guidelines.
- **Output Schema**: `personality` (`[{trait, reason}]`), `traits_to_avoid`, `naming_territories` (`[{territory, rationale, example_names}]`), `selected_name`, `tagline`, `one_line_pitch`, `voice`, `message_hierarchy`.

### Stage 4: Visual Direction (`VISUALIZING`)
Translates brand personality and voice into structured creative guidelines without generating raw frontend code or binary images.
- **Output Schema**: `typography`, `color_mood`, `composition`, `symbols`, `image_style`, `concepts_to_avoid`.

### Stage 5: Critic (`CHALLENGING`)
Adversarial reviewer that actively challenges assumptions, flags startup clichés, checks audience fit, and identifies naming or visual contradictions.
- **Output Schema**: `issues` (`[{issue, why_it_is_a_problem, suggested_change, severity, affected_stage}]`), `overall_assessment`.

### Stage 6: Consistency (`CHECKING`)
Cross-audits all prior stages (e.g. name vs. positioning, tagline vs. value proposition, voice vs. personality).
- **Output Schema**: `consistent` (`true` or `false`), `conflicts`, `recommendations`.

### Stage 7: Delivery (`DELIVERING` ➔ `COMPLETED`)
Synthesizes the final launch assets, honoring user decisions as highest priority, integrating critic recommendations, and documenting explicit changes.
- **Output Schema**: `brand_summary`, `pitch`, `naming_direction`, `tagline`, `personality`, `voice_guide` (`{description, do, dont}`), `visual_brief`, `landing_headline`, `launch_message`, `social_post`, `changes_from_critique`.

---

## 8. Decisions & Partial Rerun System

When a founder edits a decision field via `PATCH /api/projects/{id}/decisions`:
1. The submitted value is validated against the schema for that stage.
2. The validated value is directly written into the stored stage output in SQLite.
3. The edited stage is **NEVER** re-executed by AI; the human's decision is fixed truth.
4. Outdated downstream outputs are cleared in SQLite.
5. Only downstream stages are rerun in the background. Upstream stages are preserved untouched.

### Stage Invalidation Map

| Modified Field Category | Earliest Affected Stage | Downstream Rerun Stages |
|---|---|---|
| Input (`idea`, `audience`, `constraints`, `tone`, `references`) | `discovery` | `discovery`, `positioning`, `shape`, `visual`, `critique`, `consistency`, `delivery` |
| Discovery (`problem`, `target_user`, `context`, etc.) | `positioning` | `positioning`, `shape`, `visual`, `critique`, `consistency`, `delivery` |
| Positioning (`category`, `differentiator`, `value_proposition`, `competitive_angle`) | `shape` | `shape`, `visual`, `critique`, `consistency`, `delivery` |
| Shape (`personality`, `selected_name`, `tagline`, `voice`, etc.) | `visual` | `visual`, `critique`, `consistency`, `delivery` |
| Visual (`typography`, `color_mood`, `composition`, etc.) | `critique` | `critique`, `consistency`, `delivery` |
| Delivery (`brand_summary`, `pitch`, `launch_message`, etc.) | `delivery` | `delivery` |

---

## 9. Error Format & Error Codes

All errors conform to this standard envelope:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable description",
    "stage": "positioning"
  }
}
```

### Error Code Mapping

| Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | `422` | Request payload or stage value failed schema constraints |
| `PROJECT_NOT_FOUND` | `404` | Requested project ID does not exist |
| `WORKFLOW_ALREADY_RUNNING` | `409` | A generation workflow is actively running on this project |
| `INVALID_DECISION_FIELD` | `422` | The field name provided in PATCH is unrecognized |
| `AI_NOT_CONFIGURED` | `503` | `GEMINI_API_KEY` is not present in environment |
| `AI_TIMEOUT` | `504` | AI call exceeded configured timeout seconds |
| `AI_OUTPUT_INVALID` | `502` | AI output failed schema validation after repair retry |
| `AI_STAGE_FAILED` | `502` | Provider exception or runtime failure during stage execution |
| `INTERNAL_ERROR` | `500` | Unexpected server error (stack traces are strictly suppressed) |

---

## 10. Frontend Integration Notes

*(For the Frontend Developer building the UI)*

1. **Creating a Project (`POST /api/projects`)**:
   - Send `idea` (min 10 characters, required) and `audience` (required).
   - `constraints` can be an array of strings or a plain string (the backend normalizes it).
   - On success (201), store the returned `project_id`.

2. **Triggering Generation (`POST /api/projects/{id}/generate`)**:
   - Returns immediately with `202 Accepted` and status `DISCOVERING`.
   - The workflow runs in background tasks.
   - If the user clicks "Generate" while it is already processing, the API returns `409 WORKFLOW_ALREADY_RUNNING`. Disable the trigger button while polling indicates an active state.

3. **Status Polling (`GET /api/projects/{id}/status`)**:
   - Poll every 1.5 to 2 seconds.
   - Pipeline statuses:
     - `DRAFT`: Initial state before generation starts.
     - `DISCOVERING`: Stage 1 in progress.
     - `POSITIONING`: Stage 2 in progress.
     - `SHAPING`: Stage 3 in progress.
     - `VISUALIZING`: Stage 4 in progress.
     - `CHALLENGING`: Stage 5 Critic in progress.
     - `CHECKING`: Stage 6 Consistency audit in progress.
     - `DELIVERING`: Stage 7 Delivery synthesis in progress.
     - `COMPLETED`: Entire pipeline finished.
     - `ERROR`: A stage failed. Inspect `failed_stage` to render a retry button.
   - `completed_stages` contains strings corresponding to finished deliverables: `["discovery", "positioning", "shape", "visual", "critique", "consistency", "delivery"]`.

4. **Fetching Complete Results (`GET /api/projects/{id}`)**:
   - When a stage appears in `completed_stages` or when status is `COMPLETED`, fetch the full project.
   - Deliverable fields:
     - `discovery`: Contains `problem`, `target_user`, `open_questions`, and `follow_up_questions` (ideal for interactive founder clarification prompts).
     - `positioning`: Market category, differentiators, and value proposition.
     - `shape`: 3–5 personality traits, 3–4 naming territories, tagline, elevator pitch, and voice.
     - `visual`: Typography, color mood, and composition guidance.
     - `critique`: Identified issues with `severity` (`low`, `medium`, `high`) and `suggested_change`.
     - `consistency`: Audit with `consistent: bool`, conflicts, and recommendations.
     - `delivery`: Launch copy (`landing_headline`, `launch_message`, `social_post`), pitch, voice guide, and `changes_from_critique`.

5. **Editing Decisions & Partial Reruns (`PATCH /api/projects/{id}/decisions`)**:
   - Send `{ "field": "<field_name>", "value": <new_value> }`.
   - Returns `202 Accepted` with `rerun_stages`.
   - Resume polling `/status`. The UI can display a banner indicating which downstream stages are being regenerated while upstream stages remain locked.

---

## 11. Testing

The test suite runs with fully mocked AI services to ensure zero Gemini API credit consumption, rapid execution, and deterministic assertions.

```bash
cd backend
pytest -v
```
