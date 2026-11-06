import os
import time
from google.genai import errors
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(ROOT_DIR / ".env")
from google import genai
from app.services.prompt_builder import build_itinerary_prompt

class AIService:
    """Service for generating personalized travel recommendations."""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is missing from the .env file")

        self.client = genai.Client(api_key=api_key)

    def generate_itinerary(self, destination: str, preferences: dict) -> dict:
        prompt = build_itinerary_prompt(
            destination=destination,
            start_date=preferences.get("start_date", ""),
            end_date=preferences.get("end_date", ""),
            travel_style=preferences.get("travel_style", "general"),
            interests=preferences.get("interests", []),
            group_size=preferences.get("travellers", 1),
            pace=preferences.get("travel_pace", "moderate"),
            budget_per_day=preferences.get("budget", 0),
            dietary_restrictions=preferences.get("dietary_preferences"),
            mobility_concerns=preferences.get("mobility_concerns"),
        )

        response = None

        response = None

        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model="gemini-3.5-flash-lite",
                    contents=prompt
                )
                break

            except errors.APIError as e:
                if e.code == 503 and attempt < 2:
                    wait_time = 2 ** (attempt + 1)
                    print(f"Gemini is busy. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                     raise

        return {
            "destination": destination,
            "prompt": prompt,
            "itinerary": response.text,
            "status": "Itinerary generated successfully"
        }


def get_ai_service():
    return AIService()