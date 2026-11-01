"""Itinerary domain model.

These fields are a sketch of the future Supabase tables.
Wire them to the database client in a later iteration.
"""

from dataclasses import dataclass, field
from datetime import date
from typing import Any


@dataclass
class Itinerary:
    id: str | None = None
    destination: str = ""
    start_date: date | None = None
    end_date: date | None = None
    days: list[dict[str, Any]] = field(default_factory=list)
    preferences: dict[str, Any] = field(default_factory=dict)
