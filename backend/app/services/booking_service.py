from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.models.audit_log import AuditLog
from app.schemas.booking import BookingCreate
from app.utils.id_generator import generate_booking_id
from app.services.email_service import send_booking_confirmation

async def create_booking_record(db: Session, booking_in: BookingCreate) -> Booking:
    new_id = generate_booking_id(db)
    
    booking_data = booking_in.model_dump()
    booking_data["id"] = new_id
    booking_data["status"] = "NEW"
    
    booking = Booking(**booking_data)
    db.add(booking)
    
    db.add(AuditLog(actor="SYSTEM", action="CREATE_BOOKING", details=f"New booking created via public API", entity_type="Booking", entity_id=new_id))
    
    db.commit()
    db.refresh(booking)
    
    await send_booking_confirmation(booking)
    
    return booking
