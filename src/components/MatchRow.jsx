import { Link } from 'react-router-dom'

function stateClass(state) {
  const s = (state || '').toLowerCase()
  if (s.includes('live')) return 'is-live'
  if (s.includes('complete') || s.includes('result')) return 'is-final'
  return 'is-upcoming'
}

export default function MatchRow({ match }) {
  const cls = stateClass(match.state || match.status)

  return (
    <Link to={`/match/${match.id}`} className={`match-row ${cls}`}>
      <span className="match-row__bar">
        {cls === 'is-live' && <span className="match-row__ping" />}
      </span>
      <div className="match-row__teams">
        <div className="match-row__team">
          <span className="match-row__name">{match.team1.name}</span>
          <span className="match-row__score">{match.team1.score ?? '—'}</span>
        </div>
        <div className="match-row__team">
          <span className="match-row__name">{match.team2.name}</span>
          <span className="match-row__score">{match.team2.score ?? '—'}</span>
        </div>
      </div>
      <div className="match-row__meta">
        <span className="match-row__format">{match.format}</span>
        <span className="match-row__status">{match.status}</span>
      </div>
    </Link>
  )
}
