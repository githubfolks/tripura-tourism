from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# Image Schemas
class DestinationImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    sort_order: Optional[int] = 0

class DestinationImageCreate(DestinationImageBase):
    pass

class DestinationImage(DestinationImageBase):
    id: UUID
    destination_id: UUID

    class Config:
        from_attributes = True

# Destination Schemas
class DestinationBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    best_time_to_visit: Optional[str] = None
    how_to_reach: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True

class DestinationCreate(DestinationBase):
    images: Optional[List[DestinationImageCreate]] = []

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    best_time_to_visit: Optional[str] = None
    how_to_reach: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class Destination(DestinationBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    images: List[DestinationImage] = []

    class Config:
        from_attributes = True
