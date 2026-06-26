# ScoreLine

A livescore.com-style live cricket scores site, built on the real Cricbuzz data
API (via RapidAPI). Dark theme, sport tabs (Cricket is the only one wired up),
a competitions sidebar, and match rows with a live-state color bar — structured
like livescore.com, styled differently.

## 1. Get your API key

1. Go to rapidapi.com and sign up (free).
2. Search "Cricbuzz Cricket", open it, click the **Pricing** tab, subscribe to
   the free **Basic** plan.
3. Click the **Endpoints** tab — your key is shown as `X-RapidAPI-Key` in the
   code sample box. Copy it.

## 2. Set up your key locally (never share this)

In this folder, copy the example env file:

```bash
cp .env.example .env
```

Open `.env` in any text editor and replace `paste_your_key_here` with your
real key. Save it. This file is only read by your own computer — it's never
sent anywhere except to RapidAPI itself.

## 3. Install and run

You need two things running at once: the backend (holds your key, talks to
RapidAPI) and the frontend (what you see in the browser).

```bash
npm install
npm run dev:all
```

That single command starts both. Then open the URL it prints for the frontend
(usually http://localhost:5173).

If you'd rather run them separately (two terminal windows):

```bash
npm run server   # backend, http://localhost:8787
npm run dev       # frontend, http://localhost:5173
```

## 4. If the scorecard page looks empty

Cricbuzz's scorecard response shape can vary slightly. Open your browser's
console (F12 → Console tab) on a match page — the raw API response is logged
there. Compare it to the field names used in `src/pages/MatchPage.jsx` and
adjust if needed. Paste me that console output and I can fix the mapping for
you directly.

## Project structure

- `server/index.js` — Express proxy: holds your key, caches responses 30s
- `src/api/cricbuzz.js` — frontend functions that call your own `/api/*` routes
- `src/pages/ScoresPage.jsx` — home: sidebar, date strip, grouped matches
- `src/pages/MatchPage.jsx` — scorecard detail
- `src/index.css` — all styling
