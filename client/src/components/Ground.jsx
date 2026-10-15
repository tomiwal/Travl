import { money } from "../format.js";

const hourLabel = (h) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;

function Leg({ leg, destCity }) {
  return (
    <article className="card">
      <div className="ride-head">
        <div>
          <h3>{leg.label}</h3>
          <p className="muted">
            ~{leg.km} km, ~{leg.minutes} min · pickup around {hourLabel(leg.hour)}
            {leg.surge >= 1.2 && " · rush-hour pricing"}
            {leg.vehicles > 1 && ` · ${leg.vehicles} cars for your group`}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="badge green">Cheapest: {leg.cheapest.name} ~{money(leg.cheapest.mid)}</span>
          <p className="muted">Save ~{money(leg.priciest.mid - leg.cheapest.mid)} vs {leg.priciest.name}</p>
        </div>
      </div>
      <table className="ride-table">
        <thead><tr><th>Service</th><th>Range</th><th>Estimate</th></tr></thead>
        <tbody>
          {leg.options.map((o, i) => (
            <tr key={o.name} className={i === 0 ? "best" : ""}>
              <td>{o.name}</td><td>{money(o.low)} to {money(o.high)}</td><td>{money(o.mid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leg.transitAlt && (
        <p className="note" style={{ marginTop: 10 }}>
          Cheaper option: {leg.transitAlt.name} is about {money(leg.transitAlt.cost)} per person (approx.), though slower than a car.
        </p>
      )}
      {leg.links.length > 0 && (
        <div className="linkrow" style={{ marginTop: 8 }}>
          {leg.links.map((l) => <a key={l.app} className="btn-link" href={l.url} target="_blank" rel="noopener noreferrer">Open {l.app} to {destCity} ↗</a>)}
        </div>
      )}
    </article>
  );
}

export default function Ground({ trip }) {
  const g = trip.ground;
  return (
    <section>
      <div className="callout">
        <strong>Airport rides total about {money(g.airportTotal)}</strong> for all four legs using the cheapest option on each.
        <p className="muted">
          Apps that operate in {trip.destination.city}: {g.apps.join(", ")}. Fares assume today's typical rates and the time of day your flight implies; real prices move with demand, so treat these as a planning range.
        </p>
      </div>

      <h3>Getting to and from the airport</h3>
      {g.airportLegs.map((leg) => <Leg key={leg.id} leg={leg} destCity={trip.destination.city} />)}

      <h3>Getting around {trip.destination.city}</h3>
      <p className="muted">One-way rides from a central stay to each place in Explore (cheapest option). Average: {money(g.avgLocalRide)} per ride.</p>
      <article className="card">
        <div className="mini-rides">
          {g.placeLegs.map((l) => (
            <div key={l.id} style={{ display: "contents" }}>
              <span>{l.label.replace("Your stay to ", "")} <span className="muted">· {l.km} km</span></span>
              <span><b>{money(l.cheapest.mid)}</b> <span className="muted">({money(l.cheapest.low)} to {money(l.cheapest.high)}, {l.cheapest.name})</span></span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
