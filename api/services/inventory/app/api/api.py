from fastapi import APIRouter
from app.api.endpoints import availability

api_router = APIRouter()
api_router.include_router(availability.router, prefix="/availability", tags=["availability"])
