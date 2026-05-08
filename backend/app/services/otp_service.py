from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from random import SystemRandom


@dataclass(slots=True)
class OTPRecord:
    code: str
    expires_at: datetime
    verified: bool = False


class OTPService:
    """In-memory OTP service boundary ready for Twilio/SMS integration."""

    def __init__(self, ttl_seconds: int = 300) -> None:
        self.ttl_seconds = ttl_seconds
        self._records: dict[str, OTPRecord] = {}
        self._random = SystemRandom()

    def create_code(self, phone: str) -> OTPRecord:
        code = f"{self._random.randrange(100000, 999999)}"
        record = OTPRecord(code=code, expires_at=datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds))
        self._records[phone] = record
        return record

    def verify_code(self, phone: str, code: str) -> bool:
        record = self._records.get(phone)
        if record is None or record.expires_at < datetime.now(timezone.utc):
            return False
        if record.code != code:
            return False
        record.verified = True
        return True

    def is_verified(self, phone: str) -> bool:
        record = self._records.get(phone)
        return bool(record and record.verified)


otp_service = OTPService()
