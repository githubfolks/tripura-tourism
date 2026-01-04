from sqlalchemy import Boolean, Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20))
    user_type = Column(String(50), nullable=False) # PORTAL_ADMIN | PORTAL_STAFF | PARTNER_ADMIN | PARTNER_USER
    
    partner_id = Column(UUID(as_uuid=True), nullable=True) # FK to api_partners, but we might mock/ignore FK consistency across services for now or map it loosely.
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    credentials = relationship("UserCredentials", back_populates="user", uselist=False)
    roles = relationship("Role", secondary="user_roles", back_populates="users")

class UserCredentials(Base):
    __tablename__ = "user_credentials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    password_hash = Column(String, nullable=False)
    password_algo = Column(String(50), default='bcrypt')
    
    last_login = Column(DateTime(timezone=True))
    password_updated_at = Column(DateTime(timezone=True))
    
    is_locked = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="credentials")
