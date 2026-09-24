"""Optional external research service using Tavily."""

import logging
from typing import Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)


class ResearchService:
    """Provides targeted web research when configured."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.TAVILY_API_KEY

    def search_category_context(self, query: str, max_results: int = 3) -> List[dict[str, Any]]:
        """Search for category or competitor context. Never raises; logs on failure."""
        if not self.api_key:
            return []

        try:
            from tavily import TavilyClient

            client = TavilyClient(api_key=self.api_key)
            response = client.search(
                query=query,
                search_depth="basic",
                max_results=max_results,
            )
            return response.get("results", [])
        except Exception as e:
            logger.warning("Tavily research failed for query '%s' (non-fatal): %s", query, e)
            return []
