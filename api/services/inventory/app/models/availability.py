from sqlalchemy import Column, Integer, Date, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

class AccommodationAvailability(Base):
    __tablename__ = "accommodation_availability"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    accommodation_id = Column(UUID(as_uuid=True), nullable=False) # FK to Catalog Service (logical link)
    date = Column(Date, nullable=False)
    available_units = Column(Integer, default=0)
    total_units = Column(Integer, default=0) # Snapshot of total capacity for that day
    price_override = Column(Integer, nullable=True) # Optional daily price override
    is_blocked = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Ensure unique availability record per accommodation per date
    __table_args__ = (
        UniqueConstraint('accommodation_id', 'date', name='uq_accommodation_date'),
    )
