from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import SellerApplication, User
from app.schemas.schemas import SellerApplicationCreate, SellerApplicationResponse
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/sellers", tags=["Sellers"])

@router.post("/apply", response_model=SellerApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_seller(
    app_in: SellerApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(SellerApplication).filter(SellerApplication.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Application already submitted")
        
    new_app = SellerApplication(**app_in.dict(), user_id=current_user.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/applications", response_model=List[SellerApplicationResponse])
def get_all_seller_applications(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    return db.query(SellerApplication).all()

@router.patch("/{app_id}/status", response_model=SellerApplicationResponse)
def update_seller_status(
    app_id: int,
    status_str: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    application = db.query(SellerApplication).filter(SellerApplication.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if status_str not in ["kutilmoqda", "tasdiqlandi", "rad_etildi"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    application.status = status_str
    db.commit()
    db.refresh(application)
    return application
