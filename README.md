# Athichudi Pronunciation Checker

Monorepo with a React frontend and FastAPI backend for checking Tamil phrase pronunciation (transcription + Levenshtein similarity).

## Repo layout

- backend/ — FastAPI app
  - main.py
  - athisudi_dataset.json
  - README.md (backend-specific)
- frontend/ — Create React App
  - src/
  - .env (REACT_APP_BACKEND_URL)
  - README.md (frontend-specific)

## Quick start (development)

Prerequisites

- Node 16+ and npm (frontend)
- Python 3.9+ and pip (backend)
- ffmpeg installed on the host (required by pydub)

Backend (Windows example)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app
# API: http://localhost:8000
```

Frontend (Windows PowerShell)

```powershell
cd frontend
# set backend url for build/dev
# create frontend/.env with:
# REACT_APP_BACKEND_URL=http://localhost:8000
npm install
npm start
# Frontend: http://localhost:3000
```

## Environment variables

- frontend: REACT_APP_BACKEND_URL — full backend base URL (required at build time). If missing, browser requests may go to `undefined/...`.
- backend: none required for local dev; adjust deployment PORT if host provides one.

## Endpoints

- GET /phrases — list of phrase objects
- POST /check_pronunciation — form: phrase_id (int), audio_file (file), threshold (float, optional)
- GET /health — simple health check

## Deployment notes

- Ensure ffmpeg is available in the runtime image (pydub depends on it).
- Include athisudi_dataset.json in backend deployment bundle.
- Set REACT_APP_BACKEND_URL in host/build environment (Netlify/Vercel: Environment/Build settings).
- Configure backend CORS to allow frontend origin (or restrict appropriately for production).

## Troubleshooting

- Browser shows requests to `undefined/phrases` → REACT_APP_BACKEND_URL was not set at build time; add it and rebuild/redeploy.
- Speech transcription empty/fails → check network access (Google recognizer), confirm ffmpeg works on host, review server logs.
- Leftover temp audio files after crashes → inspect working dir or /tmp.
