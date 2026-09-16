from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, BigInteger
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    entity_type = Column(String, nullable=True)
    entity_id = Column(String, nullable=True)
