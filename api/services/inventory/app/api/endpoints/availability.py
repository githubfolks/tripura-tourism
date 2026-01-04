from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from app.api import deps
from app.models.availability import AccommodationAvailability
from app.schemas.availability import Availability as AvailabilitySchema, AvailabilityCreate, AvailabilityUpdate

router = APIRouter()

@router.get("/", response_model=List[AvailabilitySchema])
def read_availability(
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID = Query(..., description="Accommodation ID to filter by"),
    start_date: date = Query(..., description="Start date"),
    end_date: date = Query(..., description="End date"),
) -> Any:
    """
    Retrieve availability for a date range.
    """
    return db.query(AccommodationAvailability).filter(
        AccommodationAvailability.accommodation_id == accommodation_id,
        AccommodationAvailability.date >= start_date,
        AccommodationAvailability.date <= end_date
    ).all()

@router.post("/", response_model=AvailabilitySchema)
def create_availability(
    *,
    db: Session = Depends(deps.get_db),
    availability_in: AvailabilityCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Create or update availability record (Upsert logic preferred usually, but simple create here).
    """
    existing = db.query(AccommodationAvailability).filter(
        AccommodationAvailability.accommodation_id == availability_in.accommodation_id,
        AccommodationAvailability.date == availability_in.date
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Availability record already exists for this date")
    
    db_obj = AccommodationAvailability(**availability_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{availability_id}", response_model=AvailabilitySchema)
def update_availability(
    *,
    db: Session = Depends(deps.get_db),
    availability_id: UUID,
    availability_in: AvailabilityUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Update availability.
    """
    availability = db.query(AccommodationAvailability).filter(AccommodationAvailability.id == availability_id).first()
    if not availability:
        raise HTTPException(status_code=404, detail="Received availability ID not found")
        
    update_data = availability_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(availability, field, value)
        
    db.add(availability)
    db.commit()
    db.refresh(availability)
    return availability

@router.get("/check", response_model=bool)
def check_availability(
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID = Query(..., description="Accommodation ID"),
    date: date = Query(..., description="Date to check"),
    units_required: int = Query(1, description="Number of units needed"),
) -> Any:
    """
    Check availability for a specific date and unit count.
    """
    availability = db.query(AccommodationAvailability).filter(
        AccommodationAvailability.accommodation_id == accommodation_id,
        AccommodationAvailability.date == date
    ).first()
    
    if not availability:
        return False # No record implies no availability or not initialized
    
    if availability.is_blocked:
        return False
        
    return availability.available_units >= units_required

@router.post("/reserve", response_model=AvailabilitySchema)
def reserve_inventory(
    *,
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID,
    date: date,
    units: int = 1,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Reserve (deduct) inventory. Returns updated availability.
    """
    availability = db.query(AccommodationAvailability).filter(
        AccommodationAvailability.accommodation_id == accommodation_id,
        AccommodationAvailability.date == date
    ).first()
    
    if not availability:
         raise HTTPException(status_code=404, detail="Availability record not found for this date")
         
    if availability.is_blocked:
        raise HTTPException(status_code=400, detail="Inventory is blocked")
        
    if availability.available_units < units:
        raise HTTPException(status_code=400, detail="Not enough units available")
        
    availability.available_units -= units
    db.add(availability)
    db.commit()
    db.refresh(availability)
    return availability

