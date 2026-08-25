from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import News, ActionTemplate, User
from app.schemas.schemas import (
    NewsResponse, NewsCreate, NewsUpdate,
    ActionTemplateResponse, ActionTemplateCreate
)
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/news", tags=["News & Action Templates"])

# --- NEWS ENDPOINTS ---

@router.get("", response_model=List[NewsResponse])
def get_all_news(
    db: Session = Depends(get_db),
    tag: Optional[str] = None,
    only_published: bool = True
):
    query = db.query(News)
    if only_published:
        query = query.filter(News.is_published == True)
    if tag:
        query = query.filter(News.tag == tag)
    return query.order_by(News.created_at.desc()).all()

@router.get("/{news_id}", response_model=NewsResponse)
def get_single_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi.")
    news.views_count += 1
    db.commit()
    db.refresh(news)
    return news

@router.post("", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(
    news_in: NewsCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    news = News(**news_in.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news

@router.put("/{news_id}", response_model=NewsResponse)
def update_news(
    news_id: int,
    news_in: NewsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi.")

    update_data = news_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(news, field, value)

    db.commit()
    db.refresh(news)
    return news

@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Yangilik topilmadi.")

    db.delete(news)
    db.commit()
    return {"message": "Yangilik muvaffaqiyatli o'chirildi."}


# --- ACTION TEMPLATES (TAYYOR SHABLONLAR) ---

@router.get("/templates/list", response_model=List[ActionTemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    return db.query(ActionTemplate).order_by(ActionTemplate.id.asc()).all()

@router.post("/templates", response_model=ActionTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_in: ActionTemplateCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    template = ActionTemplate(**template_in.model_dump())
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.post("/apply-template/{template_id}", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def apply_template_to_news(
    template_id: int,
    custom_title: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    template = db.query(ActionTemplate).filter(ActionTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Shablon topilmadi.")

    news = News(
        title=custom_title if custom_title else template.title,
        summary=template.description,
        content=template.default_content,
        image_url=template.image_url,
        tag=template.default_tag,
        badge_color=template.badge_color,
        is_published=True
    )
    db.add(news)
    db.commit()
    db.refresh(news)
    return news
