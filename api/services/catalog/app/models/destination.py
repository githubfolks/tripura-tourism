from sqlalchemy import Column, String, Text, Boolean, Integer, DECIMAL, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    slug = Column(String(160), unique=True, nullable=False)
    description = Column(Text)
    cover_image_url = Column(Text)
    district = Column(String(100))
    latitude = Column(DECIMAL(9,6))
    longitude = Column(DECIMAL(9,6))
    best_time_to_visit = Column(String(100))
    how_to_reach = Column(Text)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    images = relationship("DestinationImage", back_populates="destination", cascade="all, delete-orphan")
    accommodations = relationship("Accommodation", backref="destination", cascade="all, delete-orphan")

class DestinationImage(Base):
    __tablename__ = "destination_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(Text, nullable=False)
    caption = Column(String(200))
    sort_order = Column(Integer, default=0)

    destination = relationship("Destination", back_populates="images")
