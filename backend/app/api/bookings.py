from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.booking import Booking
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from app.schemas.common import APIResponse
from app.api.deps import require_admin, get_current_user
from app.services.booking_service import create_booking_record
from app.services.email_service import send_booking_status_update

router = APIRouter(tags=["bookings"])

@router.post("/bookings", response_model=APIResponse)
async def create_booking(booking_in: BookingCreate, db: Session = Depends(get_db)):
    booking = await create_booking_record(db, booking_in)
    return APIResponse(success=True, data=BookingResponse.model_validate(booking).model_dump(), message="Booking created successfully")

@router.get("/bookings/track", response_model=APIResponse)
def track_booking(q: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter((Booking.id == q) | (Booking.phone == q)).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return APIResponse(success=True, data=BookingResponse.model_validate(booking).model_dump(), message="Booking found")

@router.get("/admin/bookings", response_model=List[BookingResponse])
def list_bookings(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    return query.order_by(Booking.created_at.desc()).all()

@router.get("/admin/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.patch("/admin/bookings/{booking_id}/status", response_model=APIResponse)
async def update_booking_status(booking_id: str, status_update: BookingStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    old_status = booking.status
    booking.status = status_update.status
    if status_update.assigned_technician is not None:
        booking.assigned_technician = status_update.assigned_technician
        
    db.add(AuditLog(actor=current_user.email, action="UPDATE_BOOKING_STATUS", details=f"Changed status from {old_status} to {booking.status}", entity_type="Booking", entity_id=booking.id))
    db.commit()
    db.refresh(booking)
    
    await send_booking_status_update(booking, old_status, booking.status)
    
    return APIResponse(success=True, data=BookingResponse.model_validate(booking).model_dump(), message="Booking status updated")

@router.put("/admin/bookings/{booking_id}", response_model=APIResponse)
def update_booking(booking_id: str, booking_in: BookingCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    for field, value in booking_in.model_dump().items():
        setattr(booking, field, value)
        
    db.add(AuditLog(actor=current_user.email, action="UPDATE_BOOKING", details="Updated booking details", entity_type="Booking", entity_id=booking.id))
    db.commit()
    db.refresh(booking)
    return APIResponse(success=True, data=BookingResponse.model_validate(booking).model_dump(), message="Booking updated")

@router.delete("/admin/bookings/{booking_id}", response_model=APIResponse)
def delete_booking(booking_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    db.delete(booking)
    db.add(AuditLog(actor=current_user.email, action="DELETE_BOOKING", details=f"Deleted booking {booking.id}", entity_type="Booking", entity_id=booking.id))
    db.commit()
    return APIResponse(success=True, message="Booking deleted")
