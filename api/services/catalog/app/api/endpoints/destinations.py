from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.destination import Destination, DestinationImage
from app.schemas.destination import Destination as DestinationSchema, DestinationCreate, DestinationUpdate

router = APIRouter()

@router.get("/", response_model=List[DestinationSchema])
def read_destinations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    is_featured: Optional[bool] = None
) -> Any:
    """
    Retrieve destinations.
    """
    query = db.query(Destination)
    
    if is_featured is not None:
        query = query.filter(Destination.is_featured == is_featured)
        
    if search:
        query = query.filter(Destination.name.ilike(f"%{search}%"))
        
    destinations = query.offset(skip).limit(limit).all()
    return destinations

@router.post("/", response_model=DestinationSchema)
def create_destination(
    *,
    db: Session = Depends(deps.get_db),
    destination_in: DestinationCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Create new destination.
    """
    destination = db.query(Destination).filter(Destination.slug == destination_in.slug).first()
    if destination:
        raise HTTPException(
            status_code=400,
            detail="Destination with this slug already exists",
        )
    
    # Create Destination
    db_destination = Destination(
        name=destination_in.name,
        slug=destination_in.slug,
        description=destination_in.description,
        cover_image_url=destination_in.cover_image_url,
        district=destination_in.district,
        latitude=destination_in.latitude,
        longitude=destination_in.longitude,
        best_time_to_visit=destination_in.best_time_to_visit,
        how_to_reach=destination_in.how_to_reach,
        is_featured=destination_in.is_featured,
        is_active=destination_in.is_active
    )
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    
    # Handle Images
    if destination_in.images:
        for img_in in destination_in.images:
            db_img = DestinationImage(
                destination_id=db_destination.id,
                image_url=img_in.image_url,
                caption=img_in.caption,
                sort_order=img_in.sort_order
            )
            db.add(db_img)
        db.commit()
        db.refresh(db_destination)
        
    return db_destination

@router.get("/{slug}", response_model=DestinationSchema)
def read_destination(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get destination by slug.
    """
    destination = db.query(Destination).filter(Destination.slug == slug).first()
    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )
    return destination

@router.put("/{destination_id}", response_model=DestinationSchema)
def update_destination(
    *,
    db: Session = Depends(deps.get_db),
    destination_id: UUID,
    destination_in: DestinationUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Update a destination.
    """
    destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )
    
    update_data = destination_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(destination, field, value)
    
    db.add(destination)
    db.commit()
    db.refresh(destination)
    return destination

@router.delete("/{destination_id}", response_model=DestinationSchema)
def delete_destination(
    *,
    db: Session = Depends(deps.get_db),
    destination_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    """
    Delete a destination.
    """
    destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )
    
    db.delete(destination)
    db.commit()
    return destination
