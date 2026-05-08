from app.schemas.analytics import AnalyticsSummary, EfficiencyMetric, WasteDistributionPoint
from app.schemas.auth import LoginRequest, OTPRequest, OTPResponse, OTPVerifyRequest, RegisterRequest, TokenResponse
from app.schemas.complaint import ComplaintCreate, ComplaintRead, ComplaintStatusUpdate
from app.schemas.driver import DriverCreate, DriverRead, DriverUpdate
from app.schemas.notification import NotificationCreate, NotificationRead
from app.schemas.pickup_request import PickupAssignment, PickupRequestCreate, PickupRequestRead, PickupStatusUpdate
from app.schemas.reward import RewardCreate, RewardRead, RewardRedeem
from app.schemas.user import UserCreate, UserRead, UserUpdate

__all__ = [
    "TokenResponse",
    "RegisterRequest",
    "OTPVerifyRequest",
    "OTPResponse",
    "OTPRequest",
    "LoginRequest",
    "WasteDistributionPoint",
    "EfficiencyMetric",
    "AnalyticsSummary",
    "ComplaintCreate",
    "ComplaintRead",
    "ComplaintStatusUpdate",
    "DriverCreate",
    "DriverRead",
    "DriverUpdate",
    "NotificationCreate",
    "NotificationRead",
    "PickupAssignment",
    "PickupRequestCreate",
    "PickupRequestRead",
    "PickupStatusUpdate",
    "RewardCreate",
    "RewardRead",
    "RewardRedeem",
    "UserCreate",
    "UserRead",
    "UserUpdate",
]
