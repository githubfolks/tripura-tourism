from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.experience import Experience
from app.models.destination import Destination
from app.schemas.experience import Experience as ExperienceSchema, ExperienceCreate, ExperienceUpdate

router = APIRouter()

@router.get("/", response_model=List[ExperienceSchema])
def read_experiences(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return db.query(Experience).offset(skip).limit(limit).all()

@router.post("/", response_model=ExperienceSchema)
def create_experience(
    *,
    db: Session = Depends(deps.get_db),
    experience_in: ExperienceCreate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    experience = db.query(Experience).filter(Experience.slug == experience_in.slug).first()
    if experience:
        raise HTTPException(status_code=400, detail="Experience with this slug already exists")
    
    db_experience = Experience(
        title=experience_in.title,
        slug=experience_in.slug,
        description=experience_in.description,
        experience_type=experience_in.experience_type,
        duration_hours=experience_in.duration_hours,
        difficulty_level=experience_in.difficulty_level,
        is_active=experience_in.is_active
    )
    
    if experience_in.destination_ids:
        destinations = db.query(Destination).filter(Destination.id.in_(experience_in.destination_ids)).all()
        db_experience.destinations = destinations
        
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@router.get("/{experience_id}", response_model=ExperienceSchema)
def read_experience(
    *,
    db: Session = Depends(deps.get_db),
    experience_id: UUID,
) -> Any:
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience

@router.put("/{experience_id}", response_model=ExperienceSchema)
def update_experience(
    *,
    db: Session = Depends(deps.get_db),
    experience_id: UUID,
    experience_in: ExperienceUpdate,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
        
    update_data = experience_in.model_dump(exclude_unset=True)
    
    if "destination_ids" in update_data:
        dest_ids = update_data.pop("destination_ids")
        if dest_ids is not None:
             destinations = db.query(Destination).filter(Destination.id.in_(dest_ids)).all()
             experience.destinations = destinations
    
    for field, value in update_data.items():
        setattr(experience, field, value)
        
    db.add(experience)
    db.commit()
    db.refresh(experience)
    return experience

@router.delete("/{experience_id}", response_model=ExperienceSchema)
def delete_experience(
    *,
    db: Session = Depends(deps.get_db),
    experience_id: UUID,
    current_user_id: str = Depends(deps.get_current_user_id),
) -> Any:
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(experience)
    db.commit()
    return experience
