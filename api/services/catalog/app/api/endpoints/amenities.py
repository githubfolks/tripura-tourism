from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.amenity import Amenity
from app.schemas.amenity import Amenity as AmenitySchema, AmenityCreate, AmenityUpdate

router = APIRouter()

@router.get("/", response_model=List[AmenitySchema])
def read_amenities(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return db.query(Amenity).offset(skip).limit(limit).all()

@router.post("/", response_model=AmenitySchema)
def create_amenity(
    *,
    db: Session = Depends(deps.get_db),
    amenity_in: AmenityCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    amenity = db.query(Amenity).filter(Amenity.name == amenity_in.name).first()
    if amenity:
        raise HTTPException(status_code=400, detail="Amenity with this name already exists")
    
    db_amenity = Amenity(**amenity_in.model_dump())
    db.add(db_amenity)
    db.commit()
    db.refresh(db_amenity)
    return db_amenity

@router.delete("/{amenity_id}", response_model=AmenitySchema)
def delete_amenity(
    *,
    db: Session = Depends(deps.get_db),
    amenity_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Amenity not found")
    
    db.delete(amenity)
    db.commit()
    return amenity
