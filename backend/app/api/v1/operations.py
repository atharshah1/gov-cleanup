from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.analytics import AnalyticsSummary
from app.schemas.complaint import ComplaintCreate, ComplaintRead, ComplaintStatusUpdate
from app.schemas.notification import NotificationCreate, NotificationRead
from app.schemas.pickup_request import PickupAssignment, PickupRequestCreate, PickupRequestRead, PickupStatusUpdate
from app.schemas.reward import RewardCreate, RewardRead, RewardRedeem
from app.schemas.tracking import DriverRead
from app.services.operations_service import operations_service

router = APIRouter(tags=["operations"])


@router.post("/pickups", response_model=PickupRequestRead, status_code=status.HTTP_201_CREATED)
async def create_pickup(payload: PickupRequestCreate, session: AsyncSession = Depends(get_db)) -> PickupRequestRead:
    return await operations_service.create_pickup(session, payload)


@router.get("/pickups", response_model=list[PickupRequestRead])
async def list_pickups(
    user_id: int | None = Query(default=None),
    driver_id: int | None = Query(default=None),
    session: AsyncSession = Depends(get_db),
) -> list[PickupRequestRead]:
    return await operations_service.list_pickups(session, user_id=user_id, driver_id=driver_id)


@router.patch("/pickups/{pickup_id}/assign", response_model=PickupRequestRead)
async def assign_pickup(
    pickup_id: int,
    payload: PickupAssignment,
    session: AsyncSession = Depends(get_db),
) -> PickupRequestRead:
    return await operations_service.assign_pickup(session, pickup_id, payload)


@router.patch("/pickups/{pickup_id}/status", response_model=PickupRequestRead)
async def update_pickup_status(
    pickup_id: int,
    payload: PickupStatusUpdate,
    session: AsyncSession = Depends(get_db),
) -> PickupRequestRead:
    return await operations_service.update_pickup_status(session, pickup_id, payload)


@router.post("/complaints", response_model=ComplaintRead, status_code=status.HTTP_201_CREATED)
async def create_complaint(payload: ComplaintCreate, session: AsyncSession = Depends(get_db)) -> ComplaintRead:
    return await operations_service.create_complaint(session, payload)


@router.get("/complaints", response_model=list[ComplaintRead])
async def list_complaints(user_id: int | None = Query(default=None), session: AsyncSession = Depends(get_db)) -> list[ComplaintRead]:
    return await operations_service.list_complaints(session, user_id=user_id)


@router.patch("/complaints/{complaint_id}/status", response_model=ComplaintRead)
async def update_complaint_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    session: AsyncSession = Depends(get_db),
) -> ComplaintRead:
    return await operations_service.update_complaint_status(session, complaint_id, payload)


@router.post("/rewards", response_model=RewardRead, status_code=status.HTTP_201_CREATED)
async def create_reward(payload: RewardCreate, session: AsyncSession = Depends(get_db)) -> RewardRead:
    return await operations_service.create_reward(session, payload)


@router.get("/rewards", response_model=list[RewardRead])
async def list_rewards(user_id: int | None = Query(default=None), session: AsyncSession = Depends(get_db)) -> list[RewardRead]:
    return await operations_service.list_rewards(session, user_id=user_id)


@router.patch("/rewards/{reward_id}/redeem", response_model=RewardRead)
async def redeem_reward(reward_id: int, payload: RewardRedeem, session: AsyncSession = Depends(get_db)) -> RewardRead:
    return await operations_service.redeem_reward(session, reward_id, payload)


@router.post("/notifications", response_model=NotificationRead, status_code=status.HTTP_201_CREATED)
async def create_notification(payload: NotificationCreate, session: AsyncSession = Depends(get_db)) -> NotificationRead:
    return await operations_service.create_notification(session, payload)


@router.get("/drivers", response_model=list[DriverRead])
async def list_drivers(session: AsyncSession = Depends(get_db)) -> list[DriverRead]:
    return await operations_service.list_drivers(session)


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def analytics_summary(session: AsyncSession = Depends(get_db)) -> AnalyticsSummary:
    return await operations_service.analytics_summary(session)


@router.get("/analytics/export.csv")
async def analytics_export_csv(session: AsyncSession = Depends(get_db)) -> Response:
    csv_content = await operations_service.analytics_export_csv(session)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="ecosync-analytics.csv"'},
    )
