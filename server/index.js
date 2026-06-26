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
const cache = new Map()
const TTL_MS = 30_000 // 30s — live data stays reasonably fresh without burning quota

async function cachedFetch(path) {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.at < TTL_MS) {
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

function handle(path) {
  return async (req, res) => {
    try {
      const data = await cachedFetch(path)
      res.json(data)
    } catch (err) {
      console.error(`Failed fetching ${path}:`, err.message)
      res.status(502).json({ error: 'Failed to fetch from Cricbuzz API', detail: err.message })
    }
  }
}

app.get('/api/matches/recent', handle('/matches/v1/recent'))
app.get('/api/matches/live', handle('/matches/v1/live'))
app.get('/api/matches/upcoming', handle('/matches/v1/upcoming'))
app.get('/api/schedule', handle('/schedule/v1/international'))

app.get('/api/scorecard/:matchId', (req, res) =>
  handle(`/mcenter/v1/${req.params.matchId}/scard`)(req, res),
)

app.get('/api/series/:seriesId', (req, res) =>
  handle(`/series/v1/${req.params.seriesId}`)(req, res),
)

app.listen(PORT, () => {
  console.log(`Wagon API proxy running on http://localhost:${PORT}`)
})
