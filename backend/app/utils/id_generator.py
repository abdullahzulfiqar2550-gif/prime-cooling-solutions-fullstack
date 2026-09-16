import random
from sqlalchemy.orm import Session
from app.models.booking import Booking

def generate_booking_id(db_session: Session) -> str:
    while True:
        num = random.randint(1000, 9999)
        new_id = f"PCS-{num}"
        exists = db_session.query(Booking).filter(Booking.id == new_id).first()
        if not exists:
            return new_id
