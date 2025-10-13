# Athichudi Pronunciation Checker (Backend)

Small FastAPI backend for checking Tamil phrase pronunciation using speech recognition and Levenshtein similarity.

## Features

- Serve a phrases dataset (GET /phrases)
- Accept an uploaded audio file and phrase_id, transcribe audio (Google recognizer) and return a similarity score and verdict (POST /check_pronunciation)
- Simple health endpoint (GET /health)
- CORS enabled (currently allows all origins for testing)

## File layout

- main.py — FastAPI app
- athisudi_dataset.json — phrases dataset (required)
- README.md — this file

## Requirements

- Python 3.9+
- ffmpeg installed on the host (required by pydub)
- Python packages:
  - fastapi
  - uvicorn
  - pydantic
  - SpeechRecognition
  - python-Levenshtein
  - pydub

Install with:

```bash
python -m pip install -r requirements.txt
```

## Running locally

1. Ensure `athisudi_dataset.json` is present in the same directory.
2. Ensure ffmpeg is installed and available on PATH (Windows: add ffmpeg bin; Ubuntu: apt install ffmpeg).
3. Start the app:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`.

## Endpoints

- GET /phrases  
  Returns list of phrase objects from `athisudi_dataset.json`.

- POST /check_pronunciation  
  Form fields:
  - `phrase_id` (int) — id from dataset
  - `audio_file` (file) — recorded audio (webm/ogg/wav supported by pydub)
  - `threshold` (float, optional) — default 0.6  
  Returns JSON with transcription, score, verdict, and phrase metadata.

  Example curl:

  ```bash
  curl -X POST "http://localhost:8000/check_pronunciation" \
    -F "phrase_id=1" \
    -F "audio_file=@recording.webm" \
    -F "threshold=0.6"
  ```

- GET /health  
  Simple {"status":"ok"} response.

## Notes & Troubleshooting

- The app uses the Google Web Speech API via SpeechRecognition (no API key) — network access required. Transcription may fail or be empty.
- Ensure ffmpeg is installed; pydub relies on it to convert webm → wav.
- Temporary files are created during processing; they are removed in normal flow. If the process crashes, check /tmp or working dir for leftover files.
- For frontend deployment (Netlify/Vercel), set environment variable `REACT_APP_BACKEND_URL` to your deployed backend URL so the client does not call `undefined/phrases`.

## Deployment

- When deploying (Render, Heroku, etc.) make sure:
  - ffmpeg is available in the runtime image
  - dataset file is included in the deployed bundle
  - open the required port (Render will set it via `$PORT` — adapt run command if needed)
