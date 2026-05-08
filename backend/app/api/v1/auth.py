from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import LoginRequest, OTPRequest, OTPResponse, OTPVerifyRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services.auth_service import auth_service
from app.services.otp_service import otp_service

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/otp/request", response_model=OTPResponse)
async def request_otp(payload: OTPRequest) -> OTPResponse:
    """Generate an OTP for phone verification.

    The response includes the development OTP only while the SMS provider is not
    configured; production delivery should send this code through Twilio.
    """

    record = otp_service.create_code(payload.phone)
    return OTPResponse(
        phone=payload.phone,
        expires_in_seconds=otp_service.ttl_seconds,
        message=f"Development OTP generated. Send {record.code} through the configured SMS provider.",
    )


@router.post("/otp/verify", response_model=OTPResponse)
async def verify_otp(payload: OTPVerifyRequest) -> OTPResponse:
    if not otp_service.verify_code(payload.phone, payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")
    auth_service.mark_phone_verified(payload.phone)
    return OTPResponse(phone=payload.phone, expires_in_seconds=0, message="Phone number verified")


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> UserRead:
    return auth_service.register(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    return auth_service.login(payload)
