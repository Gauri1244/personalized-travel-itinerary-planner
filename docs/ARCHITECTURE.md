# Architecture

Personalized Travel Itinerary Planner is a full-stack app that turns trip preferences into a day-by-day plan.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| Backend | Python, FastAPI |
| Database | Supabase (PostgreSQL) |
| AI | Generative AI for itinerary recommendations |

## Request flow

1. The React app in `frontend/` collects destination, dates, and travel style.
2. FastAPI in `backend/` receives the request on a route under `app/api/routes/`.
3. A service in `app/services/` orchestrates validation, persistence, and AI generation.
4. Pydantic schemas in `app/schemas/` validate input and shape JSON output.
5. Domain models in `app/models/` represent trips and itineraries.
6. Supabase stores users, trips, days, and activities (see `database/schema.sql`).
7. The AI service (planned) returns a draft itinerary that the frontend can display and edit.

## Folder roles

- `frontend/` — UI only. Keep API calls in future client modules; do not mix server secrets here.
- `backend/app/api/` — HTTP surface. Keep handlers thin.
- `backend/app/services/` — Business rules and third-party clients (Supabase, AI).
- `backend/app/models/` — Internal entities that map to tables.
- `backend/app/schemas/` — Public contracts between frontend and backend.
- `backend/app/config/` — Environment-based settings. Secrets stay in `.env` (never committed).
- `database/` — SQL to apply in Supabase when tables are ready.
- `docs/` — Human-readable architecture and API notes.

## Configuration

Copy `.env.example` to `.env` at the repo root (or next to the backend) and fill in values locally. The backend reads them through `app.config.settings`.
