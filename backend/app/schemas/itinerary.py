"""Public API contracts for itinerary endpoints (planned)."""

from datetime import date
from typing import Any

from pydantic import BaseModel, Field


class ItineraryRequest(BaseModel):
    """Incoming trip details from the frontend."""

    destination: str = Field(..., description="City or region to visit")
    start_date: date | None = None
    end_date: date | None = None
    preferences: dict[str, Any] = Field(default_factory=dict)


class ItineraryResponse(BaseModel):
    """Planned itinerary payload returned to the client."""

    id: str | None = None
    destination: str
    days: list[dict[str, Any]] = Field(default_factory=list)
    notes: str | None = None
