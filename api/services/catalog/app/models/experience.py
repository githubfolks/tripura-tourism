from sqlalchemy import Column, String, Text, Boolean, Integer, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

experience_destinations = Table(
    'experience_destinations',
    Base.metadata,
    Column('experience_id', UUID(as_uuid=True), ForeignKey('experiences.id', ondelete="CASCADE"), primary_key=True),
    Column('destination_id', UUID(as_uuid=True), ForeignKey('destinations.id', ondelete="CASCADE"), primary_key=True)
)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(150), nullable=False)
    slug = Column(String(160), unique=True, nullable=False)
    description = Column(Text)
    experience_type = Column(String(50)) # Adventure, Culture, Nature, Spiritual
    duration_hours = Column(Integer)
    difficulty_level = Column(String(50)) # Easy, Moderate, Hard
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    destinations = relationship("Destination", secondary=experience_destinations, backref="experiences")
