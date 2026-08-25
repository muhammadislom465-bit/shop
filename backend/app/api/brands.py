from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Brand, User
from app.schemas.schemas import BrandCreate, BrandResponse
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.get("", response_model=List[BrandResponse])
def get_all_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()

@router.get("/{slug}", response_model=BrandResponse)
def get_brand_by_slug(slug: str, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.slug == slug).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(
    brand_in: BrandCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    existing = db.query(Brand).filter((Brand.name == brand_in.name) | (Brand.slug == brand_in.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Brand with this name or slug already exists")
    
    new_brand = Brand(**brand_in.dict())
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)
    return new_brand
