# API

Base URL (local): `http://localhost:8000`

## Implemented

### `GET /health`

Liveness check for the FastAPI service.

**Response**

```json
{ "status": "ok" }
```

### `GET /`

Service identifier.

**Response**

```json
{ "message": "Personalized Travel Itinerary Planner API" }
```

## Planned

These endpoints are not implemented yet.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/itineraries` | Generate a personalized itinerary from destination, dates, and preferences |
| `GET` | `/itineraries/{id}` | Fetch a saved itinerary |
| `PATCH` | `/itineraries/{id}` | Refine days, activities, or budget |

Request and response shapes live in `backend/app/schemas/itinerary.py`.
