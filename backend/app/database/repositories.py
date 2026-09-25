"""Repository for persisting and querying Project entities."""

from datetime import datetime, timezone
import json
from typing import Any, List, Optional

from app.database.database import get_db_connection
from app.models.project import Project


class ProjectRepository:
    """Encapsulates all SQLite database operations for Project records."""

    @staticmethod
    def _row_to_project(row) -> Project:
        return Project(
            id=row["id"],
            input=json.loads(row["input_data"]),
            status=row["status"],
            failed_stage=row["failed_stage"],
            discovery=json.loads(row["discovery_data"]) if row["discovery_data"] else None,
            positioning=json.loads(row["positioning_data"]) if row["positioning_data"] else None,
            shape=json.loads(row["shape_data"]) if row["shape_data"] else None,
            visual=json.loads(row["visual_data"]) if row["visual_data"] else None,
            critique=json.loads(row["critique_data"]) if row["critique_data"] else None,
            consistency=json.loads(row["consistency_data"]) if row["consistency_data"] else None,
            delivery=json.loads(row["delivery_data"]) if row["delivery_data"] else None,
            decisions=json.loads(row["decisions_data"]) if row["decisions_data"] else {},
            error=json.loads(row["error_data"]) if row["error_data"] else None,
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )

    def create(self, project: Project) -> Project:
        """Insert a new project record into the database."""
        with get_db_connection() as conn:
            conn.execute(
                """
                INSERT INTO projects (
                    id, input_data, status, failed_stage,
                    discovery_data, positioning_data, shape_data, visual_data,
                    critique_data, consistency_data, delivery_data,
                    decisions_data, error_data, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    project.id,
                    json.dumps(project.input),
                    project.status,
                    project.failed_stage,
                    json.dumps(project.discovery) if project.discovery is not None else None,
                    json.dumps(project.positioning) if project.positioning is not None else None,
                    json.dumps(project.shape) if project.shape is not None else None,
                    json.dumps(project.visual) if project.visual is not None else None,
                    json.dumps(project.critique) if project.critique is not None else None,
                    json.dumps(project.consistency) if project.consistency is not None else None,
                    json.dumps(project.delivery) if project.delivery is not None else None,
                    json.dumps(project.decisions),
                    json.dumps(project.error) if project.error is not None else None,
                    project.created_at,
                    project.updated_at,
                ),
            )
        return project

    def get(self, project_id: str) -> Optional[Project]:
        """Retrieve a project by its primary key UUID."""
        with get_db_connection() as conn:
            cursor = conn.execute("SELECT * FROM projects WHERE id = ?;", (project_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return self._row_to_project(row)

    def update(self, project: Project) -> Project:
        """Update the entire project state."""
        now = datetime.now(timezone.utc).isoformat()
        project.updated_at = now
        with get_db_connection() as conn:
            conn.execute(
                """
                UPDATE projects SET
                    input_data = ?,
                    status = ?,
                    failed_stage = ?,
                    discovery_data = ?,
                    positioning_data = ?,
                    shape_data = ?,
                    visual_data = ?,
                    critique_data = ?,
                    consistency_data = ?,
                    delivery_data = ?,
                    decisions_data = ?,
                    error_data = ?,
                    updated_at = ?
                WHERE id = ?;
                """,
                (
                    json.dumps(project.input),
                    project.status,
                    project.failed_stage,
                    json.dumps(project.discovery) if project.discovery is not None else None,
                    json.dumps(project.positioning) if project.positioning is not None else None,
                    json.dumps(project.shape) if project.shape is not None else None,
                    json.dumps(project.visual) if project.visual is not None else None,
                    json.dumps(project.critique) if project.critique is not None else None,
                    json.dumps(project.consistency) if project.consistency is not None else None,
                    json.dumps(project.delivery) if project.delivery is not None else None,
                    json.dumps(project.decisions),
                    json.dumps(project.error) if project.error is not None else None,
                    now,
                    project.id,
                ),
            )
        return project

    def update_status(
        self,
        project_id: str,
        status: str,
        failed_stage: Optional[str] = None,
        error: Optional[dict[str, Any]] = None,
    ) -> None:
        """Update project status, failure stage, and error details."""
        now = datetime.now(timezone.utc).isoformat()
        with get_db_connection() as conn:
            conn.execute(
                """
                UPDATE projects SET
                    status = ?,
                    failed_stage = ?,
                    error_data = ?,
                    updated_at = ?
                WHERE id = ?;
                """,
                (
                    status,
                    failed_stage,
                    json.dumps(error) if error is not None else None,
                    now,
                    project_id,
                ),
            )

    def update_stage_output(
        self,
        project_id: str,
        stage: str,
        output_data: dict[str, Any],
        status: Optional[str] = None,
    ) -> None:
        """Persist stage output and optionally advance status."""
        column_map = {
            "discovery": "discovery_data",
            "positioning": "positioning_data",
            "shape": "shape_data",
            "visual": "visual_data",
            "critique": "critique_data",
            "consistency": "consistency_data",
            "delivery": "delivery_data",
        }
        col = column_map.get(stage.lower())
        if not col:
            raise ValueError(f"Unknown stage: {stage}")

        now = datetime.now(timezone.utc).isoformat()
        serialized = json.dumps(output_data)

        with get_db_connection() as conn:
            if status:
                conn.execute(
                    f"UPDATE projects SET {col} = ?, status = ?, updated_at = ? WHERE id = ?;",
                    (serialized, status, now, project_id),
                )
            else:
                conn.execute(
                    f"UPDATE projects SET {col} = ?, updated_at = ? WHERE id = ?;",
                    (serialized, now, project_id),
                )

    def clear_downstream_stages(self, project_id: str, stages_to_clear: List[str]) -> None:
        """Clear outputs for stages scheduled for partial rerun."""
        column_map = {
            "discovery": "discovery_data",
            "positioning": "positioning_data",
            "shape": "shape_data",
            "visual": "visual_data",
            "critique": "critique_data",
            "consistency": "consistency_data",
            "delivery": "delivery_data",
        }
        cols_to_null = [column_map[s.lower()] for s in stages_to_clear if s.lower() in column_map]
        if not cols_to_null:
            return

        set_clause = ", ".join([f"{col} = NULL" for col in cols_to_null])
        now = datetime.now(timezone.utc).isoformat()

        with get_db_connection() as conn:
            conn.execute(
                f"UPDATE projects SET {set_clause}, error_data = NULL, failed_stage = NULL, updated_at = ? WHERE id = ?;",
                (now, project_id),
            )

    def record_decision(self, project_id: str, field_name: str, value: Any) -> None:
        """Record an explicit user decision with timestamp."""
        project = self.get(project_id)
        if not project:
            return

        now = datetime.now(timezone.utc).isoformat()
        project.decisions[field_name] = {
            "value": value,
            "timestamp": now,
        }
        with get_db_connection() as conn:
            conn.execute(
                "UPDATE projects SET decisions_data = ?, updated_at = ? WHERE id = ?;",
                (json.dumps(project.decisions), now, project_id),
            )
