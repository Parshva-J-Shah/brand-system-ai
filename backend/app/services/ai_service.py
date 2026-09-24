"""Centralized AI service for structured generation, validation, and repair."""

import concurrent.futures
import json
import logging
import re
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


def extract_json_from_text(text: str) -> dict[str, Any]:
    """Extract JSON object from text, handling markdown fences and extraneous characters."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        # Drop opening ``` or ```json
        if lines[0].startswith("```"):
            lines = lines[1:]
        # Drop closing ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            return data
    except Exception:
        pass

    # Fallback: scan for first '{' and matching outermost '}'
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start : end + 1]
        try:
            data = json.loads(candidate)
            if isinstance(data, dict):
                return data
        except Exception as e:
            raise ValueError(f"Could not parse valid JSON object: {e}") from e

    raise ValueError("No JSON object could be extracted from AI response.")


class AIService:
    """Handles structured communication with the AI provider."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: Optional[int] = None,
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.timeout_seconds = timeout_seconds or settings.AI_TIMEOUT_SECONDS

    def _render_prompt(self, template: str, context: dict[str, Any]) -> str:
        """Inject structured context values into template placeholders."""
        rendered = template
        for k, v in context.items():
            if isinstance(v, (dict, list)):
                rendered_val = json.dumps(v, indent=2)
            else:
                rendered_val = str(v) if v is not None else ""
            rendered = rendered.replace(f"{{{{{k}}}}}", rendered_val)
        return rendered

    def _call_gemini_raw(self, prompt: str) -> str:
        """Make raw API call to Gemini using google-genai SDK."""
        if not self.api_key:
            raise AINotConfiguredError()

        from google import genai
        from google.genai import types

        client = genai.Client(api_key=self.api_key)

        def _invoke():
            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )
            return response.text or ""

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_invoke)
            try:
                return future.result(timeout=self.timeout_seconds)
            except concurrent.futures.TimeoutError as exc:
                raise TimeoutError("Gemini call timed out") from exc
            except Exception as exc:
                raise exc

    def generate_structured(
        self,
        prompt_template: str,
        context: dict[str, Any],
        schema: Type[T],
        stage: str,
    ) -> T:
        """Generate structured output validated against a Pydantic schema with auto-repair."""
        if not self.api_key:
            raise AINotConfiguredError(stage=stage)

        initial_prompt = self._render_prompt(prompt_template, context)

        # Attempt 1
        try:
            raw_text = self._call_gemini_raw(initial_prompt)
        except TimeoutError:
            raise AITimeoutError(stage=stage)
        except Exception as e:
            if isinstance(e, (AINotConfiguredError, AITimeoutError)):
                raise
            raise AIStageFailedError(f"AI call failed: {str(e)}", stage=stage)

        # Extraction and validation
        validation_err: Optional[str] = None
        try:
            json_data = extract_json_from_text(raw_text)
            return schema.model_validate(json_data)
        except (ValueError, ValidationError) as e:
            validation_err = str(e)
            logger.warning("Stage %s initial generation invalid, attempting repair: %s", stage, validation_err)

        # Attempt 2: Repair prompt
        repair_prompt = (
            f"{initial_prompt}\n\n"
            f"[SYSTEM REPAIR INSTRUCTION]\n"
            f"The previous output was invalid and failed schema validation.\n"
            f"Validation Error Summary: {validation_err}\n"
            f"Expected JSON Schema:\n{json.dumps(schema.model_json_schema(), indent=2)}\n"
            f"Please strictly correct the error and output ONLY the valid JSON object without any additional text."
        )

        try:
            repaired_text = self._call_gemini_raw(repair_prompt)
        except TimeoutError:
            raise AITimeoutError(stage=stage)
        except Exception as e:
            raise AIStageFailedError(f"AI repair call failed: {str(e)}", stage=stage)

        try:
            repaired_json = extract_json_from_text(repaired_text)
            return schema.model_validate(repaired_json)
        except (ValueError, ValidationError) as e:
            logger.error("Stage %s repair failed validation: %s", stage, e)
            raise AIOutputInvalidError(
                f"Stage '{stage}' output was invalid after repair attempt: {str(e)}",
                stage=stage,
            )


# Default singleton instance
_ai_service_instance: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Return active AIService singleton."""
    global _ai_service_instance
    if _ai_service_instance is None:
        _ai_service_instance = AIService()
    return _ai_service_instance


def set_ai_service(service: AIService) -> None:
    """Override active AIService (used in tests)."""
    global _ai_service_instance
    _ai_service_instance = service
