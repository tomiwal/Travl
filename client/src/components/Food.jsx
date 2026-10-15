import { money } from "../format.js";
import { useItinerary } from "../useItinerary.js";

const LEVEL_NAMES = { budget: "Budget", standard: "Comfortable", splurge: "Splurge" };

export default function Food({ trip, level }) {
  const itinerary = useItinerary(trip.destination.id);
  const m = trip.food.perMeal[level];
  const { travelers, nights } = trip.query;
  return (
    <section>
      <p className="muted">
        {LEVEL_NAMES[level]} eating in {trip.destination.city}, per person. Change the level on the Trip cost tab.
      </p>
      <div className="meal-grid">
        <div className="meal"><span className="muted">Breakfast</span><strong>{money(m.breakfast)}</strong></div>
        <div className="meal"><span className="muted">Lunch</span><strong>{money(m.lunch)}</strong></div>
        <div className="meal"><span className="muted">Dinner</span><strong>{money(m.dinner)}</strong></div>
      </div>
      <div className="callout">
        <strong>Food for your trip: about {money(trip.food.totals[level])}</strong>
        <p className="muted">{nights} full days of three meals, plus an arrival dinner and a departure breakfast, for {travelers} traveler{travelers > 1 ? "s" : ""}.</p>
      </div>

      <h3>Where to eat</h3>
      {trip.places.food.map((p) => {
        const added = itinerary.items.some((x) => x.name === p.name);
        return (
          <div className="place" key={p.name}>
            <div>
              <b>{p.name}</b> <span className="tier" title="Price tier">{"$".repeat(p.tier)}</span>
              <span className="muted"> · best for {p.meal}</span>
            </div>
            <button className="btn-small" disabled={added} onClick={() => itinerary.add(p)}>{added ? "Added" : "+ Itinerary"}</button>
          </div>
        );
      })}
    </section>
  );
}
