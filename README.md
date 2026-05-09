# EcoSync

EcoSync is a full-stack smart municipal waste management platform for coordinating citizens, collection drivers, and municipal administrators.

## Project Overview

The platform is designed to support verified household onboarding, OTP-based registration, electricity bill verification, pickup scheduling, complaint workflows, rewards, route visibility, and analytics for cleaner municipal operations.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, React Router, Zustand, React Query, Axios, Framer Motion, Recharts
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic, JWT authentication
- **Database:** PostgreSQL
- **Maps:** Leaflet with OpenStreetMap tiles for real pickup and driver tracking
- **Notifications:** Twilio SMS integration for OTP delivery
- **Analytics:** Pandas-powered backend analytics summary and CSV export

## Environment Variables

Create `backend/.env` before running the API:

```env
APP_NAME="EcoSync API"
ENVIRONMENT="local"
DATABASE_URL="postgresql://ecosync:ecosync@localhost:5432/ecosync"
JWT_SECRET_KEY="replace-with-a-secure-secret"
FRONTEND_ORIGIN="http://localhost:5173"
UPLOAD_DIR="backend/uploads"
MAX_UPLOAD_SIZE_MB="10"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_FROM_PHONE=""
```

## Frontend Setup

```bash
cd frontend
npm install
npm run lint
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

The schema includes `users`, `pickup_requests`, `complaints`, `rewards`, `drivers`, `notifications`, `otp_challenges`, and `driver_locations`.

## Integrated Feature Notes

- **Database persistence:** auth, pickups, complaints, rewards, notifications, OTPs, and live tracking events are persisted with SQLAlchemy and PostgreSQL.
- **Live tracking:** driver location updates are available through REST endpoints and `/api/v1/tracking/pickups/{pickup_id}/ws`.
- **Maps:** the frontend dashboards render OpenStreetMap maps with Leaflet for pickup destinations and live driver positions.
- **Uploads:** electricity bills can be uploaded through `/api/v1/uploads/electricity-bills` and are served from `/uploads/...`.
- **Analytics:** `/api/v1/analytics/summary` returns aggregated metrics and `/api/v1/analytics/export.csv` exports persisted pickup data.

## API Documentation

When the backend server is running, FastAPI exposes interactive documentation at:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## Planning and Progress Tracking

All project planning, architecture notes, dependency-safe task selection, generated file lists, and progress updates are maintained exclusively in `tasks.json`.
