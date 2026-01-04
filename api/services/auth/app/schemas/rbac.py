from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

# Permission Schemas
class PermissionBase(BaseModel):
    code: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseModel):
    description: Optional[str] = None

class Permission(PermissionBase):
    id: UUID

    class Config:
        from_attributes = True

# Role Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    permission_ids: Optional[List[UUID]] = []

class RoleUpdate(BaseModel):
    description: Optional[str] = None
    permission_ids: Optional[List[UUID]] = None

class Role(RoleBase):
    id: UUID
    permissions: List[Permission] = []

    class Config:
        from_attributes = True
