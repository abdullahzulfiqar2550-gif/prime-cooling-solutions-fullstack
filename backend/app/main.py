from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.api import health, auth, services, bookings, contacts, admin

app = FastAPI(title="Prime Cooling Solutions API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to Prime Cooling Solutions API"}
