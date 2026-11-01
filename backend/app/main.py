"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.config.settings import get_settings

settings = get_settings()

app = FastAPI(
    title="Personalized Travel Itinerary Planner",
    description="API for generating and managing personalized travel itineraries.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)


@app.get("/")
def root():
    return {"message": "Personalized Travel Itinerary Planner API"}
