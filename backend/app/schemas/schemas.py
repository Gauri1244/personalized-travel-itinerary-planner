
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class TripPreferences(BaseModel):
    budget: float = Field(gt=0)
    travellers: int = Field(ge=1, le=20)
    interests: List[str] = Field(min_length=1)
    dietary_preferences: List[str] = []
    travel_pace: str = "moderate"


class TripCreate(BaseModel):
    destination: str = Field(min_length=2)
    start_date: date
    end_date: date
    preferences: TripPreferences

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be before start date.")
        return self


class TripResponse(TripCreate):
    id: str
    user_id: Optional[str] = None

