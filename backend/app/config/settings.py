"""Environment-driven settings. Never commit real secrets."""

import os
from functools import lru_cache


class Settings:
    app_env: str
    cors_origins: list[str]
    supabase_url: str
    supabase_anon_key: str
    ai_api_key: str
    ai_model: str

    def __init__(self) -> None:
        origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
        self.app_env = os.getenv("APP_ENV", "development")
        self.cors_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "")
        self.ai_api_key = os.getenv("AI_API_KEY", "")
        self.ai_model = os.getenv("AI_MODEL", "")


@lru_cache
def get_settings() -> Settings:
    return Settings()
