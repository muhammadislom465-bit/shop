import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Uzum Market Clone API")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "uzum-market-super-secret-jwt-key-2026-secure-token-generation")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./uzum_market.db")

    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin123")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin1234567890")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@uzum.uz")

    class Config:
        case_sensitive = True

settings = Settings()
