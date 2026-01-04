from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.accommodation import Accommodation
from app.schemas.accommodation import Accommodation as AccommodationSchema, AccommodationCreate, AccommodationUpdate

router = APIRouter()

@router.get("/", response_model=List[AccommodationSchema])
def read_accommodations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    destination_id: Optional[UUID] = None
) -> Any:
    """
    Retrieve accommodations.
    """
    query = db.query(Accommodation)
    
    if destination_id:
        query = query.filter(Accommodation.destination_id == destination_id)
        
    accommodations = query.offset(skip).limit(limit).all()
    return accommodations

@router.post("/", response_model=AccommodationSchema)
def create_accommodation(
    *,
    db: Session = Depends(deps.get_db),
    accommodation_in: AccommodationCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Create new accommodation.
    """
    db_obj = Accommodation(**accommodation_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{accommodation_id}", response_model=AccommodationSchema)
def read_accommodation(
    *,
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID,
) -> Any:
    """
    Get accommodation by ID.
    """
    accommodation = db.query(Accommodation).filter(Accommodation.id == accommodation_id).first()
    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found",
        )
    return accommodation

@router.put("/{accommodation_id}", response_model=AccommodationSchema)
def update_accommodation(
    *,
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID,
    accommodation_in: AccommodationUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Update an accommodation.
    """
    accommodation = db.query(Accommodation).filter(Accommodation.id == accommodation_id).first()
    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found",
        )
    
    update_data = accommodation_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(accommodation, field, value)
    
    db.add(accommodation)
    db.commit()
    db.refresh(accommodation)
    return accommodation

@router.delete("/{accommodation_id}", response_model=AccommodationSchema)
def delete_accommodation(
    *,
    db: Session = Depends(deps.get_db),
    accommodation_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Delete an accommodation.
    """
    accommodation = db.query(Accommodation).filter(Accommodation.id == accommodation_id).first()
    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found",
        )
    
    db.delete(accommodation)
    db.commit()
    return accommodation
