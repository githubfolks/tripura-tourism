from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class AmenityBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None

class AmenityCreate(AmenityBase):
    pass

class AmenityUpdate(BaseModel):
    description: Optional[str] = None
    icon_url: Optional[str] = None

class Amenity(AmenityBase):
    id: UUID

    class Config:
        from_attributes = True
