import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserRegister(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = "ShoppingBag"
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int
    price: float
    discount_price: Optional[float] = None
    installment_price: Optional[float] = None
    image_url: str
    images: Optional[str] = None
    stock: int = 50
    is_popular: bool = False
    is_featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    installment_price: Optional[float] = None
    image_url: Optional[str] = None
    images: Optional[str] = None
    stock: Optional[int] = None
    is_popular: Optional[bool] = None
    is_featured: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    rating: float
    reviews_count: int
    created_at: datetime.datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    title: str
    price: float
    quantity: int = 1
    image_url: Optional[str] = None

class OrderItemResponse(OrderItemCreate):
    id: int

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    shipping_address: str
    payment_method: str = "cash"
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    shipping_address: str
    payment_method: str
    status: str
    total_amount: float
    created_at: datetime.datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# News & Actions Schemas
class NewsBase(BaseModel):
    title: str
    summary: str
    content: str
    image_url: str
    tag: str = "Aksiya"
    badge_color: str = "purple"
    is_published: bool = True

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    tag: Optional[str] = None
    badge_color: Optional[str] = None
    is_published: Optional[bool] = None

class NewsResponse(NewsBase):
    id: int
    views_count: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Action Template Schemas
class ActionTemplateBase(BaseModel):
    title: str
    category_type: str
    default_tag: str
    badge_color: str
    description: str
    default_content: str
    image_url: str

class ActionTemplateCreate(ActionTemplateBase):
    pass

class ActionTemplateResponse(ActionTemplateBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Admin Stats
class AdminDashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    total_news: int
    recent_orders: List[OrderResponse]
    recent_news: List[NewsResponse]

# Security Logs Schema
class SecurityAuditLogResponse(BaseModel):
    id: int
    event_type: str
    username: Optional[str] = None
    ip_address: Optional[str] = None
    details: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    product_id: int
    rating: float = Field(..., ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: float
    title: Optional[str] = None
    comment: Optional[str] = None
    is_verified_purchase: bool
    helpful_count: int
    created_at: datetime.datetime
    username: Optional[str] = None

    class Config:
        from_attributes = True

class ReviewStats(BaseModel):
    average_rating: float
    total_reviews: int
    rating_distribution: dict  # {"5": 10, "4": 5, ...}

# Coupon Schemas
class CouponCreate(BaseModel):
    code: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = None
    discount_type: str = Field(..., pattern="^(percentage|fixed)$")
    discount_value: float = Field(..., gt=0)
    min_order_amount: float = 0
    max_discount_amount: Optional[float] = None
    usage_limit: int = 100
    is_active: bool = True
    expires_at: Optional[datetime.datetime] = None

class CouponResponse(BaseModel):
    id: int
    code: str
    description: Optional[str] = None
    discount_type: str
    discount_value: float
    min_order_amount: float
    max_discount_amount: Optional[float] = None
    usage_limit: int
    used_count: int
    is_active: bool
    expires_at: Optional[datetime.datetime] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CouponValidate(BaseModel):
    code: str
    order_total: float

class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: float = 0
    message: str
    coupon: Optional[CouponResponse] = None

# Wishlist Schemas
class WishlistItemCreate(BaseModel):
    product_id: int

class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    created_at: datetime.datetime
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True

# User Address Schemas
class UserAddressCreate(BaseModel):
    title: str
    full_name: str
    phone: str
    region: str
    district: str
    street_address: str
    postal_code: Optional[str] = None
    is_default: bool = False

class UserAddressUpdate(BaseModel):
    title: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    district: Optional[str] = None
    street_address: Optional[str] = None
    postal_code: Optional[str] = None
    is_default: Optional[bool] = None

class UserAddressResponse(UserAddressCreate):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Profile Schemas
class UserProfileUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None

class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

# Notification Schemas
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# FAQ Schemas
class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str = "Umumiy"
    sort_order: int = 0
    is_published: bool = True

class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: str
    sort_order: int
    is_published: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Banner Schemas
class BannerCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    badge_text: Optional[str] = None
    bg_color: str = "#7000ff"
    text_color: str = "#ffffff"
    sort_order: int = 0
    is_active: bool = True

class BannerResponse(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    badge_text: Optional[str] = None
    bg_color: str
    text_color: str
    sort_order: int
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class ProductAnalytics(BaseModel):
    product_id: int
    title: str
    total_views: int
    total_orders: int
    total_revenue: float
    average_rating: float
    conversion_rate: float

class SalesAnalytics(BaseModel):
    period: str
    total_orders: int
    total_revenue: float
    average_order_value: float
    top_products: List[ProductAnalytics]

class DashboardAnalytics(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    total_users: int
    total_reviews: int
    total_coupons_used: int
    average_order_value: float
    orders_by_status: dict
    orders_by_payment: dict
    top_selling_products: List[ProductAnalytics]
    recent_reviews: List[ReviewResponse]

# Pickup Point Schemas
class PickupPointBase(BaseModel):
    city: str
    district: str
    name: str
    address: str
    landmark: Optional[str] = None
    working_hours: str = "09:00 - 20:00"
    phone: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_active: bool = True

class PickupPointCreate(PickupPointBase):
    pass

class PickupPointResponse(PickupPointBase):
    id: int

    class Config:
        from_attributes = True

# Brand Schemas
class BrandBase(BaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    is_official: bool = False
    website: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int

    class Config:
        from_attributes = True

# Warranty Claim Schemas
class WarrantyClaimBase(BaseModel):
    order_id: int
    product_title: str
    reason: str
    description: str

class WarrantyClaimCreate(WarrantyClaimBase):
    pass

class WarrantyClaimResponse(WarrantyClaimBase):
    id: int
    user_id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Seller Application Schemas
class SellerApplicationBase(BaseModel):
    company_name: str
    tax_id: str
    phone: str
    category: str
    experience_years: int = 0

class SellerApplicationCreate(SellerApplicationBase):
    pass

class SellerApplicationResponse(SellerApplicationBase):
    id: int
    user_id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Support Message Schemas
class SupportMessageBase(BaseModel):
    message: str

class SupportMessageCreate(SupportMessageBase):
    pass

class SupportMessageResponse(SupportMessageBase):
    id: int
    user_id: int
    sender_name: str
    is_from_admin: bool
    is_bot_reply: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Flash Sale Schemas
class FlashSaleBase(BaseModel):
    product_id: int
    discount_percentage: int
    end_time: datetime.datetime
    total_quantity: int
    is_active: bool = True

class FlashSaleCreate(FlashSaleBase):
    pass

class FlashSaleResponse(FlashSaleBase):
    id: int
    sold_quantity: int

    class Config:
        from_attributes = True
