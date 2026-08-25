from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.db.session import get_db
from app.models.models import (
    Product, Order, OrderItem, User, Review, Coupon, 
    ProductView, News, Category, SecurityAuditLog
)
from app.schemas.schemas import ProductAnalytics, DashboardAnalytics, ReviewResponse
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])


@router.get("/dashboard", response_model=DashboardAnalytics)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Keng qamrovli boshqaruv paneli tahlili"""
    total_revenue_val = db.query(func.sum(Order.total_amount)).filter(
        Order.status != "bekor_qilindi"
    ).scalar() or 0.0
    
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_reviews = db.query(func.count(Review.id)).scalar() or 0
    total_coupons_used = db.query(func.sum(Coupon.used_count)).scalar() or 0
    
    avg_order_value = 0.0
    if total_orders > 0:
        avg_order_value = float(total_revenue_val) / total_orders
    
    # Orders by status
    status_counts = db.query(
        Order.status, func.count(Order.id)
    ).group_by(Order.status).all()
    orders_by_status = {s: c for s, c in status_counts}
    
    # Orders by payment method
    payment_counts = db.query(
        Order.payment_method, func.count(Order.id)
    ).group_by(Order.payment_method).all()
    orders_by_payment = {p: c for p, c in payment_counts}
    
    # Top selling products by revenue
    top_products_query = db.query(
        OrderItem.product_id,
        Product.title,
        func.count(OrderItem.id).label("total_orders"),
        func.sum(OrderItem.price * OrderItem.quantity).label("total_revenue")
    ).join(Product, OrderItem.product_id == Product.id).group_by(
        OrderItem.product_id, Product.title
    ).order_by(desc("total_revenue")).limit(10).all()
    
    top_products = []
    for tp in top_products_query:
        product = db.query(Product).filter(Product.id == tp.product_id).first()
        views_count = db.query(func.count(ProductView.id)).filter(
            ProductView.product_id == tp.product_id
        ).scalar() or 0
        
        conversion = 0.0
        if views_count > 0:
            conversion = round((tp.total_orders / views_count) * 100, 1)
        
        top_products.append(ProductAnalytics(
            product_id=tp.product_id,
            title=tp.title,
            total_views=views_count,
            total_orders=tp.total_orders,
            total_revenue=float(tp.total_revenue or 0),
            average_rating=product.rating if product else 0.0,
            conversion_rate=conversion
        ))
    
    # Recent reviews
    recent_reviews_query = db.query(Review).order_by(Review.created_at.desc()).limit(5).all()
    recent_reviews = []
    for r in recent_reviews_query:
        user = db.query(User).filter(User.id == r.user_id).first()
        recent_reviews.append(ReviewResponse(
            id=r.id,
            product_id=r.product_id,
            user_id=r.user_id,
            rating=r.rating,
            title=r.title,
            comment=r.comment,
            is_verified_purchase=r.is_verified_purchase,
            helpful_count=r.helpful_count,
            created_at=r.created_at,
            username=user.username if user else "Noma'lum"
        ))
    
    return DashboardAnalytics(
        total_revenue=float(total_revenue_val),
        total_orders=total_orders,
        total_products=total_products,
        total_users=total_users,
        total_reviews=total_reviews,
        total_coupons_used=int(total_coupons_used),
        average_order_value=round(avg_order_value, 0),
        orders_by_status=orders_by_status,
        orders_by_payment=orders_by_payment,
        top_selling_products=top_products,
        recent_reviews=recent_reviews
    )


@router.get("/products/top-viewed")
def get_top_viewed_products(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Eng ko'p ko'rilgan mahsulotlar"""
    results = db.query(
        ProductView.product_id,
        func.count(ProductView.id).label("views"),
        Product.title
    ).join(Product, ProductView.product_id == Product.id).group_by(
        ProductView.product_id, Product.title
    ).order_by(desc("views")).limit(limit).all()
    
    return [{"product_id": r.product_id, "title": r.title, "views": r.views} for r in results]


@router.get("/products/low-stock")
def get_low_stock_products(
    threshold: int = Query(10, description="Minimal ombor chegarasi"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Omborda kam qolgan mahsulotlar"""
    products = db.query(Product).filter(
        Product.stock <= threshold
    ).order_by(Product.stock.asc()).all()
    
    return [
        {
            "id": p.id,
            "title": p.title,
            "stock": p.stock,
            "price": p.price,
            "category_id": p.category_id
        }
        for p in products
    ]


@router.get("/categories/revenue")
def get_category_revenue(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Kategoriya bo'yicha daromad tahlili"""
    results = db.query(
        Category.name,
        func.count(OrderItem.id).label("total_sales"),
        func.sum(OrderItem.price * OrderItem.quantity).label("revenue")
    ).join(
        Product, Product.category_id == Category.id
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).group_by(Category.name).order_by(desc("revenue")).all()
    
    return [
        {
            "category": r.name,
            "total_sales": r.total_sales,
            "revenue": float(r.revenue or 0)
        }
        for r in results
    ]


@router.get("/users/stats")
def get_user_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Foydalanuvchilar tahlili"""
    total_users = db.query(func.count(User.id)).scalar() or 0
    admin_users = db.query(func.count(User.id)).filter(User.is_admin == True).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
    
    # Users with orders
    users_with_orders = db.query(func.count(func.distinct(Order.user_id))).scalar() or 0
    
    # Users with reviews
    users_with_reviews = db.query(func.count(func.distinct(Review.user_id))).scalar() or 0
    
    # Top customers by spending
    top_customers = db.query(
        User.username,
        User.email,
        func.count(Order.id).label("order_count"),
        func.sum(Order.total_amount).label("total_spent")
    ).join(Order, Order.user_id == User.id).filter(
        Order.status != "bekor_qilindi"
    ).group_by(User.username, User.email).order_by(
        desc("total_spent")
    ).limit(10).all()
    
    return {
        "total_users": total_users,
        "admin_users": admin_users,
        "active_users": active_users,
        "users_with_orders": users_with_orders,
        "users_with_reviews": users_with_reviews,
        "top_customers": [
            {
                "username": c.username,
                "email": c.email,
                "order_count": c.order_count,
                "total_spent": float(c.total_spent or 0)
            }
            for c in top_customers
        ]
    }


@router.get("/security/summary")
def get_security_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Xavfsizlik jami statistikasi"""
    total_events = db.query(func.count(SecurityAuditLog.id)).scalar() or 0
    
    events_by_type = db.query(
        SecurityAuditLog.event_type,
        func.count(SecurityAuditLog.id).label("count")
    ).group_by(SecurityAuditLog.event_type).all()
    
    events_by_status = db.query(
        SecurityAuditLog.status,
        func.count(SecurityAuditLog.id).label("count")
    ).group_by(SecurityAuditLog.status).all()
    
    failed_logins = db.query(func.count(SecurityAuditLog.id)).filter(
        SecurityAuditLog.event_type == "LOGIN_FAILED"
    ).scalar() or 0
    
    return {
        "total_events": total_events,
        "failed_logins": failed_logins,
        "events_by_type": {e.event_type: e.count for e in events_by_type},
        "events_by_status": {e.status: e.count for e in events_by_status}
    }
