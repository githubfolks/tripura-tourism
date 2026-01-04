from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class PackageBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    base_price: Optional[Decimal] = None
    max_persons: Optional[int] = None
    is_active: bool = True
    is_featured: bool = False

class PackageCreate(PackageBase):
    destination_ids: Optional[List[UUID]] = []
    experience_ids: Optional[List[UUID]] = []
    amenity_ids: Optional[List[UUID]] = []

class PackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    base_price: Optional[Decimal] = None
    max_persons: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    destination_ids: Optional[List[UUID]] = None
    experience_ids: Optional[List[UUID]] = None
    amenity_ids: Optional[List[UUID]] = None

class Package(PackageBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
