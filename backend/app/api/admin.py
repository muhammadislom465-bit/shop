from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.models import User, Product, Order, News, SecurityAuditLog
from app.schemas.schemas import AdminDashboardStats, OrderResponse, NewsResponse, SecurityAuditLogResponse, UserResponse
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminDashboardStats)
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_news = db.query(func.count(News.id)).scalar() or 0

    recent_orders_query = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_news_query = db.query(News).order_by(News.created_at.desc()).limit(5).all()

    return AdminDashboardStats(
        total_users=total_users,
        total_products=total_products,
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_news=total_news,
        recent_orders=[OrderResponse.model_validate(o) for o in recent_orders_query],
        recent_news=[NewsResponse.model_validate(n) for n in recent_news_query]
    )

@router.get("/security-logs", response_model=List[SecurityAuditLogResponse])
def get_security_audit_logs(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
    limit: int = 50
):
    return db.query(SecurityAuditLog).order_by(SecurityAuditLog.created_at.desc()).limit(limit).all()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    return db.query(User).order_by(User.created_at.desc()).all()
