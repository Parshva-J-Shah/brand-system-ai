"""Configuration settings for Brand System AI."""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Search for .env in current working dir, backend dir, or parent dirs
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
if ENV_FILE.exists():
    load_dotenv(dotenv_path=ENV_FILE)
else:
    load_dotenv()


class Settings:
    """Application settings loaded from environment."""

    def __init__(self):
        self.GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY") or None
        self.GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.TAVILY_API_KEY: str | None = os.getenv("TAVILY_API_KEY") or None
        self.DATABASE_PATH: str = os.getenv("DATABASE_PATH", "./data/app.db")

        cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        self.CORS_ORIGINS: List[str] = [
            origin.strip() for origin in cors_raw.split(",") if origin.strip()
        ]

        try:
            self.AI_TIMEOUT_SECONDS: int = int(os.getenv("AI_TIMEOUT_SECONDS", "45"))
        except ValueError:
            self.AI_TIMEOUT_SECONDS = 45

        try:
            self.AI_MAX_RETRIES: int = int(os.getenv("AI_MAX_RETRIES", "2"))
        except ValueError:
            self.AI_MAX_RETRIES = 2


settings = Settings()
