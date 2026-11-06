
from typing import Optional


def build_itinerary_prompt(
    destination: str,
    start_date: str,
    end_date: str,
    travel_style: str,
    interests: list[str],
    group_size: int,
    pace: str,
    budget_per_day: float,
    dietary_restrictions: Optional[list[str]] = None,
    mobility_concerns: Optional[str] = None,
) -> str:
    """Build a personalized prompt for AI itinerary generation."""

    dietary_info = (
        f"Dietary restrictions: {', '.join(dietary_restrictions)}"
        if dietary_restrictions
        else "No dietary restrictions."
    )

    mobility_info = (
        f"Mobility considerations: {mobility_concerns}"
        if mobility_concerns
        else "No special mobility concerns."
    )

    interests_str = ", ".join(interests)

    pace_description = {
        "relaxed": "one or two main activities per day with plenty of rest",
        "moderate": "two to three main activities per day with some downtime",
        "fast": "three to four main activities per day, constantly exploring",
        "adventure": "outdoor adventures, hiking, water sports, and exciting experiences",
        "luxury": "premium experiences, comfortable transport, fine dining, and luxury stays",
        "budget": "affordable attractions, local food, economical transport, and low-cost activities",
    }.get(pace.lower(), "two to three main activities per day")

    prompt = f"""
You are an expert travel planner.

Create a detailed and personalized travel itinerary.

TRAVEL DETAILS:
Destination: {destination}
Travel dates: {start_date} to {end_date}
Travel style: {travel_style}
Group size: {group_size} people
Interests: {interests_str}
Travel pace: {pace_description}
Daily budget: {budget_per_day}

ADDITIONAL REQUIREMENTS:
{dietary_info}
{mobility_info}

INSTRUCTIONS:
1. Create a day-by-day travel itinerary.
2. Suggest attractions and activities based on the user's interests.
3. Include suitable food and dining recommendations.
4. Consider the daily budget.
5. Suggest reasonable travel arrangements between activities.
6. Avoid overcrowding the schedule.
7. Provide practical and useful travel tips.
8. Personalize every recommendation according to the selected travel style.
9. When modifying an itinerary, preserve the user's previous preferences and requirements.

Return the itinerary in a clear and organized format.
"""

    return prompt.strip()

