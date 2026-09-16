from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ServiceBase(BaseModel):
    slug: str
    title: str
    category: Optional[str] = None
    icon: str
    description: Optional[str] = None
    tier: Optional[str] = None
    price_text: str
    status: str = "Active"
    sort_order: int = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    tier: Optional[str] = None
    price_text: Optional[str] = None
    status: Optional[str] = None
    sort_order: Optional[int] = None

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ServiceListResponse(BaseModel):
    services: List[ServiceResponse]
