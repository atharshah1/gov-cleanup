from fastapi import APIRouter, status

from app.schemas.analytics import AnalyticsSummary
from app.schemas.complaint import ComplaintCreate, ComplaintRead, ComplaintStatusUpdate
from app.schemas.notification import NotificationCreate, NotificationRead
from app.schemas.pickup_request import PickupAssignment, PickupRequestCreate, PickupRequestRead, PickupStatusUpdate
from app.schemas.reward import RewardCreate, RewardRead, RewardRedeem
from app.services.operations_service import operations_service

router = APIRouter(tags=["operations"])


@router.post("/pickups", response_model=PickupRequestRead, status_code=status.HTTP_201_CREATED)
async def create_pickup(payload: PickupRequestCreate) -> PickupRequestRead:
    return operations_service.create_pickup(payload)


@router.get("/pickups", response_model=list[PickupRequestRead])
async def list_pickups() -> list[PickupRequestRead]:
    return operations_service.list_pickups()


@router.patch("/pickups/{pickup_id}/assign", response_model=PickupRequestRead)
async def assign_pickup(pickup_id: int, payload: PickupAssignment) -> PickupRequestRead:
    return operations_service.assign_pickup(pickup_id, payload)


@router.patch("/pickups/{pickup_id}/status", response_model=PickupRequestRead)
async def update_pickup_status(pickup_id: int, payload: PickupStatusUpdate) -> PickupRequestRead:
    return operations_service.update_pickup_status(pickup_id, payload)


@router.post("/complaints", response_model=ComplaintRead, status_code=status.HTTP_201_CREATED)
async def create_complaint(payload: ComplaintCreate) -> ComplaintRead:
    return operations_service.create_complaint(payload)


@router.get("/complaints", response_model=list[ComplaintRead])
async def list_complaints() -> list[ComplaintRead]:
    return operations_service.list_complaints()


@router.patch("/complaints/{complaint_id}/status", response_model=ComplaintRead)
async def update_complaint_status(complaint_id: int, payload: ComplaintStatusUpdate) -> ComplaintRead:
    return operations_service.update_complaint_status(complaint_id, payload)


@router.post("/rewards", response_model=RewardRead, status_code=status.HTTP_201_CREATED)
async def create_reward(payload: RewardCreate) -> RewardRead:
    return operations_service.create_reward(payload)


@router.get("/rewards", response_model=list[RewardRead])
async def list_rewards() -> list[RewardRead]:
    return operations_service.list_rewards()


@router.patch("/rewards/{reward_id}/redeem", response_model=RewardRead)
async def redeem_reward(reward_id: int, payload: RewardRedeem) -> RewardRead:
    return operations_service.redeem_reward(reward_id, payload)


@router.post("/notifications", response_model=NotificationRead, status_code=status.HTTP_201_CREATED)
async def create_notification(payload: NotificationCreate) -> NotificationRead:
    return operations_service.create_notification(payload)


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def analytics_summary() -> AnalyticsSummary:
    return operations_service.analytics_summary()
