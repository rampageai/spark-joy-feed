# spark-joy-feed 🌟

A small, joyful web app for collecting moments that spark joy — photos and notes you can add, view, and gently let go of.

Built for the **Seattle University HackSU 2026 Hackathon**.

## Team
- Cameron Crimmel  
- Willow Mesrobian  
- Rebecca Riffle  

---

## What This Is

**spark-joy-feed** is a lightweight full-stack app with:
- A backend API for storing photos and notes
- A simple frontend feed for interacting with them
- A focus on positive reflection and intentional impermanence

---

## Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (3.11+)

---

### 1️⃣ Install backend dependencies
From the repo root:
```bash
python -m pip install -r backend/requirements.txt
```

2️⃣ Install frontend dependencies
```bash
cd frontend
npm install
```

3️⃣ Launch the app (backend + frontend)

From the repo root:
```bash
`npm run dev`
```


- Backend runs at: http://127.0.0.1:3000
- Frontend runs at: http://localhost:5173 (default Vite port)

## Tech Stack
### Backend
- FastAPI
- SQLModel
- SQLite
### Frontend
- React
- Vite
### Dev Tooling
- npm scripts
- concurrently + wait-on for cross-platform startup

## Notes

This project was built quickly for a hackathon and favors clarity and approachability over heavy abstraction. The setup is intentionally simple to make local development easy across macOS and Windows.
