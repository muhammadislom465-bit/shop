from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Order, OrderItem, Product, User
from app.schemas.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.core.dependencies import get_current_user, get_optional_current_user, get_current_admin_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Savat bo'sh, mahsulot mavjud emas.")

    total_amount = sum(item.price * item.quantity for item in order_in.items)

    order = Order(
        user_id=current_user.id if current_user else None,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        shipping_address=order_in.shipping_address,
        payment_method=order_in.payment_method,
        status="kutilmoqda",
        total_amount=total_amount
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Add items
    for item in order_in.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            title=item.title,
            price=item.price,
            quantity=item.quantity,
            image_url=item.image_url
        )
        db.add(order_item)

        # Decrease product stock if linked
        if item.product_id:
            prod = db.query(Product).filter(Product.id == item.product_id).first()
            if prod and prod.stock >= item.quantity:
                prod.stock -= item.quantity

    db.commit()
    db.refresh(order)
    return order

@router.get("/my", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi.")

    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order
