from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, UserAddress, Order, Review, SecurityAuditLog
from app.schemas.schemas import (
    UserResponse, UserProfileUpdate, ChangePassword,
    UserAddressCreate, UserAddressUpdate, UserAddressResponse
)
from app.core.security import verify_password, get_password_hash
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile & Addresses"])


@router.get("", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    """Joriy foydalanuvchi profilini ko'rish"""
    return current_user


@router.put("", response_model=UserResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Profil ma'lumotlarini yangilash"""
    if profile_in.username:
        existing = db.query(User).filter(
            User.username == profile_in.username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Bu foydalanuvchi nomi band.")
        current_user.username = profile_in.username
    
    if profile_in.email:
        existing = db.query(User).filter(
            User.email == profile_in.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan.")
        current_user.email = profile_in.email
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Parolni o'zgartirish"""
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Joriy parol noto'g'ri.")
    
    if data.current_password == data.new_password:
        raise HTTPException(status_code=400, detail="Yangi parol eski paroldan farq qilishi kerak.")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    # Log security event
    log = SecurityAuditLog(
        event_type="PASSWORD_CHANGE",
        username=current_user.username,
        ip_address="profile",
        details=f"Foydalanuvchi {current_user.username} parolini o'zgartirdi",
        status="INFO"
    )
    db.add(log)
    db.commit()
    
    return {"message": "Parol muvaffaqiyatli o'zgartirildi."}


@router.get("/stats")
def get_profile_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Foydalanuvchi statistikasi"""
    total_orders = db.query(Order).filter(Order.user_id == current_user.id).count()
    total_reviews = db.query(Review).filter(Review.user_id == current_user.id).count()
    total_spent_query = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status != "bekor_qilindi"
    ).all()
    total_spent = sum(o.total_amount for o in total_spent_query)
    total_addresses = db.query(UserAddress).filter(UserAddress.user_id == current_user.id).count()
    
    return {
        "total_orders": total_orders,
        "total_reviews": total_reviews,
        "total_spent": total_spent,
        "total_addresses": total_addresses,
        "member_since": current_user.created_at.isoformat() if current_user.created_at else None
    }


# --- ADDRESSES ---

@router.get("/addresses", response_model=List[UserAddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Yetkazib berish manzillarini olish"""
    return db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id
    ).order_by(UserAddress.is_default.desc(), UserAddress.created_at.desc()).all()


@router.post("/addresses", response_model=UserAddressResponse, status_code=status.HTTP_201_CREATED)
def create_address(
    address_in: UserAddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Yangi manzil qo'shish"""
    if address_in.is_default:
        # Reset other default addresses
        db.query(UserAddress).filter(
            UserAddress.user_id == current_user.id,
            UserAddress.is_default == True
        ).update({"is_default": False})
    
    address = UserAddress(
        user_id=current_user.id,
        **address_in.model_dump()
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.put("/addresses/{address_id}", response_model=UserAddressResponse)
def update_address(
    address_id: int,
    address_in: UserAddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manzilni tahrirlash"""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Manzil topilmadi.")
    
    update_data = address_in.model_dump(exclude_unset=True)
    
    if update_data.get("is_default"):
        db.query(UserAddress).filter(
            UserAddress.user_id == current_user.id,
            UserAddress.id != address_id,
            UserAddress.is_default == True
        ).update({"is_default": False})
    
    for field, value in update_data.items():
        setattr(address, field, value)
    
    db.commit()
    db.refresh(address)
    return address


@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manzilni o'chirish"""
    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Manzil topilmadi.")
    
    db.delete(address)
    db.commit()
    return {"message": "Manzil muvaffaqiyatli o'chirildi."}
