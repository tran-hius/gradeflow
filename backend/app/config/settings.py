from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "GradeFlow API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    MYSQL_HOST: str = "db"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "gradeflow_db"
    MYSQL_USER: str = "gradeflow_user"
    MYSQL_PASSWORD: str = ""
    MYSQL_ROOT_PASSWORD: str = ""

    DATABASE_URL: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

settings = Settings()

if not settings.DATABASE_URL:
    settings.DATABASE_URL = (
        f"mysql+asyncmy://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}"
        f"@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DATABASE}?charset=utf8mb4"
    )
