import { useEffect, useMemo, useState } from 'react'
import {
  fetchRecentMatches,
  fetchLiveMatches,
  fetchUpcomingMatches,
  groupMatchesBySeries,
} from '../api/cricbuzz.js'
import TopNav from '../components/TopNav.jsx'
import DateStrip from '../components/DateStrip.jsx'
import Sidebar from '../components/Sidebar.jsx'
import SeriesGroup from '../components/SeriesGroup.jsx'

const FETCHERS = {
  live: fetchLiveMatches,
  Today: fetchRecentMatches,
  Yesterday: fetchRecentMatches,
  Tomorrow: fetchUpcomingMatches,
}

export default function ScoresPage() {
  const [filter, setFilter] = useState('live')
  const [groups, setGroups] = useState([])
  const [activeSeriesId, setActiveSeriesId] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let mounted = true
    setStatus('loading')
    const fetcher = FETCHERS[filter] ?? fetchRecentMatches

    fetcher()
      .then((raw) => {
        if (!mounted) return
        setGroups(groupMatchesBySeries(raw))
        setStatus('ready')
      })
      .catch((err) => {
        if (!mounted) return
        console.error(err)
        setStatus('error')
      })

    return () => {
      mounted = false
    }
  }, [filter])

  const visibleGroups = useMemo(() => {
    if (activeSeriesId === null) return groups
    return groups.filter((g) => g.seriesId === activeSeriesId)
  }, [groups, activeSeriesId])

  return (
    <div className="app-shell">
      <TopNav />
      <DateStrip filter={filter} onFilterChange={setFilter} />
      <div className="layout">
        <Sidebar
          seriesList={groups}
          activeSeriesId={activeSeriesId}
          onSelect={setActiveSeriesId}
        />
        <main className="main-col">
          {status === 'loading' && <p className="hint">Loading matches…</p>}
          {status === 'error' && (
            <p className="hint hint--error">
              Couldn't load matches. Check that your server is running and your
              RapidAPI key is set in <code>.env</code>.
            </p>
          )}
          {status === 'ready' && visibleGroups.length === 0 && (
            <p className="hint">No matches for this filter right now.</p>
          )}
          {visibleGroups.map((g) => (
            <SeriesGroup key={g.seriesId ?? g.seriesName} series={g} />
          ))}
        </main>
      </div>
    </div>
  )
}
