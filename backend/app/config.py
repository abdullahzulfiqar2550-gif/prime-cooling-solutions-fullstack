from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str = "https://mxjloqtyssutjrlcelyr.supabase.co"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Direct PostgreSQL (Supabase connection string)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/pcs_db"

    # Security
    SECRET_KEY: str = "supersecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    # SMTP (Optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_FROM_NAME: Optional[str] = None

    # Initial Admin
    ADMIN_EMAIL: str = "primecoolingsolutions.pk@gmail.com"
    ADMIN_PASSWORD: str = "4710Abdullah4710"
    ADMIN_NAME: str = "Zubair Akeel"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    @property
    def database_url(self) -> str:
        """Return the DATABASE_URL directly (Supabase PostgreSQL connection string)."""
        return self.DATABASE_URL

settings = Settings()
