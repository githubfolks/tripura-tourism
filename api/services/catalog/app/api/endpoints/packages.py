from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.package import Package
from app.models.destination import Destination
from app.models.experience import Experience
from app.models.amenity import Amenity
from app.schemas.package import Package as PackageSchema, PackageCreate, PackageUpdate

router = APIRouter()

@router.get("/", response_model=List[PackageSchema])
def read_packages(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_featured: bool = None
) -> Any:
    query = db.query(Package)
    if is_featured is not None:
        query = query.filter(Package.is_featured == is_featured)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=PackageSchema)
def create_package(
    *,
    db: Session = Depends(deps.get_db),
    package_in: PackageCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    package = db.query(Package).filter(Package.slug == package_in.slug).first()
    if package:
        raise HTTPException(status_code=400, detail="Package with this slug already exists")
    
    db_package = Package(
        name=package_in.name,
        slug=package_in.slug,
        description=package_in.description,
        duration_days=package_in.duration_days,
        duration_nights=package_in.duration_nights,
        base_price=package_in.base_price,
        max_persons=package_in.max_persons,
        is_active=package_in.is_active,
        is_featured=package_in.is_featured
    )
    
    if package_in.destination_ids:
        db_package.destinations = db.query(Destination).filter(Destination.id.in_(package_in.destination_ids)).all()
        
    if package_in.experience_ids:
        db_package.experiences = db.query(Experience).filter(Experience.id.in_(package_in.experience_ids)).all()
        
    if package_in.amenity_ids:
        db_package.amenities = db.query(Amenity).filter(Amenity.id.in_(package_in.amenity_ids)).all()
        
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

@router.get("/{package_id}", response_model=PackageSchema)
def read_package(
    *,
    db: Session = Depends(deps.get_db),
    package_id: UUID,
) -> Any:
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

@router.put("/{package_id}", response_model=PackageSchema)
def update_package(
    *,
    db: Session = Depends(deps.get_db),
    package_id: UUID,
    package_in: PackageUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
        
    update_data = package_in.model_dump(exclude_unset=True)
    
    if "destination_ids" in update_data:
        ids = update_data.pop("destination_ids")
        if ids is not None:
             package.destinations = db.query(Destination).filter(Destination.id.in_(ids)).all()

    if "experience_ids" in update_data:
        ids = update_data.pop("experience_ids")
        if ids is not None:
             package.experiences = db.query(Experience).filter(Experience.id.in_(ids)).all()
             
    if "amenity_ids" in update_data:
        ids = update_data.pop("amenity_ids")
        if ids is not None:
             package.amenities = db.query(Amenity).filter(Amenity.id.in_(ids)).all()
    
    for field, value in update_data.items():
        setattr(package, field, value)
        
    db.add(package)
    db.commit()
    db.refresh(package)
    return package

@router.delete("/{package_id}", response_model=PackageSchema)
def delete_package(
    *,
    db: Session = Depends(deps.get_db),
    package_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    db.delete(package)
    db.commit()
    return package
