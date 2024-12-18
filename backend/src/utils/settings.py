from typing import Literal

from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv(override=True)


class Settings(BaseSettings):
    """.env configs and settings."""

    # Google Auth
    google_client_id: str
    google_client_secret: str
    google_secret_key: str


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Config:
        """Used by the BaseSettings superclass"""
        env_file = ".env"
        case_sensitive = False


SETTINGS = Settings()
