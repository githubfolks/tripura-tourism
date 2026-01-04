from fastapi import FastAPI
from app.core.config import settings
from app.api.api import api_router
from app.db.session import engine, Base
from app.models import availability

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Real-time Inventory & Availability Management for Tripura Tourism.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Tripura Tourism Inventory Service"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
