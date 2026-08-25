from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.models import WishlistItem, Product, User
from app.schemas.schemas import WishlistItemCreate, WishlistItemResponse, ProductResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist / Sevimlilar"])


@router.get("", response_model=List[WishlistItemResponse])
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Foydalanuvchining sevimli mahsulotlari ro'yxati"""
    items = db.query(WishlistItem).options(
        joinedload(WishlistItem.product)
    ).filter(
        WishlistItem.user_id == current_user.id
    ).order_by(WishlistItem.created_at.desc()).all()
    
    result = []
    for item in items:
        result.append(WishlistItemResponse(
            id=item.id,
            product_id=item.product_id,
            created_at=item.created_at,
            product=ProductResponse.model_validate(item.product) if item.product else None
        ))
    return result


@router.post("", status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    item_in: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mahsulotni sevimlilar ro'yxatiga qo'shish"""
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == item_in.product_id
    ).first()
    
    if existing:
        return {"message": "Mahsulot allaqachon sevimlilar ro'yxatida.", "id": existing.id}
    
    wishlist_item = WishlistItem(
        user_id=current_user.id,
        product_id=item_in.product_id
    )
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    
    return {"message": "Mahsulot sevimlilarga qo'shildi!", "id": wishlist_item.id}


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mahsulotni sevimlilardan o'chirish"""
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Mahsulot sevimlilarda topilmadi.")
    
    db.delete(item)
    db.commit()
    return {"message": "Mahsulot sevimlilardan olib tashlandi."}


@router.delete("")
def clear_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Barcha sevimlilarni tozalash"""
    db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Sevimlilar ro'yxati tozalandi."}


@router.get("/check/{product_id}")
def check_in_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mahsulot sevimlilarda borligini tekshirish"""
    exists = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first() is not None
    
    return {"in_wishlist": exists}
