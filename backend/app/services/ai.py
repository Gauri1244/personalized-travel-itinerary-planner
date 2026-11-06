"""AI Model Integration Services."""

import logging
import json
from abc import ABC, abstractmethod
from app.prompts.templates import build_route_optimization_prompt

from app.services.ai_service import get_ai_service
class AIGenerationError(Exception):
    """Custom exception for AI generation errors."""
    pass
logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate text using the LLM."""
        pass


class GeminiProvider(LLMProvider):
    """Gemini API provider using the existing AI service."""

    def __init__(self):
        try:
            self.ai_service = get_ai_service()
            logger.info("Gemini provider initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {str(e)}")
            raise AIGenerationError(
                f"Gemini initialization failed: {str(e)}"
            )

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        try:
            from google.genai import types

            response = self.ai_service.client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json"
                )
            )

            return response.text

        except Exception as e:
            logger.error(f"Gemini generation failed: {str(e)}")
            raise AIGenerationError(
                f"Itinerary generation failed: {str(e)}"
            )


def parse_itinerary_response(response: str) -> dict:
    """Convert AI response into a structured itinerary."""

    try:
        return json.loads(response)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid itinerary JSON: {str(e)}")
        raise AIGenerationError("AI returned an invalid itinerary format.")

async def generate_daily_schedule(destination: str, start_date: str,
                                  end_date: str, preferences: dict) -> dict:
    """Generate a balanced day-by-day travel schedule."""

    provider = GeminiProvider()

    system_prompt = """
    You are an expert travel itinerary planner.
    Create balanced daily travel schedules.

    Return valid JSON in this structure:
    {
      "destination": "Destination",
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "morning": {
            "activity": "Activity name",
            "time": "9:00 AM - 12:00 PM",
            "notes": "Activity details"
          },
          "afternoon": {
            "activity": "Activity name",
            "time": "12:00 PM - 5:00 PM",
            "notes": "Activity details"
          },
          "evening": {
            "activity": "Activity name",
            "time": "5:00 PM - 9:00 PM",
            "notes": "Activity details"
          }
        }
      ]
    }

    Keep activities realistic and avoid overcrowding each day.
    """

    user_prompt = f"""
    Create a personalized travel schedule for:

    Destination: {destination}
    Start date: {start_date}
    End date: {end_date}
    Preferences: {json.dumps(preferences)}

    Organize every day into morning, afternoon and evening.
    """

    response = await provider.generate(system_prompt, user_prompt)

    return parse_itinerary_response(response)

async def optimize_geographic_route(
    destination: str,
    activities: list,
    travel_style: str = "moderate",
    mobility_concerns: str = None
) -> dict:
    """Optimize the order of activities based on their locations."""

    provider = GeminiProvider()

    system_prompt = """
    You are an expert travel route optimization assistant.
    Arrange activities in an efficient geographical order.
    Minimize travel time, avoid unnecessary backtracking,
    and consider the traveler's pace and mobility needs.
    Return only valid JSON.
    """

    user_prompt = build_route_optimization_prompt(
        destination=destination,
        activities=json.dumps(activities),
        travel_style=travel_style,
        mobility_concerns=mobility_concerns
    )

    response = await provider.generate(system_prompt, user_prompt)

    return parse_itinerary_response(response)

async def modify_itinerary(
    destination: str,
    existing_itinerary: dict,
    user_request: str,
    preferences: dict = None
):
    """
    Modify an existing itinerary based on the user's request
    while preserving previous travel preferences.
    """

    prompt = f"""
You are an expert AI travel planner.

The user wants to modify an existing travel itinerary.

Destination: {destination}

Existing Itinerary:
{existing_itinerary}

Previous User Preferences:
{preferences or {}}

User's Modification Request:
{user_request}

Instructions:
1. Modify the itinerary according to the user's request.
2. Preserve all previous preferences unless the user asks to change them.
3. Keep unchanged days intact.
4. Maintain the selected travel style and budget.
5. Ensure activities are practical and suitable.
6. Return the complete updated itinerary in valid JSON.
7. Do not include Markdown formatting.

Return only valid JSON.
"""

    try:
        provider = GeminiProvider()
        response = await provider.generate(
            system_prompt="You are an expert AI travel planner who modifies existing itineraries.",
            user_prompt=prompt
        )
        return parse_itinerary_response(response)

    except Exception as error:
        raise AIGenerationError(
            f"Unable to modify itinerary: {str(error)}"
        )

