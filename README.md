# EcoSync

EcoSync is a full-stack smart municipal waste management platform for coordinating citizens, collection drivers, and municipal administrators.

## Project Overview

The platform is designed to support verified household onboarding, OTP-based registration, electricity bill verification, pickup scheduling, complaint workflows, rewards, route visibility, and analytics for cleaner municipal operations.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, React Router, Zustand, React Query, Axios, Framer Motion, Recharts
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic, JWT authentication, async APIs
- **Database:** PostgreSQL
- **Maps:** Google Maps API or Leaflet with OpenStreetMap
- **Notifications:** Twilio SMS and email-ready service boundaries
- **Analytics:** Pandas-ready backend analytics modules

## Environment Variables

Create `backend/.env` before running the API:

```env
APP_NAME="EcoSync API"
ENVIRONMENT="local"
DATABASE_URL="postgresql+asyncpg://ecosync:ecosync@localhost:5432/ecosync"
JWT_SECRET_KEY="replace-with-a-secure-secret"
FRONTEND_ORIGIN="http://localhost:5173"
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on <http://localhost:5173> by default.

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # create manually if the example is not present yet
alembic upgrade head
uvicorn app.main:app --reload
```

The API runs on <http://localhost:8000> by default.

## Database Setup

1. Create a PostgreSQL database named `ecosync`.
2. Configure `DATABASE_URL` in `backend/.env`.
3. Run Alembic migrations from the `backend` directory.

The initial planned schema includes `users`, `pickup_requests`, `complaints`, `rewards`, `drivers`, and `notifications`.

## API Documentation

When the backend server is running, FastAPI exposes interactive documentation at:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## Planning and Progress Tracking

All project planning, architecture notes, dependency-safe task selection, generated file lists, and progress updates are maintained exclusively in `tasks.json`.
