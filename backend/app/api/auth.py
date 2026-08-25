import time
from typing import Dict, Tuple
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, SecurityAuditLog
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

# Brute-force in-memory tracker: key -> (failed_attempts, last_attempt_timestamp)
login_attempts: Dict[str, Tuple[int, float]] = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 180  # 3 minutes

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def check_rate_limit(key: str):
    now = time.time()
    if key in login_attempts:
        attempts, last_time = login_attempts[key]
        if attempts >= MAX_FAILED_ATTEMPTS:
            if now - last_time < LOCKOUT_DURATION_SECONDS:
                remaining = int(LOCKOUT_DURATION_SECONDS - (now - last_time))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Ko'p marotaba noto'g'ri urinish amalga oshirildi. Xavfsizlik yuzasidan {remaining} soniya kuting."
                )
            else:
                # Reset after cooldown
                login_attempts[key] = (0, now)

def record_failed_attempt(key: str):
    now = time.time()
    if key in login_attempts:
        attempts, _ = login_attempts[key]
        login_attempts[key] = (attempts + 1, now)
    else:
        login_attempts[key] = (1, now)

def reset_attempts(key: str):
    if key in login_attempts:
        del login_attempts[key]

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)

    # Check if username exists
    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu foydalanuvchi nomi (username) allaqachon band qilingan."
        )
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu elektron pochta (email) allaqachon ro'yxatdan o'tgan."
        )
    
    # Check if this matches configured admin username
    is_admin = (user_in.username == settings.ADMIN_USERNAME)

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_admin=is_admin,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Log security event
    log = SecurityAuditLog(
        event_type="USER_REGISTER",
        username=user.username,
        ip_address=ip,
        details=f"Yangi foydalanuvchi ro'yxatdan o'tdi: {user.username} (Email: {user.email})",
        status="INFO"
    )
    db.add(log)
    db.commit()

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    rate_limit_key = f"{ip}_{user_in.username_or_email}"
    
    # Enforce brute-force rate limit protection
    check_rate_limit(rate_limit_key)

    # Search by username or email
    user = db.query(User).filter(
        (User.username == user_in.username_or_email) | (User.email == user_in.username_or_email)
    ).first()

    # Special check if the default admin is logging in and user doesn't exist yet in DB
    if not user and user_in.username_or_email == settings.ADMIN_USERNAME:
        if user_in.password == settings.ADMIN_PASSWORD:
            user = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                is_admin=True,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            record_failed_attempt(rate_limit_key)
            db.add(SecurityAuditLog(
                event_type="LOGIN_FAILED",
                username=user_in.username_or_email,
                ip_address=ip,
                details="Admin hisobiga kirishda noto'g'ri parol kiritildi",
                status="WARNING"
            ))
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Login yoki parol noto'g'ri kiritildi."
            )
    elif not user:
        record_failed_attempt(rate_limit_key)
        db.add(SecurityAuditLog(
            event_type="LOGIN_FAILED",
            username=user_in.username_or_email,
            ip_address=ip,
            details=f"Mavjud bo'lmagan foydalanuvchi bilan kirishga urinish: {user_in.username_or_email}",
            status="WARNING"
        ))
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login yoki parol noto'g'ri kiritildi."
        )
    else:
        if not verify_password(user_in.password, user.hashed_password):
            # Also allow fallback if exact admin credentials match
            if user.username == settings.ADMIN_USERNAME and user_in.password == settings.ADMIN_PASSWORD:
                user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
                user.is_admin = True
                db.commit()
            else:
                record_failed_attempt(rate_limit_key)
                db.add(SecurityAuditLog(
                    event_type="LOGIN_FAILED",
                    username=user.username,
                    ip_address=ip,
                    details=f"{user.username} hisobiga kirishda xato parol kiritildi",
                    status="WARNING"
                ))
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Login yoki parol noto'g'ri kiritildi."
                )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Akkaunt bloklangan."
        )

    # Reset failed attempts on success
    reset_attempts(rate_limit_key)

    # Log successful login
    db.add(SecurityAuditLog(
        event_type="LOGIN_SUCCESS",
        username=user.username,
        ip_address=ip,
        details=f"Foydalanuvchi muvaffaqiyatli kirdi ({'ADMIN' if user.is_admin else 'ODDIY USER'})",
        status="INFO"
    ))
    db.commit()

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
