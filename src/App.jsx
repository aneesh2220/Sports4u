import { Routes, Route } from 'react-router-dom'
import ScoresPage from './pages/ScoresPage.jsx'
import MatchPage from './pages/MatchPage.jsx'
import AdSlot from './components/AdSlot.jsx'

export default function App() {
  return (
    <div className="page-frame">
      <AdSlot variant="top" label="Ad space — 728×90" />

      <div className="page-frame__middle">
        <AdSlot variant="rail-left" label="Ad space — 160×600" />

        <div className="page-frame__content">
          <Routes>
            <Route path="/" element={<ScoresPage />} />
            <Route path="/match/:id" element={<MatchPage />} />
          </Routes>
        </div>

        <AdSlot variant="rail-right" label="Ad space — 160×600" />
      </div>

      <AdSlot variant="bottom" label="Ad space — 728×90" />
    </div>
  )
}
