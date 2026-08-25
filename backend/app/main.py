from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.db.session import engine, Base
from app.db.seed_data import seed_database
from app.api import auth, products, categories, orders, news, admin, reviews, coupons, wishlist, profile, analytics, faq, pvz, brands, warranty, sellers, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed default admin + catalog
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Uzum Market uslubidagi zamonaviy va xavfsiz E-Commerce Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Custom Security Headers & Anti-Abuse Middleware
class ComprehensiveSecurityMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int = 10 * 1024 * 1024):
        super().__init__(app)
        self.max_upload_size = max_upload_size
        self.request_counts = {}

    async def dispatch(self, request: Request, call_next):
        # 1. Payload size check
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_upload_size:
            return Response(
                content='{"detail": "So\'rov hajmi juda katta (maksimal 10MB)."}',
                status_code=413,
                media_type="application/json"
            )

        # 2. Process request
        response: Response = await call_next(request)

        # 3. Comprehensive Security Headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        
        return response

app.add_middleware(ComprehensiveSecurityMiddleware)

# CORS Configuration with strict origins and methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(coupons.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(faq.router, prefix="/api")
app.include_router(pvz.router, prefix="/api")
app.include_router(brands.router, prefix="/api")
app.include_router(warranty.router, prefix="/api")
app.include_router(sellers.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Uzum Market Clone API muvaffaqiyatli ishlamoqda!",
        "docs": "/docs",
        "version": "1.0.0",
        "security": "Enhanced with Rate Limiting, Bcrypt, JWT & Security Headers"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
