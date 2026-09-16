from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.contact import Contact
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.contact import ContactCreate, ContactStatusUpdate, ContactResponse
from app.schemas.common import APIResponse
from app.api.deps import require_admin
from app.services.email_service import send_new_contact_notification

router = APIRouter(tags=["contacts"])

@router.post("/contacts", response_model=APIResponse)
async def submit_contact(contact_in: ContactCreate, db: Session = Depends(get_db)):
    contact = Contact(**contact_in.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    
    await send_new_contact_notification(contact)
    return APIResponse(success=True, data=ContactResponse.model_validate(contact).model_dump(), message="Contact form submitted successfully")

@router.get("/admin/contacts", response_model=List[ContactResponse])
def list_contacts(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()

@router.patch("/admin/contacts/{contact_id}", response_model=APIResponse)
def update_contact_status(contact_id: int, status_update: ContactStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    old_status = contact.status
    contact.status = status_update.status
    db.add(AuditLog(actor=current_user.email, action="UPDATE_CONTACT_STATUS", details=f"Changed status from {old_status} to {contact.status}", entity_type="Contact", entity_id=str(contact.id)))
    db.commit()
    db.refresh(contact)
    return APIResponse(success=True, data=ContactResponse.model_validate(contact).model_dump(), message="Contact status updated")
