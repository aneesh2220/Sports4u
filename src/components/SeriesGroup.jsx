import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import MatchRow from './MatchRow.jsx'

export default function SeriesGroup({ series }) {
  const [open, setOpen] = useState(true)

  return (
    <section className="series-group">
      <button className="series-group__head" onClick={() => setOpen((o) => !o)}>
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        <span>{series.seriesName}</span>
      </button>
      {open && (
        <div className="series-group__rows">
          {series.matches.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </section>
  )
}
