from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Category, User
from app.schemas.schemas import CategoryResponse, CategoryCreate
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    existing = db.query(Category).filter(
        (Category.name == category_in.name) | (Category.slug == category_in.slug)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu nomdagi kategoriya mavjud.")

    cat = Category(**category_in.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat
