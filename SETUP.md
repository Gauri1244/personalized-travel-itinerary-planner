# Setup

This project is a scaffold. The React frontend is ready to run. The FastAPI backend is a placeholder (health check only). Packages listed in `backend/requirements.txt` are not installed yet.

## Prerequisites

- Node.js (for the frontend)
- Python 3.11+ (for the backend, when you start it)
- A Supabase project (later, for tables in `database/schema.sql`)

## Environment variables

1. Copy `.env.example` to `.env`.
2. Leave secrets empty until you are ready to connect Supabase and an AI provider.
3. Never commit `.env`.

## Frontend

The existing Vite app lives in `frontend/` and was not modified.

```bash
cd frontend
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Backend (next step)

When you are ready to run the API:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Health check: `http://localhost:8000/health`

Run uvicorn from the `backend/` directory so the `app` package is importable.

## Database (later)

Do not apply schema yet unless you intend to. When ready, review `database/schema.sql` and run the uncommented statements in the Supabase SQL editor.
