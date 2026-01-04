from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError, BaseModel
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.config import settings
from app.db.session import SessionLocal

# Reusing the same TokenPayload schema locally to avoid cross-service imports complexity
class TokenPayload(BaseModel):
    sub: Optional[str] = None

# Using the Auth Service's login endpoint for the token URL hint in Swagger
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/v1/login/access-token" # This would point to the Auth Service relative path if behind a gateway
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user_id(
    token: str = Depends(reusable_oauth2)
) -> str:
    """
    Decodes the token and returns the user ID (sub).
    Does NOT fetch the full user object from DB to keep Catalog Service independent (mostly).
    If we need user role info, we should ideally encode it in the token scopes or claims.
    For now, valid token existence implies 'authenticated'.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return token_data.sub
