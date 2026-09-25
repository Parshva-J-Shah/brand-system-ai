"""Custom exceptions and error response definitions."""

from typing import Any, Optional


class AppException(Exception):
    """Base application exception with structured error mapping."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        stage: Optional[str] = None,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.stage = stage.lower() if stage else None

    def to_dict(self) -> dict[str, Any]:
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "stage": self.stage,
            }
        }


class ProjectNotFoundError(AppException):
    def __init__(self, project_id: str):
        super().__init__(
            code="PROJECT_NOT_FOUND",
            message=f"Project '{project_id}' was not found.",
            status_code=404,
        )


class WorkflowAlreadyRunningError(AppException):
    def __init__(self, project_id: str):
        super().__init__(
            code="WORKFLOW_ALREADY_RUNNING",
            message=f"Workflow is already running for project '{project_id}'.",
            status_code=409,
        )


class InvalidDecisionFieldError(AppException):
    def __init__(self, field: str):
        super().__init__(
            code="INVALID_DECISION_FIELD",
            message=f"Invalid decision field '{field}'.",
            status_code=422,
        )


class AINotConfiguredError(AppException):
    def __init__(self, stage: Optional[str] = None):
        super().__init__(
            code="AI_NOT_CONFIGURED",
            message="Gemini API is not configured. Set GEMINI_API_KEY in environment or .env.",
            status_code=503,
            stage=stage,
        )


class AITimeoutError(AppException):
    def __init__(self, stage: Optional[str] = None):
        super().__init__(
            code="AI_TIMEOUT",
            message=f"AI request timed out during stage '{stage}'." if stage else "AI request timed out.",
            status_code=504,
            stage=stage,
        )


class AIOutputInvalidError(AppException):
    def __init__(self, message: str = "AI output did not match expected structured schema.", stage: Optional[str] = None):
        super().__init__(
            code="AI_OUTPUT_INVALID",
            message=message,
            status_code=502,
            stage=stage,
        )


class AIStageFailedError(AppException):
    def __init__(self, message: str, stage: Optional[str] = None):
        super().__init__(
            code="AI_STAGE_FAILED",
            message=message,
            status_code=502,
            stage=stage,
        )


class InternalError(AppException):
    def __init__(self, message: str = "An unexpected internal error occurred.", stage: Optional[str] = None):
        super().__init__(
            code="INTERNAL_ERROR",
            message=message,
            status_code=500,
            stage=stage,
        )
