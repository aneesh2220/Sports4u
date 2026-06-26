// Placeholder ad unit. To go live later: delete the placeholder <div> below
// and paste your ad network's script/tag in its place (e.g. an AdSense
// <ins> tag, or a Google Ad Manager div + script). Keep the outer
// <div className={`ad-slot ad-slot--${variant}`}> wrapper — that's what
// controls sizing and position in index.css.
export default function AdSlot({ variant, label }) {
  return (
    <div className={`ad-slot ad-slot--${variant}`}>
      <span className="ad-slot__label">{label}</span>
    </div>
  )
}
