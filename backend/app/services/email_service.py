import logging
import aiosmtplib
from email.message import EmailMessage
from app.config import settings

logger = logging.getLogger(__name__)

async def send_email(to: str, subject: str, body: str):
    if not settings.SMTP_HOST:
        logger.info(f"SMTP not configured. Would send email to {to} | Subject: {subject} | Body: {body}")
        print(f"--- EMAIL SIMULATION ---\nTo: {to}\nSubject: {subject}\nBody: {body}\n------------------------")
        return

    message = EmailMessage()
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>" if settings.SMTP_FROM_NAME else settings.SMTP_FROM_EMAIL
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=True if settings.SMTP_PORT == 465 else False,
            start_tls=True if settings.SMTP_PORT == 587 else False,
        )
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")

async def send_booking_confirmation(booking):
    if not booking.email:
        return
    subject = f"Booking Confirmation - {booking.id}"
    body = f"Dear {booking.customer_name},\n\nYour booking {booking.id} has been received. We will contact you shortly.\n\nThanks,\nPrime Cooling Solutions"
    await send_email(booking.email, subject, body)

async def send_booking_status_update(booking, old_status, new_status):
    if not booking.email:
        return
    subject = f"Booking Status Update - {booking.id}"
    body = f"Dear {booking.customer_name},\n\nYour booking {booking.id} status has changed from {old_status} to {new_status}.\n\nThanks,\nPrime Cooling Solutions"
    await send_email(booking.email, subject, body)

async def send_new_contact_notification(contact):
    subject = "New Contact Form Submission"
    body = f"New message from {contact.full_name} ({contact.email}):\n\n{contact.message}"
    await send_email(settings.ADMIN_EMAIL, subject, body)
