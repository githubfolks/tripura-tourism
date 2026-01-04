from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
import random
import string
from datetime import datetime

from app.api import deps
from app.models.booking import Booking, BookingItem, BookingCustomer, BookingStatus
from app.schemas.booking import Booking as BookingSchema, BookingCreate, BookingUpdate

router = APIRouter()

def generate_booking_reference():
    """Generates a random booking reference like 'TRIP-7X9Y2Z'"""
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TRIP-{suffix}"

@router.get("/", response_model=List[BookingSchema])
def read_bookings(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[BookingStatus] = None,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Retrieve bookings. 
    TODO: Filter by user_id if not admin.
    """
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=BookingSchema)
def create_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_in: BookingCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Create a new booking.
    Calculates total price from items.
    """
    reference = generate_booking_reference()
    while db.query(Booking).filter(Booking.booking_reference == reference).first():
        reference = generate_booking_reference()

    # Calculate Totals
    total_amount = 0
    for item in booking_in.items:
        # Here we should technically validate price against Catalog Service
        # For MVP we trust the input price or assume frontend fetched it securely
        # Ideally: item.unit_price * item.quantity
        item_total = item.unit_price * item.quantity
        total_amount += item_total
    
    # Simple Tax Logic (e.g. 10%)
    tax_amount = total_amount * 0
    final_amount = total_amount + tax_amount

    db_booking = Booking(
        user_id=booking_in.user_id,
        booking_reference=reference,
        status=BookingStatus.DRAFT,
        total_amount=total_amount,
        tax_amount=tax_amount,
        final_amount=final_amount,
        special_requests=booking_in.special_requests
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    # Create Customer
    db_customer = BookingCustomer(
        booking_id=db_booking.id,
        **booking_in.customer.model_dump()
    )
    db.add(db_customer)

    # Create Items
    for item_in in booking_in.items:
        db_item = BookingItem(
            booking_id=db_booking.id,
            service_type=item_in.service_type,
            service_id=item_in.service_id,
            service_name=item_in.service_name,
            unit_price=item_in.unit_price,
            quantity=item_in.quantity,
            total_price=item_in.unit_price * item_in.quantity,
            start_date=item_in.start_date,
            end_date=item_in.end_date,
            metadata_snapshot=item_in.metadata_snapshot
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/{booking_id}", response_model=BookingSchema)
def read_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{booking_id}", response_model=BookingSchema)
def update_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_id: UUID,
    booking_in: BookingUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Update booking status or details.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    update_data = booking_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(booking, field, value)
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{booking_id}", response_model=BookingSchema)
def delete_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(booking)
    db.commit()
    return booking
