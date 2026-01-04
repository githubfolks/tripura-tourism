from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class AvailabilityBase(BaseModel):
    accommodation_id: UUID
    date: date
    available_units: int
    total_units: int
    price_override: Optional[int] = None
    is_blocked: bool = False

class AvailabilityCreate(AvailabilityBase):
    pass

class AvailabilityUpdate(BaseModel):
    available_units: Optional[int] = None
    total_units: Optional[int] = None
    price_override: Optional[int] = None
    is_blocked: Optional[bool] = None

class Availability(AvailabilityBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
