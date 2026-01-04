from sqlalchemy import Column, String, Text, Boolean, Integer, Table, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

# Association Tables
package_destinations = Table(
    'package_destinations',
    Base.metadata,
    Column('package_id', UUID(as_uuid=True), ForeignKey('packages.id', ondelete="CASCADE"), primary_key=True),
    Column('destination_id', UUID(as_uuid=True), ForeignKey('destinations.id', ondelete="CASCADE"), primary_key=True)
)

package_experiences = Table(
    'package_experiences',
    Base.metadata,
    Column('package_id', UUID(as_uuid=True), ForeignKey('packages.id', ondelete="CASCADE"), primary_key=True),
    Column('experience_id', UUID(as_uuid=True), ForeignKey('experiences.id', ondelete="CASCADE"), primary_key=True)
)

package_amenities = Table(
    'package_amenities',
    Base.metadata,
    Column('package_id', UUID(as_uuid=True), ForeignKey('packages.id', ondelete="CASCADE"), primary_key=True),
    Column('amenity_id', UUID(as_uuid=True), ForeignKey('amenities.id', ondelete="CASCADE"), primary_key=True)
)

class Package(Base):
    __tablename__ = "packages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    slug = Column(String(160), unique=True, nullable=False)
    description = Column(Text)
    duration_days = Column(Integer)
    duration_nights = Column(Integer)
    base_price = Column(Numeric(10,2)) # Simple pricing for now
    max_persons = Column(Integer)
    
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    destinations = relationship("Destination", secondary=package_destinations, backref="packages")
    experiences = relationship("Experience", secondary=package_experiences, backref="packages")
    amenities = relationship("Amenity", secondary=package_amenities, backref="packages")
