from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.service import Service
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.schemas.common import APIResponse
from app.api.deps import require_admin

router = APIRouter(tags=["services"])

@router.get("/services", response_model=List[ServiceResponse])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.status == "Active").order_by(Service.sort_order).all()

@router.get("/services/{slug}", response_model=ServiceResponse)
def get_service(slug: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == slug, Service.status == "Active").first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/admin/services", response_model=APIResponse)
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    existing = db.query(Service).filter(Service.slug == service_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service with this slug already exists")
        
    new_service = Service(**service_in.model_dump())
    db.add(new_service)
    
    # Audit log
    db.add(AuditLog(actor=current_user.email, action="CREATE_SERVICE", details=f"Created service {new_service.slug}", entity_type="Service"))
    
    db.commit()
    db.refresh(new_service)
    
    return APIResponse(success=True, data=ServiceResponse.model_validate(new_service).model_dump(), message="Service created")

@router.put("/admin/services/{service_id}", response_model=APIResponse)
def update_service(service_id: int, service_in: ServiceUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
        
    for field, value in service_in.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
        
    db.add(AuditLog(actor=current_user.email, action="UPDATE_SERVICE", details=f"Updated service {service.slug}", entity_type="Service", entity_id=str(service.id)))
    db.commit()
    db.refresh(service)
    return APIResponse(success=True, data=ServiceResponse.model_validate(service).model_dump(), message="Service updated")

@router.delete("/admin/services/{service_id}", response_model=APIResponse)
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
        
    db.delete(service)
    db.add(AuditLog(actor=current_user.email, action="DELETE_SERVICE", details=f"Deleted service {service.slug}", entity_type="Service", entity_id=str(service_id)))
    db.commit()
    return APIResponse(success=True, message="Service deleted")
