from sqlalchemy import Column, String, Text, Boolean, Integer, DECIMAL, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from app.db.session import Base

class BookingStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_PAYMENT = "PENDING_PAYMENT"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True) # Could be guest
    booking_reference = Column(String(50), unique=True, nullable=False) # Human readable ID
    
    status = Column(String(50), default=BookingStatus.DRAFT)
    total_amount = Column(DECIMAL(10,2), default=0)
    tax_amount = Column(DECIMAL(10,2), default=0)
    discount_amount = Column(DECIMAL(10,2), default=0)
    final_amount = Column(DECIMAL(10,2), default=0)
    
    special_requests = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    items = relationship("BookingItem", back_populates="booking", cascade="all, delete-orphan")
    customer = relationship("BookingCustomer", back_populates="booking", uselist=False, cascade="all, delete-orphan")

class BookingItem(Base):
    __tablename__ = "booking_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    
    # Store snapshot of catalog data to handle price changes
    service_type = Column(String(50)) # PACKAGE, ACCOMMODATION, EXPERIENCE
    service_id = Column(UUID(as_uuid=True), nullable=False)
    service_name = Column(String(200)) # Snapshot name
    
    unit_price = Column(DECIMAL(10,2), nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(DECIMAL(10,2), nullable=False)
    
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    
    metadata_snapshot = Column(JSON) # Store extra details like room type, package inclusions snapshot

    booking = relationship("Booking", back_populates="items")

class BookingCustomer(Base):
    __tablename__ = "booking_customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    
    full_name = Column(String(150), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text)
    id_card_type = Column(String(50))
    id_card_number = Column(String(50))

    booking = relationship("Booking", back_populates="customer")
