from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-default-secret-key-change-this-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Application settings
    APP_NAME: str = "Todo Application API"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    VERSION: str = "1.0.0"

    # CORS settings
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "*")

    # Neon-specific settings
    NEON_DATABASE_URL: Optional[str] = os.getenv("NEON_DATABASE_URL")

    class Config:
        env_file = ".env"


settings = Settings()