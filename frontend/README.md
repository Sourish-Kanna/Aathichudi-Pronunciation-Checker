# Athichudi Pronunciation Checker — Frontend

React frontend (Create React App) for the Athichudi Pronunciation Checker. Fetches phrase data and uploads recorded audio to the backend to get a transcription, similarity score and verdict.

## Key points

- Built with Create React App.
- Expects a backend URL in the environment variable `REACT_APP_BACKEND_URL`.
- The frontend calls endpoints: `/phrases` and `/check_pronunciation`.

## Prerequisites

- Node 16+ / npm (or use pnpm/yarn)
- Backend service running and reachable
- (Optional) Netlify / Vercel for deployment

## Environment

Create a file `frontend/.env` (or set env vars in your hosting) with:

```env
REACT_APP_BACKEND_URL=https://your-backend.example.com
```

Notes:

- Create React App exposes only variables prefixed with `REACT_APP_`.
- After changing env vars you must restart the dev server or rebuild the production bundle.
- On Netlify/Vercel: set the variable in the project's Environment / Build settings and redeploy.

## Available scripts

In project root (frontend):

- `npm start` — start dev server (<http://localhost:3000>)
- `npm run build` — create production build in `build/`
- `npm test` — run tests

Example (Windows PowerShell):

```powershell
npm install
npm start
```

## Running locally

1. Verify backend is running and `REACT_APP_BACKEND_URL` points to it.
2. From `frontend/`:
   - `npm install`
   - `npm start`
3. Open <http://localhost:3000>

## Deployment

1. Set `REACT_APP_BACKEND_URL` in your hosting provider (Netlify/ Vercel/Render).
2. Deploy the production build (`npm run build`) or let the host run the build.
3. Ensure CORS is allowed on the backend for the frontend origin.

## Troubleshooting

- Browser shows requests to `undefined/phrases`:
  - The frontend env var `REACT_APP_BACKEND_URL` is missing at build time. Add it to `.env` (local) or hosting env settings and rebuild/redeploy.
- CORS errors:
  - Allow the frontend origin in backend CORS or enable `*` during testing.
- Empty transcription / audio conversion errors:
  - Ensure `ffmpeg` is available on the backend host (pydub dependency).

## Notes

- Keep secrets off the client — do not store private keys in `REACT_APP_` variables.
- The project expects the backend endpoints described above; check backend README for details.

License: MIT
