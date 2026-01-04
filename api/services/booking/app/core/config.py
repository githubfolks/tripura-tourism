from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Tripura Tourism Booking Service"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "your-secret-key-CHANGE-ME-IN-PROD"
    ALGORITHM: str = "HS256"
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "admin"
    POSTGRES_PASSWORD: str = "password123"
    POSTGRES_DB: str = "tripura_tourism_db"
    POSTGRES_PORT: str = "5432"
    POSTGRES_SCHEMA: str = "tripura_tourism"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}?options=-csearch_path%3D{self.POSTGRES_SCHEMA}"

    class Config:
        env_file = ".env"

settings = Settings()
