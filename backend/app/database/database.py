"""SQLite database connection and lifecycle management."""

import contextlib
import os
from pathlib import Path
import sqlite3
from typing import Generator

from app.config import settings

_CURRENT_DB_PATH: str | None = None


def set_database_path(path: str) -> None:
    """Set the database path (useful for testing)."""
    global _CURRENT_DB_PATH
    _CURRENT_DB_PATH = path


def get_database_path() -> str:
    """Get the active database file path."""
    global _CURRENT_DB_PATH
    if _CURRENT_DB_PATH is not None:
        return _CURRENT_DB_PATH
    return settings.DATABASE_PATH


@contextlib.contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """Yield a safe SQLite connection per operation with row factory enabled."""
    db_path = get_database_path()
    # Ensure directory exists if not an in-memory database
    if db_path != ":memory:":
        parent_dir = Path(db_path).resolve().parent
        parent_dir.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(
        db_path,
        timeout=20.0,
        check_same_thread=False,
    )
    conn.row_factory = sqlite3.Row
    try:
        # Enable WAL mode and foreign keys for durability and concurrency
        if db_path != ":memory:":
            conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Create database tables if they do not exist."""
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                input_data TEXT NOT NULL,
                status TEXT NOT NULL,
                failed_stage TEXT,
                discovery_data TEXT,
                positioning_data TEXT,
                shape_data TEXT,
                visual_data TEXT,
                critique_data TEXT,
                consistency_data TEXT,
                delivery_data TEXT,
                decisions_data TEXT NOT NULL DEFAULT '{}',
                error_data TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            """
        )
