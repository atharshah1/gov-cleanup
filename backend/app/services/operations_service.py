from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.models.enums import ComplaintStatus, PickupStatus, RewardSource, WasteType
from app.schemas.analytics import AnalyticsSummary, EfficiencyMetric, WasteDistributionPoint
from app.schemas.complaint import ComplaintCreate, ComplaintRead, ComplaintStatusUpdate
from app.schemas.notification import NotificationCreate, NotificationRead
from app.schemas.pickup_request import PickupAssignment, PickupRequestCreate, PickupRequestRead, PickupStatusUpdate
from app.schemas.reward import RewardCreate, RewardRead, RewardRedeem


class OperationsService:
    """In-memory operations service for pickup, complaint, reward, notification, and analytics APIs."""

    def __init__(self) -> None:
        self._pickups: dict[int, dict[str, Any]] = {}
        self._complaints: dict[int, dict[str, Any]] = {}
        self._rewards: dict[int, dict[str, Any]] = {}
        self._notifications: dict[int, dict[str, Any]] = {}
        self._ids = {"pickup": 1, "complaint": 1, "reward": 1, "notification": 1}

    def create_pickup(self, payload: PickupRequestCreate) -> PickupRequestRead:
        duplicate = any(
            pickup["user_id"] == payload.user_id
            and pickup["waste_type"] == payload.waste_type
            and pickup["scheduled_date"] == payload.scheduled_date
            for pickup in self._pickups.values()
        )
        if duplicate:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate pickup already exists for this date and waste type")
        now = datetime.now(timezone.utc)
        pickup = {
            "id": self._next_id("pickup"),
            "user_id": payload.user_id,
            "driver_id": None,
            "waste_type": payload.waste_type,
            "status": PickupStatus.PENDING,
            "scheduled_date": payload.scheduled_date,
            "scheduled_time": payload.scheduled_time,
            "coordinates": payload.coordinates.model_dump() if hasattr(payload.coordinates, "model_dump") else payload.coordinates,
            "notes": payload.notes,
            "created_at": now,
            "updated_at": now,
        }
        self._pickups[pickup["id"]] = pickup
        return PickupRequestRead(**pickup)

    def assign_pickup(self, pickup_id: int, payload: PickupAssignment) -> PickupRequestRead:
        pickup = self._get(self._pickups, pickup_id, "Pickup")
        pickup["driver_id"] = payload.driver_id
        pickup["status"] = PickupStatus.ASSIGNED
        pickup["updated_at"] = datetime.now(timezone.utc)
        return PickupRequestRead(**pickup)

    def update_pickup_status(self, pickup_id: int, payload: PickupStatusUpdate) -> PickupRequestRead:
        pickup = self._get(self._pickups, pickup_id, "Pickup")
        pickup["status"] = payload.status
        pickup["notes"] = payload.notes or pickup.get("notes")
        pickup["updated_at"] = datetime.now(timezone.utc)
        return PickupRequestRead(**pickup)

    def list_pickups(self) -> list[PickupRequestRead]:
        return [PickupRequestRead(**pickup) for pickup in self._pickups.values()]

    def create_complaint(self, payload: ComplaintCreate) -> ComplaintRead:
        now = datetime.now(timezone.utc)
        complaint = {"id": self._next_id("complaint"), "status": ComplaintStatus.OPEN, "created_at": now, "updated_at": now, **payload.model_dump()}
        self._complaints[complaint["id"]] = complaint
        return ComplaintRead(**complaint)

    def update_complaint_status(self, complaint_id: int, payload: ComplaintStatusUpdate) -> ComplaintRead:
        complaint = self._get(self._complaints, complaint_id, "Complaint")
        complaint["status"] = payload.status
        complaint["updated_at"] = datetime.now(timezone.utc)
        return ComplaintRead(**complaint)

    def list_complaints(self) -> list[ComplaintRead]:
        return [ComplaintRead(**complaint) for complaint in self._complaints.values()]

    def create_reward(self, payload: RewardCreate) -> RewardRead:
        now = datetime.now(timezone.utc)
        reward = {"id": self._next_id("reward"), "created_at": now, "updated_at": now, **payload.model_dump()}
        self._rewards[reward["id"]] = reward
        return RewardRead(**reward)

    def redeem_reward(self, reward_id: int, payload: RewardRedeem) -> RewardRead:
        reward = self._get(self._rewards, reward_id, "Reward")
        reward["redeemed"] = payload.redeemed
        reward["updated_at"] = datetime.now(timezone.utc)
        return RewardRead(**reward)

    def list_rewards(self) -> list[RewardRead]:
        return [RewardRead(**reward) for reward in self._rewards.values()]

    def create_notification(self, payload: NotificationCreate) -> NotificationRead:
        now = datetime.now(timezone.utc)
        notification = {"id": self._next_id("notification"), "sent_at": now, "created_at": now, "updated_at": now, **payload.model_dump()}
        self._notifications[notification["id"]] = notification
        return NotificationRead(**notification)

    def analytics_summary(self) -> AnalyticsSummary:
        distribution = [
            WasteDistributionPoint(waste_type=waste_type.value, requests=sum(1 for pickup in self._pickups.values() if pickup["waste_type"] == waste_type))
            for waste_type in WasteType
        ]
        completed = sum(1 for pickup in self._pickups.values() if pickup["status"] == PickupStatus.COMPLETED)
        total = max(len(self._pickups), 1)
        recycling_points = sum(int(reward["points"]) for reward in self._rewards.values() if reward["source"] == RewardSource.RECYCLING_PARTICIPATION)
        return AnalyticsSummary(
            waste_distribution=distribution,
            pickup_efficiency=EfficiencyMetric(label="completed_pickup_ratio", value=round(completed / total * 100, 2)),
            area_wise_pickups=[EfficiencyMetric(label="Ward 1", value=64), EfficiencyMetric(label="Ward 2", value=48), EfficiencyMetric(label="Ward 3", value=72)],
            complaint_trends=[EfficiencyMetric(label="open", value=sum(1 for item in self._complaints.values() if item["status"] == ComplaintStatus.OPEN))],
            recycling_participation=EfficiencyMetric(label="recycling_reward_points", value=recycling_points),
        )

    def _next_id(self, key: str) -> int:
        next_id = self._ids[key]
        self._ids[key] += 1
        return next_id

    @staticmethod
    def _get(items: dict[int, dict[str, Any]], item_id: int, label: str) -> dict[str, Any]:
        item = items.get(item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} not found")
        return item


operations_service = OperationsService()
