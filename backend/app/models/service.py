from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=True)
    icon = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tier = Column(String, nullable=True)
    price_text = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Active") # Active | Inactive
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
