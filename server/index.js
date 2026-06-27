import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())

const PORT = process.env.PORT || 8787
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com'
const BASE = `https://${RAPIDAPI_HOST}`

if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'paste_your_key_here') {
  console.warn(
    '\n⚠️  RAPIDAPI_KEY is not set. Copy .env.example to .env and add your real key.\n',
  )
}

// Tiny in-memory cache so a page full of users doesn't multiply your RapidAPI hits.
// TTL is per-route below: short for live (since the frontend polls it every 10s),
// longer for things that barely change minute to minute.
const cache = new Map()

async function cachedFetch(path, ttlMs) {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.at < ttlMs) {
    return cached.data
  }

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Upstream ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  cache.set(path, { at: Date.now(), data })
  return data
}

function handle(path, ttlMs = 30_000) {
  return async (req, res) => {
    try {
      const data = await cachedFetch(path, ttlMs)
      res.json(data)
    } catch (err) {
      console.error(`Failed fetching ${path}:`, err.message)
      res.status(502).json({ error: 'Failed to fetch from Cricbuzz API', detail: err.message })
    }
  }
}

app.get('/api/matches/recent', handle('/matches/v1/recent', 60_000))
app.get('/api/matches/live', handle('/matches/v1/live', 10_000))
app.get('/api/matches/upcoming', handle('/matches/v1/upcoming', 120_000))
app.get('/api/schedule', handle('/schedule/v1/international', 300_000))

app.get('/api/scorecard/:matchId', (req, res) =>
  handle(`/mcenter/v1/${req.params.matchId}/scard`, 10_000)(req, res),
)

app.get('/api/series/:seriesId', (req, res) =>
  handle(`/series/v1/${req.params.seriesId}`, 60_000)(req, res),
)

app.listen(PORT, () => {
  console.log(`Wagon API proxy running on http://localhost:${PORT}`)
})
