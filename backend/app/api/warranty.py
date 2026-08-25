from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import WarrantyClaim, User
from app.schemas.schemas import WarrantyClaimCreate, WarrantyClaimResponse
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/warranty", tags=["Warranty"])

@router.post("/claim", response_model=WarrantyClaimResponse, status_code=status.HTTP_201_CREATED)
def create_warranty_claim(
    claim_in: WarrantyClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_claim = WarrantyClaim(**claim_in.dict(), user_id=current_user.id)
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    return new_claim

@router.get("/my", response_model=List[WarrantyClaimResponse])
def get_my_warranty_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WarrantyClaim).filter(WarrantyClaim.user_id == current_user.id).all()

@router.get("/all", response_model=List[WarrantyClaimResponse])
def get_all_warranty_claims(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    return db.query(WarrantyClaim).all()

@router.patch("/{claim_id}/status", response_model=WarrantyClaimResponse)
def update_warranty_claim_status(
    claim_id: int,
    status_str: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    claim = db.query(WarrantyClaim).filter(WarrantyClaim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Warranty claim not found")
    
    if status_str not in ["kutilmoqda", "korilmoqda", "tasdiqlandi", "rad_etildi"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    claim.status = status_str
    db.commit()
    db.refresh(claim)
    return claim
