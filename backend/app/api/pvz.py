from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import PickupPoint, User
from app.schemas.schemas import PickupPointCreate, PickupPointResponse
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/pvz", tags=["Pickup Points"])

@router.get("", response_model=List[PickupPointResponse])
def get_all_pvz(db: Session = Depends(get_db)):
    return db.query(PickupPoint).filter(PickupPoint.is_active == True).all()

@router.get("/{city}", response_model=List[PickupPointResponse])
def get_pvz_by_city(city: str, db: Session = Depends(get_db)):
    return db.query(PickupPoint).filter(PickupPoint.city == city, PickupPoint.is_active == True).all()

@router.post("", response_model=PickupPointResponse, status_code=status.HTTP_201_CREATED)
def create_pvz(
    pvz_in: PickupPointCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    new_pvz = PickupPoint(**pvz_in.dict())
    db.add(new_pvz)
    db.commit()
    db.refresh(new_pvz)
    return new_pvz

@router.delete("/{pvz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pvz(
    pvz_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    pvz = db.query(PickupPoint).filter(PickupPoint.id == pvz_id).first()
    if not pvz:
        raise HTTPException(status_code=404, detail="Pickup point not found")
    db.delete(pvz)
    db.commit()
    return None
