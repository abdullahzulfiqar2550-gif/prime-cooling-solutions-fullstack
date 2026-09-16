from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="NEW") # NEW|READ|REPLIED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
