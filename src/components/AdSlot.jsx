// Placeholder ad unit. To go live later: delete the placeholder <div> below
// and paste your ad network's script/tag in its place (e.g. an AdSense
// <ins> tag, or a Google Ad Manager div + script). Keep the outer
// <div className={`ad-slot ad-slot--${variant}`}> wrapper — that's what
// controls sizing and position in index.css.
export default function AdSlot({ variant, label }) {
  return (
    <div className={`ad-slot ad-slot--${variant}`}>
   <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px 0",
        overflow: "hidden"

      }}
    >
     <img style={{ width: "100%", objectPosition: "center", height: "100%", objectFit: "cover" }} className="csk" src={"https://i.pinimg.com/1200x/76/05/59/7605590811772a965b802e9d9fce9212.jpg"}  alt="" />
    </div>
    </div>
  )
}
