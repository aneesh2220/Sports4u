// In dev, this stays empty and Vite's proxy (vite.config.js) forwards /api/*
// to your local backend. In production, set VITE_API_BASE_URL (in a .env file,
// or in your hosting provider's environment variable settings) to your
// deployed backend's URL, e.g. https://wagon-api.onrender.com
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Request to ${path} failed (${res.status})`)
  return res.json()
}

export const fetchRecentMatches = () => getJSON('/api/matches/recent')
export const fetchLiveMatches = () => getJSON('/api/matches/live')
export const fetchUpcomingMatches = () => getJSON('/api/matches/upcoming')
export const fetchSchedule = () => getJSON('/api/schedule')
export const fetchScorecard = (matchId) => getJSON(`/api/scorecard/${matchId}`)
export const fetchSeries = (seriesId) => getJSON(`/api/series/${seriesId}`)

// Cricbuzz's raw response nests matches under typeMatches -> seriesMatches -> seriesAdWrapper.
// This flattens that into: [{ seriesId, seriesName, matches: [...] }]
// NOTE: field names here follow Cricbuzz's commonly documented shape. If your actual
// response differs, log the raw JSON once (console.log in a component) and adjust the
// paths below to match — RapidAPI listings occasionally tweak field names between versions.
export function groupMatchesBySeries(raw) {
  const typeMatches = raw?.typeMatches ?? []
  const groups = []

  for (const typeBlock of typeMatches) {
    const seriesMatches = typeBlock?.seriesMatches ?? []
    for (const sm of seriesMatches) {
      const wrapper = sm?.seriesAdWrapper
      if (!wrapper || !Array.isArray(wrapper.matches)) continue
      groups.push({
        seriesId: wrapper.seriesId,
        seriesName: wrapper.seriesName ?? 'Series',
        matches: wrapper.matches.map(normalizeMatch),
      })
    }
  }

  return groups
}

function normalizeMatch(m) {
  const info = m?.matchInfo ?? {}
  const score = m?.matchScore ?? {}

  return {
    id: info.matchId,
    desc: info.matchDesc,
    format: info.matchFormat,
    status: info.status,
    state: info.state, // expected: 'Live' | 'Complete' | 'Upcoming' (verify against real data)
    team1: {
      name: info.team1?.teamName ?? info.team1?.teamSName ?? 'TBD',
      score: formatInnings(score.team1Score),
    },
    team2: {
      name: info.team2?.teamName ?? info.team2?.teamSName ?? 'TBD',
      score: formatInnings(score.team2Score),
    },
  }
}

function formatInnings(teamScore) {
  if (!teamScore) return null
  const innings = Object.values(teamScore) // e.g. { inngs1: {...}, inngs2: {...} }
  if (innings.length === 0) return null
  return innings
    .map((inn) => {
      if (!inn) return null
      const wkts = inn.wickets ?? 10
      return `${inn.runs ?? 0}/${wkts}${inn.overs ? ` (${inn.overs})` : ''}`
    })
    .filter(Boolean)
    .join(' & ')
}
