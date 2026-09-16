import asyncio
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.service import Service
from app.utils.security import hash_password
from app.config import settings

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Seed Admin User
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                role="SUPER_ADMIN",
                is_active=True
            )
            db.add(admin_user)
            print("Admin user seeded.")
        
        # Seed Services
        services_data = [
            {"slug": "service-visit", "title": "Service Visit / Inspection", "price_text": "Rs. 700", "icon": "search", "sort_order": 1},
            {"slug": "general-ac-service", "title": "General AC Service", "price_text": "Rs. 2,000 – 2,500", "icon": "wrench", "sort_order": 2},
            {"slug": "ac-installation", "title": "AC Installation", "price_text": "Rs. 3,000", "icon": "hammer", "sort_order": 3},
            {"slug": "ac-uninstallation", "title": "AC Uninstallation", "price_text": "Rs. 1,500", "icon": "package-minus", "sort_order": 4},
            {"slug": "pressure-wash", "title": "Pressure Wash", "price_text": "Quote-based", "icon": "droplets", "sort_order": 5},
            {"slug": "repair-troubleshooting", "title": "Repair & Troubleshooting", "price_text": "Quote-based", "icon": "settings", "sort_order": 6},
            {"slug": "refrigerant-services", "title": "Refrigerant Services", "price_text": "Quote-based", "icon": "gauge", "sort_order": 7},
            {"slug": "copper-piping", "title": "Copper Piping & Drainage", "price_text": "Quote-based", "icon": "pipette", "sort_order": 8},
            {"slug": "electrical-troubleshooting", "title": "Electrical Troubleshooting", "price_text": "Quote-based", "icon": "zap", "sort_order": 9},
            {"slug": "preventive-maintenance", "title": "Preventive Maintenance", "price_text": "Quote-based", "icon": "shield-check", "sort_order": 10},
            {"slug": "amc", "title": "Annual Maintenance Contract", "price_text": "Rs. 9,999 / AC / Year", "icon": "file-check", "sort_order": 11},
            {"slug": "water-dispenser", "title": "Water Dispenser Service", "price_text": "Quote-based", "icon": "glass-water", "sort_order": 12},
            {"slug": "refrigerator-service", "title": "Refrigerator Service", "price_text": "Quote-based", "icon": "refrigerator", "sort_order": 13},
        ]
        
        for data in services_data:
            existing = db.query(Service).filter(Service.slug == data["slug"]).first()
            if not existing:
                db.add(Service(**data))
        print("Services seeded.")
        
        db.commit()
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
