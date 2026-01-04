from fastapi import APIRouter
from app.api.endpoints import bookings

api_router = APIRouter()
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
