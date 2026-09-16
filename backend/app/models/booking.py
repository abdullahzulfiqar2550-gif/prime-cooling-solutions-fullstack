from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Date, DateTime, Text
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True) # PCS-XXXX format
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    appliance = Column(String, nullable=False)
    service_package = Column(String, nullable=False)
    unit_count = Column(Integer, default=1, nullable=False)
    scheduled_date = Column(Date, nullable=False)
    time_slot = Column(String, nullable=False)
    region = Column(String, nullable=False)
    property_type = Column(String, nullable=True)
    address = Column(Text, nullable=False)
    symptoms_notes = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="NEW") # NEW|CONTACTED|CONFIRMED|IN_PROGRESS|COMPLETED|CANCELLED
    assigned_technician = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
