from fastapi import APIRouter
from app.api.endpoints import destinations, accommodations, experiences, amenities, packages, media

api_router = APIRouter()
api_router.include_router(destinations.router, prefix="/destinations", tags=["destinations"])
api_router.include_router(accommodations.router, prefix="/accommodations", tags=["accommodations"])
api_router.include_router(experiences.router, prefix="/experiences", tags=["experiences"])
api_router.include_router(amenities.router, prefix="/amenities", tags=["amenities"])
api_router.include_router(packages.router, prefix="/packages", tags=["packages"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
