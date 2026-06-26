const DAYS = ['Yesterday', 'Today', 'Tomorrow']

export default function DateStrip({ filter, onFilterChange }) {
  return (
    <div className="date-strip">
      <button
        className={`date-strip__live ${filter === 'live' ? 'is-active' : ''}`}
        onClick={() => onFilterChange('live')}
      >
        <span className="live-dot" />
        LIVE
      </button>
      {DAYS.map((day) => (
        <button
          key={day}
          className={`date-strip__day ${filter === day ? 'is-active' : ''}`}
          onClick={() => onFilterChange(day)}
        >
          {day}
        </button>
      ))}
    </div>
  )
}
