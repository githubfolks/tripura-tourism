from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.core import security
from app.models.user import User, UserCredentials
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate, PasswordResetRequest

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve users.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create User
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        user_type=user_in.user_type,
        phone=user_in.phone,
        is_active=user_in.is_active,
        is_verified=False # Default to false on creation unless specified
    )
    db.add(db_user)
    db.flush() # Flush to generate ID without committing transaction
    
    # Create Credentials
    hashed_password = security.get_password_hash(user_in.password)
    db_creds = UserCredentials(
        user_id=db_user.id,
        password_hash=hashed_password
    )
    db.add(db_creds)
    
    db.commit() # Commit both user and credentials in one transaction
    
    return db_user

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/{user_id}", response_model=UserSchema)
def read_user_by_id(
    user_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    update_data = user_in.model_dump(exclude_unset=True)
    
    # Handle password update separately
    if "password" in update_data:
        password = update_data.pop("password")
        hashed_password = security.get_password_hash(password)
        
        credentials = db.query(UserCredentials).filter(UserCredentials.user_id == user.id).first()
        if credentials:
            credentials.password_hash = hashed_password
            credentials.password_updated_at = db.query(UserCredentials).with_session(db).session.scalar(func.now()) if 'func' in locals() else None 
            db.add(credentials)
        else:
            db_creds = UserCredentials(
                user_id=user.id,
                password_hash=hashed_password
            )
            db.add(db_creds)

    # Update user fields
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=UserSchema)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    db.delete(user)
    db.commit()
    return user

@router.post("/{user_id}/activate", response_model=UserSchema)
def activate_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Activate a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    user.is_active = True
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/{user_id}/verify", response_model=UserSchema)
def verify_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Verify a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    user.is_verified = True
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/{user_id}/password", response_model=UserSchema)
def reset_password(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    body: PasswordResetRequest,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Reset user password.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException( status_code=404, detail="User not found" )
    
    hashed_password = security.get_password_hash(body.new_password)
    
    credentials = db.query(UserCredentials).filter(UserCredentials.user_id == user.id).first()
    if credentials:
        credentials.password_hash = hashed_password
    else:
        credentials = UserCredentials(user_id=user.id, password_hash=hashed_password)
        db.add(credentials)
        
    db.commit()
    db.refresh(user)
    return user

@router.post("/{user_id}/lock", response_model=UserSchema)
def lock_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Lock a user account.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException( status_code=404, detail="User not found" )
    
    credentials = db.query(UserCredentials).filter(UserCredentials.user_id == user.id).first()
    if credentials:
        credentials.is_locked = True
        db.add(credentials)
        db.commit()
    
    return user

@router.post("/{user_id}/unlock", response_model=UserSchema)
def unlock_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Unlock a user account.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException( status_code=404, detail="User not found" )
    
    credentials = db.query(UserCredentials).filter(UserCredentials.user_id == user.id).first()
    if credentials:
        credentials.is_locked = False
        db.add(credentials)
        db.commit()
    
    return user

@router.post("/{user_id}/roles/{role_id}", response_model=UserSchema)
def assign_role_to_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    role_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Assign a role to a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    from app.models.rbac import Role
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
        
    if role not in user.roles:
        user.roles.append(role)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user

@router.delete("/{user_id}/roles/{role_id}", response_model=UserSchema)
def remove_role_from_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: UUID,
    role_id: UUID,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Remove a role from a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    from app.models.rbac import Role
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
        
    if role in user.roles:
        user.roles.remove(role)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user
