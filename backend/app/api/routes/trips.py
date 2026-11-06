
from fastapi import APIRouter, HTTPException

from app.schemas.schemas import TripCreate
from app.services.ai import (
    generate_daily_schedule,
    optimize_geographic_route,
    modify_itinerary
)
from app.services.trip_service import trip_service

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("/")
async def create_trip(trip: TripCreate):
    try:
        return {
            "message": "Trip details received and validated successfully!",
            "trip": trip.model_dump(mode="json")
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/generate")
async def generate_trip(trip: TripCreate):
    try:
        preferences = trip.preferences.model_dump()

        result = await generate_daily_schedule(
            destination=trip.destination,
            start_date=trip.start_date.isoformat(),
            end_date=trip.end_date.isoformat(),
            preferences=preferences
        )

        return {
            "message": "Personalized day-by-day itinerary generated successfully!",
            "result": result
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@router.post("/optimize-route")
async def optimize_route(payload: dict):
    try:
        destination = payload.get("destination")
        activities = payload.get("activities", [])
        travel_style = payload.get("travel_style", "moderate")
        mobility_concerns = payload.get("mobility_concerns")

        if not destination or not activities:
            raise HTTPException(
                status_code=400,
                detail="Destination and activities are required."
            )

        result = await optimize_geographic_route(
            destination=destination,
            activities=activities,
            travel_style=travel_style,
            mobility_concerns=mobility_concerns
        )

        return {
            "message": "Geographic route optimized successfully!",
            "result": result
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/modify")
async def modify_trip(payload: dict):
    try:
        destination = payload.get("destination")
        existing_itinerary = payload.get("existing_itinerary")
        user_request = payload.get("user_request")
        preferences = payload.get("preferences", {})

        if not destination or not existing_itinerary or not user_request:
            raise HTTPException(
                status_code=400,
                detail="Destination, existing itinerary, and user request are required."
            )

        result = await modify_itinerary(
            destination=destination,
            existing_itinerary=existing_itinerary,
            user_request=user_request,
            preferences=preferences
        )

        return {
            "message": "Itinerary modified successfully!",
            "result": result
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/save")
async def save_trip(payload: dict):
    try:
        result = trip_service.save_trip(payload)
        return {
            "message": "Trip saved successfully!",
            "result": result
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/history")
async def get_trip_history():
    try:
        result = trip_service.get_trips()
        return {"result": result}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{trip_id}")
async def update_trip(trip_id: str, payload: dict):
    try:
        result = trip_service.update_trip(trip_id, payload)
        return {
            "message": "Trip updated successfully!",
            "result": result
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    try:
        result = trip_service.delete_trip(trip_id)
        return {
            "message": "Trip deleted successfully!",
            "result": result
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
