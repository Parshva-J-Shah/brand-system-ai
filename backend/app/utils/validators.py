"""Validation utilities for user input and stage integrity."""

import re
from typing import Any, List


def sanitize_input_text(text: str) -> str:
    """Strip dangerous characters or excess formatting from user text while preserving meaning."""
    if not text:
        return ""
    # Normalize multiple whitespace lines
    cleaned = re.sub(r"\r\n|\r", "\n", text).strip()
    return cleaned


def normalize_string_list(items: Any) -> List[str]:
    """Ensure input is converted into a clean list of strings."""
    if items is None:
        return []
    if isinstance(items, str):
        cleaned = items.strip()
        return [cleaned] if cleaned else []
    if isinstance(items, (list, tuple, set)):
        result = []
        for x in items:
            s = str(x).strip()
            if s:
                result.append(s)
        return result
    return []
