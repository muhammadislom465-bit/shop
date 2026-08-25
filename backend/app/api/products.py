from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.models import Product, Category, User
from app.schemas.schemas import ProductResponse, ProductCreate, ProductUpdate
from app.core.dependencies import get_current_admin_user

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    popular: Optional[bool] = None,
    featured: Optional[bool] = None,
    sort_by: Optional[str] = Query(None, description="price_asc, price_desc, newest, rating"),
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    elif category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Product.title.ilike(search_fmt),
                Product.description.ilike(search_fmt)
            )
        )

    if popular is not None:
        query = query.filter(Product.is_popular == popular)

    if featured is not None:
        query = query.filter(Product.is_featured == featured)

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    return query.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    category = db.query(Category).filter(Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Ko'rsatilgan kategoriya mavjud emas.")

    product_data = product_in.model_dump()
    # Calculate default installment price if not provided (e.g. price / 12 * 1.1)
    if not product_data.get("installment_price"):
        base_price = product_data.get("discount_price") or product_data.get("price")
        product_data["installment_price"] = round((base_price / 12) * 1.1)

    product = Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    update_data = product_in.model_dump(exclude_unset=True)
    if "category_id" in update_data and update_data["category_id"] is not None:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Bunday kategoriya mavjud emas.")

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi.")

    db.delete(product)
    db.commit()
    return {"message": "Mahsulot muvaffaqiyatli o'chirildi."}
