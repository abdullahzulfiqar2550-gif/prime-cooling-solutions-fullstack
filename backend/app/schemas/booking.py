from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime

class BookingBase(BaseModel):
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    appliance: str
    service_package: str
    unit_count: int = Field(default=1, ge=1)
    scheduled_date: date
    time_slot: str
    region: str
    property_type: Optional[str] = None
    address: str
    symptoms_notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingStatusUpdate(BaseModel):
    status: str
    assigned_technician: Optional[str] = None

class BookingResponse(BookingBase):
    id: str
    status: str
    assigned_technician: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BookingListResponse(BaseModel):
    bookings: List[BookingResponse]

class TrackingQuery(BaseModel):
    q: str
