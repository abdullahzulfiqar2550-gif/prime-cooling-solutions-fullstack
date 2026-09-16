from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.booking import Booking
from app.models.audit_log import AuditLog
from app.models.user import User
from app.api.deps import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total = db.query(Booking).count()
    pending = db.query(Booking).filter(Booking.status.in_(["NEW", "CONTACTED"])).count()
    in_progress = db.query(Booking).filter(Booking.status.in_(["CONFIRMED", "IN_PROGRESS"])).count()
    completed = db.query(Booking).filter(Booking.status == "COMPLETED").count()
    
    return {
        "success": True,
        "data": {
            "total_bookings": total,
            "pending_bookings": pending,
            "in_progress_bookings": in_progress,
            "completed_bookings": completed
        },
        "message": "Dashboard metrics retrieved"
    }

@router.get("/audit-logs")
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
    return {"success": True, "data": logs, "message": "Audit logs retrieved"}
