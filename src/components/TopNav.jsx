import { Link } from 'react-router-dom'

const SPORTS = ['Football', 'Hockey', 'Basketball', 'Tennis', 'Cricket']

export default function TopNav() {
  return (
    <header className="topnav">
      <div className="topnav__row">
        <Link to="/" className="topnav__logo">
          ScoreLine
        </Link>
        <nav className="topnav__links">
          <Link to="/" className="topnav__link is-active">Scores</Link>
          <span className="topnav__link is-disabled" title="Not built in this version">News</span>
          <span className="topnav__link is-disabled" title="Not built in this version">Favourites</span>
        </nav>
      </div>
      <div className="topnav__sports">
        {SPORTS.map((sport) => (
          <span
            key={sport}
            className={`sport-tab ${sport === 'Cricket' ? 'is-active' : 'is-disabled'}`}
            title={sport === 'Cricket' ? undefined : 'Only cricket is wired up right now'}
          >
            {sport}
          </span>
        ))}
      </div>
    </header>
  )
}
