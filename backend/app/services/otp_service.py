import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from random import SystemRandom

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from twilio.base.exceptions import TwilioException
from twilio.rest import Client

from app.core.config import get_settings
from app.core.security import hash_password, verify_password
from app.models.otp_challenge import OTPChallenge

settings = get_settings()


@dataclass(slots=True)
class OTPRecord:
    code: str
    expires_at: datetime
    delivery_channel: str
    delivery_reference: str | None = None


class OTPService:
    """Database-backed OTP service with optional Twilio SMS delivery."""

    def __init__(self, ttl_seconds: int = 300) -> None:
        self.ttl_seconds = ttl_seconds
        self._random = SystemRandom()
        self._client = None
        if settings.twilio_account_sid and settings.twilio_auth_token:
            self._client = Client(settings.twilio_account_sid, settings.twilio_auth_token)

    async def create_code(self, session: AsyncSession, phone: str) -> OTPRecord:
        code = f"{self._random.randrange(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds)
        delivery_channel = "sms"
        delivery_reference: str | None = None

        if self._client and settings.twilio_from_phone:
            try:
                message = await asyncio.to_thread(
                    self._client.messages.create,
                    body=f"Your EcoSync verification code is {code}. It expires in {self.ttl_seconds // 60} minutes.",
                    from_=settings.twilio_from_phone,
                    to=phone,
                )
                delivery_reference = message.sid
            except TwilioException:
                delivery_channel = "sms-fallback"
        else:
            delivery_channel = "sms-fallback"

        challenge = OTPChallenge(
            phone=phone,
            code_hash=hash_password(code),
            expires_at=expires_at,
            delivery_channel=delivery_channel,
            delivery_reference=delivery_reference,
        )
        session.add(challenge)
        await session.flush()
        return OTPRecord(
            code=code,
            expires_at=expires_at,
            delivery_channel=delivery_channel,
            delivery_reference=delivery_reference,
        )

    async def verify_code(self, session: AsyncSession, phone: str, code: str) -> bool:
        record = await session.scalar(
            select(OTPChallenge).where(OTPChallenge.phone == phone).order_by(desc(OTPChallenge.created_at)).limit(1)
        )
        if record is None or record.verified or record.expires_at < datetime.now(timezone.utc):
            return False
        if not verify_password(code, record.code_hash):
            return False
        record.verified = True
        await session.flush()
        return True

    async def is_verified(self, session: AsyncSession, phone: str) -> bool:
        record = await session.scalar(
            select(OTPChallenge).where(OTPChallenge.phone == phone).order_by(desc(OTPChallenge.created_at)).limit(1)
        )
        return bool(record and record.verified)


otp_service = OTPService()
