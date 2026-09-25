"""Centralized AI service for structured generation, validation, repair, and model fallback."""

import concurrent.futures
import json
import logging
import re
import time
from typing import Any, Optional, Type, TypeVar

from pydantic import BaseModel, ValidationError

from app.config import settings
from app.utils.errors import (
    AINotConfiguredError,
    AIOutputInvalidError,
    AIStageFailedError,
    AITimeoutError,
)

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


# ---------------------------------------------------------------------------
# MODEL FALLBACK CONFIGURATION
# ---------------------------------------------------------------------------
#
# The first model is the preferred model.
# If it repeatedly returns a transient error such as 503/429,
# the service automatically tries the next model.
#
# These models were confirmed to be available to the current API key.
#
FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
]


def extract_json_from_text(text: str) -> dict[str, Any]:
    """Extract JSON object from text, handling markdown fences and extra text."""

    cleaned = text.strip()

    if cleaned.startswith("```"):
        lines = cleaned.splitlines()

        # Remove opening ``` or ```json
        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        # Remove closing ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]

        cleaned = "\n".join(lines).strip()

    # First attempt: entire response is JSON
    try:
        data = json.loads(cleaned)

        if isinstance(data, dict):
            return data

    except Exception:
        pass

    # Fallback: find outermost JSON object
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start : end + 1]

        try:
            data = json.loads(candidate)

            if isinstance(data, dict):
                return data

        except Exception as exc:
            raise ValueError(
                f"Could not parse valid JSON object: {exc}"
            ) from exc

    raise ValueError(
        "No JSON object could be extracted from AI response."
    )


