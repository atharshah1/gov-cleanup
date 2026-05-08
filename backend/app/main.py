from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as api_v1_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Smart municipal waste management platform API for EcoSync.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(settings.frontend_origin)],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    """Basic health check used by deployment platforms."""

    return {"status": "ok", "service": "ecosync-api"}


app.include_router(api_v1_router, prefix=settings.api_v1_prefix)
