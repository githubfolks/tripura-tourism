from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class AccommodationBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: Optional[str] = None # ROOM, TENT, COTTAGE, DORMITORY
    base_price: Decimal
    base_occupancy: int = 2
    extra_boarder_price: Optional[Decimal] = 0
    max_occupancy: int = 3
    total_units: int = 1
    is_active: bool = True
    destination_id: UUID

class AccommodationCreate(AccommodationBase):
    pass

class AccommodationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    base_price: Optional[Decimal] = None
    base_occupancy: Optional[int] = None
    extra_boarder_price: Optional[Decimal] = None
    max_occupancy: Optional[int] = None
    total_units: Optional[int] = None
    is_active: Optional[bool] = None
    destination_id: Optional[UUID] = None

class Accommodation(AccommodationBase):
    id: UUID
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
