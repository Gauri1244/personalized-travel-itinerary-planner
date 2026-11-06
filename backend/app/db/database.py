"""Database connection and initialization."""

import logging

from supabase import create_client, Client
from app.config.settings import get_settings

logger = logging.getLogger(__name__)


class Database:
    """Supabase database client wrapper."""

    def __init__(self):
        settings = get_settings()

        if not settings.supabase_url or not settings.supabase_anon_key:
            raise ValueError("Supabase URL and anon key are required.")

        if not settings.supabase_service_role_key:
            raise ValueError("Supabase service-role key is missing from .env")

        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_anon_key,
        )

        self.service_client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )

    def get_client(self) -> Client:
        return self.client

    def get_service_client(self) -> Client:
        return self.service_client


database = Database()