"""Environment-driven settings. Never commit real secrets."""

import os
from pathlib import Path
from functools import lru_cache
from dotenv import load_dotenv

# Load .env from the main project folder
ENV_FILE = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(ENV_FILE)


class Settings:
    app_env: str
    cors_origins: list[str]

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # AI configuration
    ai_provider: str
    ai_api_key: str
    ai_model: str
    groq_api_key: str
    huggingface_api_key: str
    ollama_base_url: str

    # Authentication
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    def __init__(self) -> None:
        origins = os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        )

        self.app_env = os.getenv(
            "APP_ENV", os.getenv("ENVIRONMENT", "development")
        )

        self.cors_origins = [
            origin.strip()
            for origin in origins.split(",")
            if origin.strip()
        ]

        # Supabase
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "")
        self.supabase_service_role_key = os.getenv(
            "SUPABASE_SERVICE_ROLE_KEY", ""
        )

        # AI providers
        self.ai_provider = os.getenv("AI_PROVIDER", "gemini")
        self.ai_api_key = os.getenv("AI_API_KEY", "")
        self.ai_model = os.getenv("AI_MODEL", "")
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")
        self.huggingface_api_key = os.getenv(
            "HUGGINGFACE_API_KEY", ""
        )
        self.ollama_base_url = os.getenv(
            "OLLAMA_BASE_URL", "http://localhost:11434"
        )

        # Authentication
        self.secret_key = os.getenv("SECRET_KEY", "")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()