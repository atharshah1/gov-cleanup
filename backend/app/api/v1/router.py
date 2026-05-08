from fastapi import APIRouter

router = APIRouter()


@router.get("/status", tags=["system"])
async def api_status() -> dict[str, str]:
    """Return API version status for load balancers and clients."""

    return {"status": "ready", "version": "v1"}
