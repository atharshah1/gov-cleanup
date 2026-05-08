from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.enums import UserRole
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services.otp_service import otp_service


class AuthService:
    """Authentication service with repository-ready boundaries.

    The current implementation uses an in-memory store so the API contract can be
    exercised before database session wiring lands in the next iteration.
    """

    def __init__(self) -> None:
        self._users_by_phone: dict[str, dict[str, Any]] = {}
        self._next_id = 1

    def register(self, payload: RegisterRequest) -> UserRead:
        if payload.phone in self._users_by_phone:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number is already registered")

        now = datetime.now(timezone.utc)
        household_id = f"ECO-{now.year}-{self._next_id:06d}"
        user: dict[str, Any] = {
            "id": self._next_id,
            "name": payload.name,
            "phone": payload.phone,
            "email": payload.email,
            "password_hash": hash_password(payload.password),
            "role": payload.role,
            "address": payload.address,
            "verified": otp_service.is_verified(payload.phone),
            "household_id": household_id,
            "electricity_bill_path": payload.electricity_bill_path,
            "created_at": now,
            "updated_at": now,
        }
        self._next_id += 1
        self._users_by_phone[payload.phone] = user
        return self._to_read_model(user)

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self._users_by_phone.get(payload.phone)
        if user is None or not verify_password(payload.password, str(user["password_hash"])):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid phone or password")
        read_model = self._to_read_model(user)
        token = create_access_token(subject=str(read_model.id), claims={"role": read_model.role.value, "phone": read_model.phone})
        return TokenResponse(access_token=token, user=read_model)

    def mark_phone_verified(self, phone: str) -> None:
        user = self._users_by_phone.get(phone)
        if user is not None:
            user["verified"] = True
            user["updated_at"] = datetime.now(timezone.utc)

    def _to_read_model(self, user: dict[str, Any]) -> UserRead:
        return UserRead(
            id=int(user["id"]),
            name=str(user["name"]),
            phone=str(user["phone"]),
            email=user["email"],
            role=user["role"] if isinstance(user["role"], UserRole) else UserRole(str(user["role"])),
            address=str(user["address"]),
            verified=bool(user["verified"]),
            household_id=str(user["household_id"]),
            electricity_bill_path=user["electricity_bill_path"],
            created_at=user["created_at"],
            updated_at=user["updated_at"],
        )


auth_service = AuthService()
