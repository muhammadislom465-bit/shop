from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import FAQ, Banner, User
from app.schemas.schemas import FAQCreate, FAQResponse, BannerCreate, BannerResponse
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/content", tags=["FAQ & Content Management"])


# --- FAQ ENDPOINTS ---

@router.get("/faq", response_model=List[FAQResponse])
def get_faqs(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Savollar va javoblar ro'yxati"""
    query = db.query(FAQ).filter(FAQ.is_published == True)
    if category:
        query = query.filter(FAQ.category == category)
    return query.order_by(FAQ.sort_order.asc(), FAQ.created_at.desc()).all()


@router.get("/faq/categories")
def get_faq_categories(db: Session = Depends(get_db)):
    """FAQ kategoriyalari ro'yxati"""
    categories = db.query(FAQ.category).distinct().all()
    return [c[0] for c in categories]


@router.post("/faq", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    faq_in: FAQCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Yangi FAQ qo'shish (admin)"""
    faq = FAQ(**faq_in.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


@router.put("/faq/{faq_id}", response_model=FAQResponse)
def update_faq(
    faq_id: int,
    faq_in: FAQCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """FAQ ni tahrirlash (admin)"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi.")
    
    for field, value in faq_in.model_dump().items():
        setattr(faq, field, value)
    
    db.commit()
    db.refresh(faq)
    return faq


@router.delete("/faq/{faq_id}")
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """FAQ ni o'chirish (admin)"""
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ topilmadi.")
    
    db.delete(faq)
    db.commit()
    return {"message": "FAQ muvaffaqiyatli o'chirildi."}


# --- BANNER ENDPOINTS ---

@router.get("/banners", response_model=List[BannerResponse])
def get_banners(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Banner ro'yxati"""
    query = db.query(Banner)
    if active_only:
        query = query.filter(Banner.is_active == True)
    return query.order_by(Banner.sort_order.asc()).all()


@router.post("/banners", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
def create_banner(
    banner_in: BannerCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Yangi banner qo'shish (admin)"""
    banner = Banner(**banner_in.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner


@router.put("/banners/{banner_id}", response_model=BannerResponse)
def update_banner(
    banner_id: int,
    banner_in: BannerCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Bannerni tahrirlash (admin)"""
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner topilmadi.")
    
    for field, value in banner_in.model_dump().items():
        setattr(banner, field, value)
    
    db.commit()
    db.refresh(banner)
    return banner


@router.delete("/banners/{banner_id}")
def delete_banner(
    banner_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Bannerni o'chirish (admin)"""
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner topilmadi.")
    
    db.delete(banner)
    db.commit()
    return {"message": "Banner muvaffaqiyatli o'chirildi."}
