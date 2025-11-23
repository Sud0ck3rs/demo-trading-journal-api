# Demo Trading Journal API & Frontend

A full-stack demo project combining a **FastAPI backend** and a **React (Vite + TypeScript) frontend** for logging and analysing trading journal entries.

---

## Project Overview

This project provides everything needed to manage a simple trading journal:

- A backend REST API built with **FastAPI** (Python)
- A **SQLite + SQLModel** database for persistence
- A frontend interface built with **React + Vite**
- Full integration:  
  The backend can serve the production React build, giving you a single deployable service

### Key Features

- Create, read, update, and delete trades (CRUD)
- Store symbol, side, price, quantity, timestamps, notes, strategy tags
- Summary statistics:
  - Total trades
  - Winning & losing trades
  - Win-rate
  - Realised PnL
  - Average win / loss
- React UI to:
  - Create trades
  - Display a list of trades
  - View aggregated metrics
- Dev proxy (`/api → localhost:8000`) + production static serving

---

## Tech Stack

### Backend
- FastAPI
- SQLModel
- SQLite
- Uvicorn

### Frontend
- React
- Vite
- TypeScript
- Axios

---

## Getting Started (Development)

### 1. Clone the repository

```bash
git clone https://github.com/Sud0ck3rs/demo-trading-journal-api.git
cd demo-trading-journal-api
cd app
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at:
- [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger UI : [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Frontend Setup (Dev Mode)

```bash
cd frontend
npm install
npm run dev
```

React dev server runs on:
- [http://localhost:5173](http://localhost:5173)

The Vite proxy automatically forwards `/api` requests to the backend.

---

## Production Build

```bash
cd frontend
npm run build
```

This generates a `dist/` directory.

Then run the backend normally:

```bash
uvicorn app.main:app --reload
```

FastAPI will now serve:
- Frontend → `GET /`
- API → `GET /api/...`

Everything from a single server

---

## Project Struture

```bash
demo-trading-journal-api/
│
├── app/
│   ├── main.py               # FastAPI entrypoint with lifespan + static serving
│   ├── db.py                 # SQLModel engine + session
│   ├── models.py             # SQLModel models
│   ├── routers/
│   │     └── trades.py       # Trade CRUD + stats routes
│   └── ...
│
├── frontend/
│   ├── src/                  # React source
│   ├── dist/                 # Production build
│   ├── vite.config.ts
│   └── package.json
│
└── requirements.txt
```

---

## API Endpoints Summary
| Method        | Endpoint                    | Description       |
| ------------- | --------------------------- | ----------------- |
| GET           | `/api/trades/`              | List all trades   |
| POST          | `/api/trades/`              | Create a trade    |
| GET           | `/api/trades/{id}`          | Get a trade by ID |
| PUT           | `/api/trades/{id}`          | Update a trade    |
| DELETE        | `/api/trades/{id}`          | Delete a trade    |
| GET           | `/api/trades/stats/summary` | Summary metrics   |
| GET           | `/health`                   | Health check      |

---

## Frontend Features

- Trade creation form
- Responsive trade list table
- Stats summary card (winrate, PnL, avg win/loss…)
- Simple and clean UI
- Axios for REST requests
- Works perfectly in dev mode (proxy) and in production (static served by FastAPI)

---

## Roadmap (Ideas for Futures Enhancements)

- Authentication (JWT)
- Equity curve chart
- Per-symbol / per-strategy performance
- R-multiple metrics and risk analysis
- Dockerfile + docker-compose
- Unit tests (Pytest backend, Jest frontend)
- Deployment on Fly.io / Render / Railway

