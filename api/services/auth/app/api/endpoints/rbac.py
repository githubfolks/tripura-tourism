from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.rbac import Role, Permission
from app.schemas.rbac import Role as RoleSchema, RoleCreate, RoleUpdate, Permission as PermissionSchema

router = APIRouter()

# --- Roles ---

@router.get("/roles/", response_model=List[RoleSchema])
def read_roles(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return db.query(Role).offset(skip).limit(limit).all()

@router.post("/roles/", response_model=RoleSchema)
def create_role(
    *,
    db: Session = Depends(deps.get_db),
    role_in: RoleCreate,
    current_user: Any = Depends(deps.get_current_active_superuser),
) -> Any:
    role = db.query(Role).filter(Role.name == role_in.name).first()
    if role:
        raise HTTPException(
            status_code=400,
            detail="Role with this name already exists",
        )
    
    db_role = Role(name=role_in.name, description=role_in.description)
    
    if role_in.permission_ids:
        permissions = db.query(Permission).filter(Permission.id.in_(role_in.permission_ids)).all()
        db_role.permissions = permissions
        
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/permissions/", response_model=List[PermissionSchema])
def read_permissions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(deps.get_current_active_superuser),
) -> Any:
    return db.query(Permission).offset(skip).limit(limit).all()
