# Personalized Travel Itinerary Planner

AI-powered trip planner that turns a destination, dates, and travel style into a day-by-day itinerary.

## Stack

- **Frontend:** React, Vite, JavaScript (`frontend/`)
- **Backend:** Python, FastAPI (`backend/`)
- **Database:** Supabase (`database/`)
- **AI:** Generative recommendations (planned in `backend/app/services/`)

## Repository layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Existing React application |
| `backend/` | FastAPI app: routes, services, models, schemas, config |
| `database/` | SQL stubs for future Supabase tables |
| `docs/` | Architecture and API notes |

## Quick start

See [SETUP.md](SETUP.md) for local setup.

The frontend already runs as a Vite app. The backend currently exposes a health check only; itinerary generation is not implemented yet.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
