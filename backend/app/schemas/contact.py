from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ContactBase(BaseModel):
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    subject: Optional[str] = None
    message: str

class ContactCreate(ContactBase):
    pass

class ContactStatusUpdate(BaseModel):
    status: str

class ContactResponse(ContactBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ContactListResponse(BaseModel):
    contacts: List[ContactResponse]
