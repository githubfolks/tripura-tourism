from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ExperienceBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    experience_type: Optional[str] = None
    duration_hours: Optional[int] = None
    difficulty_level: Optional[str] = None
    is_active: bool = True

class ExperienceCreate(ExperienceBase):
    destination_ids: Optional[List[UUID]] = []

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    experience_type: Optional[str] = None
    duration_hours: Optional[int] = None
    difficulty_level: Optional[str] = None
    is_active: Optional[bool] = None
    destination_ids: Optional[List[UUID]] = None

class Experience(ExperienceBase):
    id: UUID
    created_at: Optional[datetime] = None
    
    # We can include destination summaries if needed, but keeping it simple for now
    
    class Config:
        from_attributes = True
