# Prime Cooling Solutions — Professional HVAC & Appliance Services Platform

## Project Structure

```
Prime Colling Solution/
├── docker-compose.yml          # Full stack orchestration
├── .env.example                # Environment variables template
├── .env                        # Your local config (gitignored)
├── logo.png                    # Company logo
├── backend/                    # FastAPI + SQLAlchemy + Alembic
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── seed.py
│       ├── models/
│       ├── schemas/
│       ├── api/
│       ├── services/
│       └── utils/
└── frontend/                   # Next.js 14 + Tailwind + Lucide
    ├── Dockerfile
    ├── package.json
    ├── public/
    │   └── logo.png
    └── src/
        ├── app/
        ├── components/
        ├── lib/
        ├── types/
        └── providers/
```

## Quick Start

### Option 1: Docker (Recommended)
```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up -d

# Seed database with admin user and services
docker compose exec backend python -m app.seed

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Development
```bash
# Start PostgreSQL (via Docker or local install)
docker compose up -d db

# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Company Information
- **Company**: Prime Cooling Solutions
- **Tagline**: Engineered Service. Professional Standards.
- **CEO**: Zubair Akeel, BS Mechanical Engineering, HVAC Specialist
- **Phone/WhatsApp**: 0337-1768618
- **Email**: primecoolingsolutions.pk@gmail.com
- **Address**: Shop No. 7, Abdul Sattar Park, Dogar Market, Kot Lakhpat, Lahore
- **Hours**: Mon–Sat 9AM–7PM
