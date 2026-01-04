from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models.booking import BookingStatus

# --- Customer ---
class BookingCustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    id_card_type: Optional[str] = None
    id_card_number: Optional[str] = None

class BookingCustomerCreate(BookingCustomerBase):
    pass

class BookingCustomer(BookingCustomerBase):
    id: UUID
    booking_id: UUID

    class Config:
        from_attributes = True

# --- Item ---
class BookingItemBase(BaseModel):
    service_type: str
    service_id: UUID
    service_name: str
    unit_price: Decimal
    quantity: int = 1
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    metadata_snapshot: Optional[Dict[str, Any]] = None

class BookingItemCreate(BookingItemBase):
    pass

class BookingItem(BookingItemBase):
    id: UUID
    booking_id: UUID
    total_price: Decimal

    class Config:
        from_attributes = True

# --- Booking ---
class BookingBase(BaseModel):
    user_id: Optional[UUID] = None
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    items: List[BookingItemCreate]
    customer: BookingCustomerCreate

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    special_requests: Optional[str] = None

class Booking(BookingBase):
    id: UUID
    booking_reference: str
    status: BookingStatus
    total_amount: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    final_amount: Decimal
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    items: List[BookingItem] = []
    customer: Optional[BookingCustomer] = None

    class Config:
        from_attributes = True
