# EcoSync

EcoSync is a full-stack municipal waste operations platform for three roles:

- Citizen: schedule pickups, submit complaints, track assigned driver, earn rewards
- Driver: manage assigned pickups, update status, push live location
- Admin: view analytics, monitor system activity, assign pickups to drivers

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind + React Router + Zustand + React Query
- Backend: FastAPI + SQLAlchemy + Alembic + JWT auth
- Database: PostgreSQL
- Maps and tracking: Leaflet + OpenStreetMap + WebSocket updates

## Repository Layout

- frontend: React application
- backend: FastAPI service, database models, migrations, API routes
- tasks.json: local planning and progress notes

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- PostgreSQL 14+

## 1) Backend Setup

From project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create backend/.env (or copy from backend/.env.example if available):

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

Run migrations and start API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Backend URL: <http://localhost:8000>

## 2) Frontend Setup

From project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: <http://localhost:5173>

Optional checks:

```bash
npm run lint
```

## 3) Role-Based Frontend Routes

EcoSync now enforces role-safe navigation and protected dashboards.

Public routes:

- /login (redirects to /login/citizen)
- /login/citizen
- /login/driver
- /login/admin
- /signup (redirects to /signup/citizen)
- /signup/citizen
- /signup/driver
- /signup/admin

Protected routes (authentication required):

- /dashboard/user (citizen only)
- /dashboard/driver (driver only)
- /dashboard/admin (admin only)
- /features (authenticated users)

Route behavior:

- Unauthenticated user attempting a dashboard route is redirected to /login.
- Authenticated user attempting another role's dashboard is redirected to their own dashboard.
- Dashboard header navigation only shows the logged-in user's own dashboard link plus Features.

Legacy compatibility:

- /register and /register/:role redirect to /signup and /signup/:role.

## 4) Signup and Login Flows by Role

Signup requirements differ by role:

- Citizen: OTP required, household address required, electricity bill upload required
- Driver: OTP required, vehicle number required, no household bill upload required
- Admin: OTP not required, no household bill upload required

Citizen flow:

1. Open /signup/citizen.
2. Fill profile details, request OTP, verify OTP.
3. Complete signup and auto-login.
4. User lands on /dashboard/user.

Driver flow:

1. Open /signup/driver.
2. Fill profile, address, and vehicle number, then verify OTP.
3. Complete signup and auto-login.
4. User lands on /dashboard/driver.

Admin flow:

1. Open /signup/admin.
2. Fill profile and office/contact address.
3. Complete signup and auto-login without OTP.
4. User lands on /dashboard/admin.

Role login safety:

- If a user signs in through a role-specific portal (for example /login/admin) with a different role account, the frontend blocks the sign-in and shows an error.

## 5) API Documentation

When backend is running:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## 6) End-to-End Local Test Scenario

1. Signup/login as citizen and create a pickup request.
2. Signup/login as driver.
3. Signup/login as admin.
4. From admin dashboard, assign pickup to driver.
5. From driver dashboard, post location updates and status changes.
6. Return to citizen dashboard and confirm live updates are visible.

## 7) Troubleshooting

- OTP not delivered:
	- Verify Twilio variables in backend/.env.
	- Check backend logs for OTP provider errors.
- 401/403 API errors:
	- Confirm backend is running and CORS FRONTEND_ORIGIN is correct.
	- Re-login to refresh local JWT state.
- Dashboard access mismatch:
	- Confirm signed-in role and open matching route.
	- Use role-specific login portal to avoid confusion.
