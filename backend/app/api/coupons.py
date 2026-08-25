import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Coupon, User
from app.schemas.schemas import CouponCreate, CouponResponse, CouponValidate, CouponValidateResponse
from app.core.dependencies import get_current_admin_user, get_current_user

router = APIRouter(prefix="/coupons", tags=["Coupons & Promo Codes"])


@router.get("", response_model=List[CouponResponse])
def get_all_coupons(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Admin uchun barcha kuponlarni ko'rish"""
    return db.query(Coupon).order_by(Coupon.created_at.desc()).all()


@router.post("", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(
    coupon_in: CouponCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Yangi kupon/promo kod yaratish (faqat admin)"""
    existing = db.query(Coupon).filter(Coupon.code == coupon_in.code.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu promo kod allaqachon mavjud.")
    
    coupon_data = coupon_in.model_dump()
    coupon_data["code"] = coupon_data["code"].upper()
    
    if coupon_data["discount_type"] == "percentage" and coupon_data["discount_value"] > 100:
        raise HTTPException(status_code=400, detail="Foiz chegirma 100% dan oshmasligi kerak.")
    
    coupon = Coupon(**coupon_data)
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(
    data: CouponValidate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Promo kodni tekshirish va chegirma miqdorini hisoblash"""
    coupon = db.query(Coupon).filter(Coupon.code == data.code.upper()).first()
    
    if not coupon:
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message="Bunday promo kod topilmadi."
        )
    
    if not coupon.is_active:
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message="Ushbu promo kod faol emas."
        )
    
    if coupon.expires_at and coupon.expires_at < datetime.datetime.utcnow():
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message="Ushbu promo kodning muddati tugagan."
        )
    
    if coupon.used_count >= coupon.usage_limit:
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message="Ushbu promo kod ishlatish limiti tugagan."
        )
    
    if data.order_total < coupon.min_order_amount:
        return CouponValidateResponse(
            valid=False,
            discount_amount=0,
            message=f"Minimal buyurtma summasi {coupon.min_order_amount:,.0f} so'm bo'lishi kerak."
        )
    
    # Calculate discount
    if coupon.discount_type == "percentage":
        discount = data.order_total * (coupon.discount_value / 100)
        if coupon.max_discount_amount:
            discount = min(discount, coupon.max_discount_amount)
    else:
        discount = coupon.discount_value
    
    discount = min(discount, data.order_total)
    
    return CouponValidateResponse(
        valid=True,
        discount_amount=discount,
        message=f"Promo kod qo'llanildi! Chegirma: {discount:,.0f} so'm",
        coupon=CouponResponse.model_validate(coupon)
    )


@router.post("/apply/{coupon_code}")
def apply_coupon(
    coupon_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Promo kodni ishlatilgan deb belgilash"""
    coupon = db.query(Coupon).filter(Coupon.code == coupon_code.upper()).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Promo kod topilmadi.")
    
    coupon.used_count += 1
    db.commit()
    return {"message": "Promo kod muvaffaqiyatli qo'llanildi."}


@router.put("/{coupon_id}", response_model=CouponResponse)
def update_coupon(
    coupon_id: int,
    coupon_in: CouponCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Kuponni tahrirlash (admin)"""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Kupon topilmadi.")
    
    update_data = coupon_in.model_dump()
    update_data["code"] = update_data["code"].upper()
    for field, value in update_data.items():
        setattr(coupon, field, value)
    
    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Kuponni o'chirish (admin)"""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Kupon topilmadi.")
    
    db.delete(coupon)
    db.commit()
    return {"message": "Kupon muvaffaqiyatli o'chirildi."}
