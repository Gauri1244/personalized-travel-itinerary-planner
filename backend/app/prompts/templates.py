
def build_route_optimization_prompt(
    destination,
    activities,
    travel_style="moderate",
    mobility_concerns=None
):
    """
    Build a prompt to arrange activities in an efficient geographical route.
    """

    prompt = f"""
You are an expert travel planner specializing in geographic route optimization.

Destination: {destination}
Travel Style: {travel_style}
Mobility Concerns: {mobility_concerns or "None"}

Activities:
{activities}

Your task:
1. Arrange the activities in a geographically sensible order.
2. Group nearby attractions together.
3. Minimize unnecessary travel and backtracking.
4. Consider realistic travel time between locations.
5. Maintain a comfortable schedule according to the travel style.
6. Return the optimized itinerary in valid JSON format.

Use this JSON structure:
{{
    "destination": "{destination}",
    "optimized_route": [
        {{
            "sequence": 1,
            "activity": "Activity name",
            "location": "Location",
            "estimated_travel_time": "15 minutes",
            "reason": "Why this activity is placed here"
        }}
    ],
    "optimization_summary": "Explanation of the route optimization"
}}

Return only valid JSON. Do not include Markdown formatting.
"""
    return prompt

