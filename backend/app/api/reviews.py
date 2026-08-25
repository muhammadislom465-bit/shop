from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db.session import get_db
from app.models.models import Review, Product, Order, OrderItem, User
from app.schemas.schemas import ReviewCreate, ReviewResponse, ReviewStats
from app.core.dependencies import get_current_user, get_current_admin_user, get_optional_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews & Ratings"])


@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(
    product_id: int,
    sort_by: Optional[str] = Query("newest", description="newest, highest, lowest, helpful"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Mahsulot uchun barcha sharhlarni olish"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    
    query = db.query(Review).filter(Review.product_id == product_id)
    
    if sort_by == "highest":
        query = query.order_by(Review.rating.desc())
    elif sort_by == "lowest":
        query = query.order_by(Review.rating.asc())
    elif sort_by == "helpful":
        query = query.order_by(Review.helpful_count.desc())
    else:
        query = query.order_by(Review.created_at.desc())
    
    reviews = query.offset(skip).limit(limit).all()
    
    # Attach username to each review
    result = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        review_dict = {
            "id": review.id,
            "product_id": review.product_id,
            "user_id": review.user_id,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "is_verified_purchase": review.is_verified_purchase,
            "helpful_count": review.helpful_count,
            "created_at": review.created_at,
            "username": user.username if user else "Noma'lum"
        }
        result.append(ReviewResponse(**review_dict))
    
    return result


@router.get("/product/{product_id}/stats", response_model=ReviewStats)
def get_product_review_stats(product_id: int, db: Session = Depends(get_db)):
    """Mahsulot uchun sharh statistikasi"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    total = len(reviews)
    
    if total == 0:
        return ReviewStats(
            average_rating=0.0,
            total_reviews=0,
            rating_distribution={"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
        )
    
    avg = sum(r.rating for r in reviews) / total
    distribution = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    for r in reviews:
        key = str(int(r.rating))
        if key in distribution:
            distribution[key] += 1
    
    return ReviewStats(
        average_rating=round(avg, 1),
        total_reviews=total,
        rating_distribution=distribution
    )


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Yangi sharh yozish"""
    # Check product exists
    product = db.query(Product).filter(Product.id == review_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    
    # Check if user already reviewed this product
    existing = db.query(Review).filter(
        Review.product_id == review_in.product_id,
        Review.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Siz ushbu mahsulotga allaqachon sharh yozgansiz."
        )
    
    # Check if this is a verified purchase
    is_verified = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.product_id == review_in.product_id,
        Order.status == "yetkazildi"
    ).first() is not None
    
    review = Review(
        product_id=review_in.product_id,
        user_id=current_user.id,
        rating=review_in.rating,
        title=review_in.title,
        comment=review_in.comment,
        is_verified_purchase=is_verified
    )
    db.add(review)
    
    # Update product average rating
    all_reviews = db.query(Review).filter(Review.product_id == review_in.product_id).all()
    total_rating = sum(r.rating for r in all_reviews) + review_in.rating
    product.rating = round(total_rating / (len(all_reviews) + 1), 1)
    product.reviews_count = len(all_reviews) + 1
    
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        product_id=review.product_id,
        user_id=review.user_id,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        is_verified_purchase=review.is_verified_purchase,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        username=current_user.username
    )


@router.post("/{review_id}/helpful")
def mark_review_helpful(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Sharhni foydali deb belgilash"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Sharh topilmadi.")
    
    review.helpful_count += 1
    db.commit()
    return {"message": "Sharh foydali deb belgilandi.", "helpful_count": review.helpful_count}


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """O'z sharhini o'chirish yoki admin tomonidan o'chirish"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Sharh topilmadi.")
    
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Faqat o'z sharhingizni o'chira olasiz.")
    
    # Update product rating
    product = db.query(Product).filter(Product.id == review.product_id).first()
    remaining_reviews = db.query(Review).filter(
        Review.product_id == review.product_id,
        Review.id != review_id
    ).all()
    
    if remaining_reviews:
        product.rating = round(sum(r.rating for r in remaining_reviews) / len(remaining_reviews), 1)
        product.reviews_count = len(remaining_reviews)
    else:
        product.rating = 0.0
        product.reviews_count = 0
    
    db.delete(review)
    db.commit()
    return {"message": "Sharh muvaffaqiyatli o'chirildi."}


@router.get("/my", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Foydalanuvchining o'z sharhlarini ko'rish"""
    reviews = db.query(Review).filter(Review.user_id == current_user.id).order_by(Review.created_at.desc()).all()
    result = []
    for review in reviews:
        result.append(ReviewResponse(
            id=review.id,
            product_id=review.product_id,
            user_id=review.user_id,
            rating=review.rating,
            title=review.title,
            comment=review.comment,
            is_verified_purchase=review.is_verified_purchase,
            helpful_count=review.helpful_count,
            created_at=review.created_at,
            username=current_user.username
        ))
    return result
