import { money } from "../format.js";

function LinkRow({ title, links }) {
  return (
    <div className="linkrow">
      <span className="muted">{title}</span>
      {links.map((l) => (
        <a key={l.site} href={l.url} target="_blank" rel="noopener noreferrer" className="btn-link">{l.site} ↗</a>
      ))}
    </div>
  );
}

function SitePrices({ prices }) {
  if (!prices?.length) return null;
  return (
    <div className="sites">
      {prices.map((p, i) => (
        <span key={p.site} className={i === 0 ? "site best" : "site"}>{p.site} {money(p.price)}</span>
      ))}
    </div>
  );
}

export function Flights({ trip }) {
  const { query } = trip;
  return (
    <section>
      <LinkRow title="Search these sites with your dates pre-filled:" links={trip.links.flights} />
      {trip.flights.map((f, i) => (
        <article className="card" key={f.id}>
          <div className="card-main">
            <div>
              {i === 0 && <span className="badge">Cheapest</span>}
              <h3>{f.airline}</h3>
              <p className="muted">{query.originCity} → {trip.destination.city} · departs {f.departTime} ({f.timeSlot}) · ~{f.durationHours}h · {f.stops === 0 ? "Nonstop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}</p>
              <SitePrices prices={f.priceBySite} />
            </div>
            <div className="card-price">
              <strong>{money(f.pricePerPerson)}</strong>
              <small>per person, round trip</small>
              {query.travelers > 1 && <small>{money(f.total)} total</small>}
              <small>best on {f.cheapestSite}</small>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function Stays({ trip }) {
  const { query } = trip;
  return (
    <section>
      <LinkRow title="Compare stays on:" links={trip.links.hotels} />
      {trip.hotels.map((h, i) => (
        <article className="card" key={h.id}>
          <div className="card-main">
            <div>
              {i === 0 && <span className="badge">Cheapest</span>}
              <h3>{h.name} <span className="stars" aria-label={`${h.stars} stars`}>{"★".repeat(h.stars)}</span></h3>
              <p className="muted">
                <span className="score">{h.rating}</span> · {h.distanceKm} km from center
                {h.freeCancel && " · Free cancellation"}{h.breakfast && " · Breakfast included"}
              </p>
              <SitePrices prices={h.priceBySite} />
            </div>
            <div className="card-price">
              <strong>{money(h.perNight)}</strong>
              <small>per night</small>
              <small>{money(h.perNight * query.nights)} for {query.nights} nights</small>
              <small>best on {h.cheapestSite}</small>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function Bundles({ trip }) {
  return (
    <section>
      <LinkRow title="Search package deals on:" links={trip.links.packages} />
      <p className="muted">Flight + stay combos ranked by total price. Package savings are estimated at about 7%; confirm on the partner site.</p>
      {trip.bundles.map((b, i) => (
        <article className="card" key={b.id}>
          <div className="card-main">
            <div>
              {i === 0 && <span className="badge">Best bundle</span>}
              {b.withinBudget === true && <span className="badge green">In budget</span>}
              {b.withinBudget === false && <span className="badge red">Over budget</span>}
              <h3>{b.flight.airline} + {b.hotel.name}</h3>
              <p className="muted">
                Flight {money(b.flight.pricePerPerson)}/person ({b.flight.departTime}, {b.flight.stops === 0 ? "nonstop" : `${b.flight.stops} stop`}) · {b.hotel.stars}★ stay at {money(b.hotel.perNight)}/night
              </p>
            </div>
            <div className="card-price">
              <strong>{money(b.bundleTotal)}</strong>
              <small>all-in estimate</small>
              <small className="ok">save ~{money(b.estSavings)}</small>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
