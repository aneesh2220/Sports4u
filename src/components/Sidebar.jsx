export default function Sidebar({ seriesList, activeSeriesId, onSelect }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar__title">Competitions</h3>
      <button
        className={`sidebar__item ${activeSeriesId === null ? 'is-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All matches
      </button>
      {seriesList.map((s) => (
        <button
          key={s.seriesId ?? s.seriesName}
          className={`sidebar__item ${activeSeriesId === s.seriesId ? 'is-active' : ''}`}
          onClick={() => onSelect(s.seriesId)}
        >
          {s.seriesName}
        </button>
      ))}
    </aside>
  )
}
