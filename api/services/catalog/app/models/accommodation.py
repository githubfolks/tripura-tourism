from sqlalchemy import Column, String, Text, Boolean, Integer, DECIMAL, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(150), nullable=False)
    description = Column(Text)
    type = Column(String(50)) # ROOM | TENT | COTTAGE | DORMITORY
    
    base_price = Column(Numeric(10,2), nullable=False)
    base_occupancy = Column(Integer, default=2)
    extra_boarder_price = Column(Numeric(10,2), default=0)
    max_occupancy = Column(Integer, default=3)
    total_units = Column(Integer, default=1)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to destination (make sure Destination model has this backref or adjust)
    # destination = relationship("Destination", back_populates="accommodations") # We need to update Destination model for this
