import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { fetchScorecard } from '../api/cricbuzz.js'
import TopNav from '../components/TopNav.jsx'

export default function MatchPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let mounted = true
    setStatus('loading')
    fetchScorecard(id)
      .then((raw) => {
        if (!mounted) return
        setData(raw)
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
  }, [id])

  // Confirmed shape (RapidAPI cricbuzz-cricket /mcenter/v1/{id}/scard):
  // { scorecard: [ { inningsid, batteamname, score, wickets, overs, runrate,
  //   batsman: [...], bowler: [...], extras: {...} } ], status: "..." }
  const innings = data?.scorecard ?? []

  return (
    <div className="app-shell">
      <TopNav />
      <div className="page">
        <Link to="/" className="back-link">
          <ChevronLeft size={15} /> Scores
        </Link>

        {status === 'ready' && data?.status && (
          <p className="match-status">{data.status}</p>
        )}

        {status === 'loading' && <p className="hint">Loading scorecard…</p>}
        {status === 'error' && (
          <p className="hint hint--error">Couldn't load this scorecard.</p>
        )}

        {status === 'ready' && innings.length === 0 && (
          <p className="hint">
            No scorecard data in the expected shape. Check the browser console —
            the raw response is logged there so the field mapping in{' '}
            <code>MatchPage.jsx</code> can be adjusted to match it.
          </p>
        )}

        {innings.map((inn, i) => (
          <InningsBlock key={i} innings={inn} />
        ))}
      </div>
    </div>
  )
}

function InningsBlock({ innings }) {
  const battingTeam = innings?.batteamname ?? 'Innings'
  const batsmen = innings?.batsman ?? []
  const bowlers = innings?.bowler ?? []
  const extras = innings?.extras

  return (
    <section className="innings-block">
      <div className="innings-block__head">
        <h2>{battingTeam}</h2>
        <span className="innings-block__score">
          {innings.score}/{innings.wickets} <small>({innings.overs} ov, RR {innings.runrate})</small>
        </span>
      </div>

      {batsmen.length > 0 && (
        <table className="score-table">
          <thead>
            <tr>
              <th>Batter</th>
              <th></th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            {batsmen.map((b) => (
              <tr key={b.id}>
                <td>{b.name ?? '—'}</td>
                <td className="score-table__dismissal">{b.outdec ?? ''}</td>
                <td>{b.runs ?? '—'}</td>
                <td>{b.balls ?? '—'}</td>
                <td>{b.fours ?? '—'}</td>
                <td>{b.sixes ?? '—'}</td>
                <td>{b.strkrate ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {extras && (
        <p className="extras-line">
          Extras: {extras.total} (b {extras.byes}, lb {extras.legbyes}, w {extras.wides}, nb {extras.noballs})
        </p>
      )}

      {bowlers.length > 0 && (
        <table className="score-table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
            </tr>
          </thead>
          <tbody>
            {bowlers.map((b) => (
              <tr key={b.id}>
                <td>{b.name ?? '—'}</td>
                <td>{b.overs ?? '—'}</td>
                <td>{b.maidens ?? '—'}</td>
                <td>{b.runs ?? '—'}</td>
                <td>{b.wickets ?? '—'}</td>
                <td>{b.economy ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