class AIService:
    """Handles structured communication with Gemini with automatic model fallback."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: Optional[int] = None,
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY

        # Keep .env model as the preferred model.
        self.model = model or settings.GEMINI_MODEL

        self.timeout_seconds = (
            timeout_seconds or settings.AI_TIMEOUT_SECONDS
        )

        self.max_retries = settings.AI_MAX_RETRIES

        # Build fallback list with configured model first.
        self.models = self._build_model_list()

    # -----------------------------------------------------------------------
    # MODEL MANAGEMENT
    # -----------------------------------------------------------------------

    def _build_model_list(self) -> list[str]:
        """
        Build the model fallback chain.

        The model configured in .env is always attempted first.
        The remaining fallback models follow.
        """

        models: list[str] = []

        # Preferred model from .env
        if self.model:
            models.append(self.model)

        # Add fallback models without duplicates
        for fallback_model in FALLBACK_MODELS:
            if fallback_model not in models:
                models.append(fallback_model)

        return models

    # -----------------------------------------------------------------------
    # PROMPT RENDERING
    # -----------------------------------------------------------------------

    def _render_prompt(
        self,
        template: str,
        context: dict[str, Any],
    ) -> str:
        """Inject structured context values into template placeholders."""

        rendered = template

        for key, value in context.items():

            if isinstance(value, (dict, list)):
                rendered_value = json.dumps(
                    value,
                    indent=2,
                )
            else:
                rendered_value = (
                    str(value)
                    if value is not None
                    else ""
                )

            rendered = rendered.replace(
                f"{{{{{key}}}}}",
                rendered_value,
            )

        return rendered

    # -----------------------------------------------------------------------
    # ERROR CLASSIFICATION
    # -----------------------------------------------------------------------

    def _is_retryable_error(self, error: Exception) -> bool:
        """
        Determine whether Gemini failure is transient.

        We only fallback/retry for temporary server/rate-limit failures.
        We do NOT blindly retry authentication, permission, or bad-request
        errors.
        """

        error_text = str(error).lower()

        retryable_statuses = [
            "408",
            "429",
            "500",
            "502",
            "503",
            "504",
        ]

        for status in retryable_statuses:
            if status in error_text:
                return True

        retryable_messages = [
            "unavailable",
            "service unavailable",
            "temporarily unavailable",
            "temporarily overloaded",
            "overloaded",
            "internal server error",
            "deadline exceeded",
            "resource exhausted",
            "rate limit",
            "too many requests",
            "timeout",
            "timed out",
        ]

        return any(
            message in error_text
            for message in retryable_messages
        )

    # -----------------------------------------------------------------------
    # SINGLE MODEL CALL
    # -----------------------------------------------------------------------

    def _call_model_raw(
        self,
        client: Any,
        model: str,
        prompt: str,
    ) -> str:
        """
        Make one Gemini request using one specific model.

        Timeout is handled outside the Gemini SDK call using a thread.
        """

        from google.genai import types

        def _invoke() -> str:

            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )

            return response.text or ""

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=1
        ) as executor:

            future = executor.submit(_invoke)

            try:
                return future.result(
                    timeout=self.timeout_seconds
                )

            except concurrent.futures.TimeoutError as exc:
                raise TimeoutError(
                    f"Gemini model {model} timed out"
                ) from exc

    # -----------------------------------------------------------------------
    # GEMINI CALL WITH RETRY + FALLBACK
    # -----------------------------------------------------------------------

    def _call_gemini_raw(
        self,
        prompt: str,
        stage: str,
    ) -> str:
        """
        Call Gemini using automatic retry + model fallback.

        Flow:

        Model A
          -> retry
          -> retry
          -> Model B
          -> retry
          -> retry
          -> Model C
          -> ...

        Non-transient errors stop immediately.
        """

        if not self.api_key:
            raise AINotConfiguredError(stage=stage)

        from google import genai

        client = genai.Client(
            api_key=self.api_key
        )

        last_error: Optional[Exception] = None

        # Create a maximum of max_retries + 1 attempts per model.
        attempts_per_model = max(
            1,
            self.max_retries + 1,
        )

        for model_index, model in enumerate(self.models):

            logger.info(
                "Stage '%s': trying Gemini model %s (%d/%d)",
                stage,
                model,
                model_index + 1,
                len(self.models),
            )

            for attempt in range(1, attempts_per_model + 1):

                try:

                    logger.info(
                        "Gemini request attempt %d/%d using model %s",
                        attempt,
                        attempts_per_model,
                        model,
                    )

                    result = self._call_model_raw(
                        client=client,
                        model=model,
                        prompt=prompt,
                    )

                    logger.info(
                        "Gemini model %s succeeded for stage '%s'",
                        model,
                        stage,
                    )

                    return result

                except TimeoutError as exc:

                    last_error = exc

                    logger.warning(
                        "Gemini model %s timed out on attempt %d/%d",
                        model,
                        attempt,
                        attempts_per_model,
                    )

                    # Timeout is treated as transient.
                    if attempt < attempts_per_model:

                        delay = 2 ** attempt

                        logger.warning(
                            "Retrying model %s in %d seconds...",
                            model,
                            delay,
                        )

                        time.sleep(delay)

                    continue

                except Exception as exc:

                    last_error = exc

                    # Non-transient error:
                    # don't waste time switching through every model.
                    if not self._is_retryable_error(exc):

                        logger.error(
                            "Non-retryable Gemini error from model %s: %s",
                            model,
                            exc,
                        )

                        raise exc

                    # Transient error
                    logger.warning(
                        "Transient Gemini error from model %s "
                        "on attempt %d/%d: %s",
                        model,
                        attempt,
                        attempts_per_model,
                        exc,
                    )

                    if attempt < attempts_per_model:

                        delay = 2 ** attempt

                        logger.warning(
                            "Retrying model %s in %d seconds...",
                            model,
                            delay,
                        )

                        time.sleep(delay)

            # Current model exhausted.
            #
            # Move to next model only if another model exists.
            if model_index < len(self.models) - 1:

                next_model = self.models[model_index + 1]

                logger.warning(
                    "Model %s exhausted for stage '%s'. "
                    "Falling back to %s.",
                    model,
                    stage,
                    next_model,
                )

        # Every model failed.
        logger.error(
            "All Gemini fallback models failed for stage '%s'. "
            "Last error: %s",
            stage,
            last_error,
        )

        if isinstance(last_error, TimeoutError):
            raise AITimeoutError(stage=stage)

        raise AIStageFailedError(
            f"AI call failed after trying all fallback models: "
            f"{last_error}",
            stage=stage,
        )

    # -----------------------------------------------------------------------
    # STRUCTURED GENERATION
    # -----------------------------------------------------------------------

    def generate_structured(
        self,
        prompt_template: str,
        context: dict[str, Any],
        schema: Type[T],
        stage: str,
    ) -> T:
        """
        Generate structured output validated against a Pydantic schema.

        First call:
            Prompt -> Gemini fallback chain -> JSON -> Pydantic validation

        If JSON/schema validation fails:
            Repair prompt -> Gemini fallback chain -> JSON -> validation
        """

        if not self.api_key:
            raise AINotConfiguredError(stage=stage)

        initial_prompt = self._render_prompt(
            prompt_template,
            context,
        )

        # ---------------------------------------------------------------
        # ATTEMPT 1 — NORMAL GENERATION
        # ---------------------------------------------------------------

        try:

            raw_text = self._call_gemini_raw(
                prompt=initial_prompt,
                stage=stage,
            )

        except AITimeoutError:
            raise

        except AINotConfiguredError:
            raise

        except AIStageFailedError:
            raise

        except Exception as exc:

            raise AIStageFailedError(
                f"AI call failed: {exc}",
                stage=stage,
            ) from exc

        # ---------------------------------------------------------------
        # JSON EXTRACTION + PYDANTIC VALIDATION
        # ---------------------------------------------------------------

        validation_error: Optional[str] = None

        try:

            json_data = extract_json_from_text(
                raw_text
            )

            return schema.model_validate(
                json_data
            )

        except (ValueError, ValidationError) as exc:

            validation_error = str(exc)

            logger.warning(
                "Stage '%s' initial generation "
                "failed schema validation. "
                "Starting repair attempt.",
                stage,
            )

        # ---------------------------------------------------------------
        # ATTEMPT 2 — REPAIR
        # ---------------------------------------------------------------

        repair_prompt = (
            f"{initial_prompt}\n\n"
            f"[SYSTEM REPAIR INSTRUCTION]\n"
            f"The previous output was invalid and failed "
            f"schema validation.\n\n"
            f"Validation Error Summary:\n"
            f"{validation_error}\n\n"
            f"Expected JSON Schema:\n"
            f"{json.dumps(schema.model_json_schema(), indent=2)}\n\n"
            f"Please strictly correct the error and output "
            f"ONLY the valid JSON object without any additional text."
        )

        try:

            repaired_text = self._call_gemini_raw(
                prompt=repair_prompt,
                stage=f"{stage}_repair",
            )

        except AITimeoutError:
            raise

        except AIStageFailedError:
            raise

        except Exception as exc:

            raise AIStageFailedError(
                f"AI repair call failed: {exc}",
                stage=stage,
            ) from exc

        # ---------------------------------------------------------------
        # VALIDATE REPAIRED OUTPUT
        # ---------------------------------------------------------------

        try:

            repaired_json = extract_json_from_text(
                repaired_text
            )

            return schema.model_validate(
                repaired_json
            )

        except (ValueError, ValidationError) as exc:

            logger.error(
                "Stage '%s' repair failed validation: %s",
                stage,
                exc,
            )

            raise AIOutputInvalidError(
                f"Stage '{stage}' output was invalid "
                f"after repair attempt: {str(exc)}",
                stage=stage,
            )


# ---------------------------------------------------------------------------
# DEFAULT SINGLETON
# ---------------------------------------------------------------------------

_ai_service_instance: Optional[AIService] = None


def get_ai_service() -> AIService:

    global _ai_service_instance

    if _ai_service_instance is None:
        _ai_service_instance = AIService()

    return _ai_service_instance


def set_ai_service(service: AIService) -> None:

    global _ai_service_instance

    _ai_service_instance = service