import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), default="ShoppingBag")
    image_url = Column(String(255), nullable=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    installment_price = Column(Float, nullable=True)  # Oyiga to'lov miqdori
    image_url = Column(String(500), nullable=False)
    images = Column(Text, nullable=True)  # JSON array string or comma separated
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=0)
    stock = Column(Integer, default=50)
    is_popular = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=False)
    shipping_address = Column(String(255), nullable=False)
    payment_method = Column(String(50), default="cash") # "cash", "card", "installment"
    status = Column(String(50), default="kutilmoqda") # "kutilmoqda", "yetkazilmoqda", "yetkazildi", "bekor_qilindi"
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    image_url = Column(String(500), nullable=True)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=False)
    tag = Column(String(50), default="Aksiya")  # "Aksiya", "Chegirma", "Muhim", "Tadbir"
    badge_color = Column(String(30), default="purple") # "purple", "red", "green", "blue", "amber"
    is_published = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ActionTemplate(Base):
    __tablename__ = "action_templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category_type = Column(String(50), nullable=False) # "chegirma", "bayram", "elektronika", "mavsumiy", "haftalik"
    default_tag = Column(String(50), default="Chegirma")
    badge_color = Column(String(30), default="purple")
    description = Column(Text, nullable=False)
    default_content = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SecurityAuditLog(Base):
    __tablename__ = "security_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False) # "LOGIN_SUCCESS", "LOGIN_FAILED", "ADMIN_ACTION", "RATE_LIMIT"
    username = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(String(500), nullable=False)
    status = Column(String(20), default="INFO") # "INFO", "WARNING", "CRITICAL"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)  # 1-5
    title = Column(String(200), nullable=True)
    comment = Column(Text, nullable=True)
    is_verified_purchase = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product", backref="reviews_list")
    user = relationship("User", backref="reviews")

class Coupon(Base):
    __tablename__ = "coupons"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    discount_type = Column(String(20), nullable=False)  # "percentage" or "fixed"
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0)
    max_discount_amount = Column(Float, nullable=True)
    usage_limit = Column(Integer, default=100)
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", backref="wishlist")
    product = relationship("Product", backref="wishlisted_by")

class UserAddress(Base):
    __tablename__ = "user_addresses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)  # "Uy", "Ofis", etc.
    full_name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    region = Column(String(100), nullable=False)  # Viloyat
    district = Column(String(100), nullable=False)  # Tuman
    street_address = Column(String(255), nullable=False)
    postal_code = Column(String(20), nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", backref="addresses")

class ProductView(Base):
    __tablename__ = "product_views"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(50), nullable=True)
    viewed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product", backref="views")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info")  # "info", "order", "promo", "system"
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", backref="notifications")

class FAQ(Base):
    __tablename__ = "faqs"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), default="Umumiy")  # "Umumiy", "Yetkazib berish", "To'lov", "Qaytarish"
    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Banner(Base):
    __tablename__ = "banners"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=False)
    link_url = Column(String(500), nullable=True)
    badge_text = Column(String(50), nullable=True)
    bg_color = Column(String(30), default="#7000ff")
    text_color = Column(String(30), default="#ffffff")
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PickupPoint(Base):
    __tablename__ = "pickup_points"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    name = Column(String(200), nullable=False)
    address = Column(String(255), nullable=False)
    landmark = Column(String(255), nullable=True)
    working_hours = Column(String(100), default="09:00 - 20:00")
    phone = Column(String(30), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    logo_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    is_official = Column(Boolean, default=False)
    website = Column(String(255), nullable=True)

class WarrantyClaim(Base):
    __tablename__ = "warranty_claims"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_title = Column(String(255), nullable=False)
    reason = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="kutilmoqda")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SellerApplication(Base):
    __tablename__ = "seller_applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(200), nullable=False)
    tax_id = Column(String(50), nullable=False)
    phone = Column(String(30), nullable=False)
    category = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=0)
    status = Column(String(50), default="kutilmoqda")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SupportMessage(Base):
    __tablename__ = "support_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_name = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    is_from_admin = Column(Boolean, default=False)
    is_bot_reply = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FlashSale(Base):
    __tablename__ = "flash_sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    discount_percentage = Column(Integer, nullable=False)
    end_time = Column(DateTime, nullable=False)
    total_quantity = Column(Integer, nullable=False)
    sold_quantity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
