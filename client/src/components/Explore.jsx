import { useItinerary } from "../useItinerary.js";

function PlaceList({ title, places, itinerary }) {
  return (
    <div>
      <h3>{title}</h3>
      {places.map((p) => {
        const added = itinerary.items.some((x) => x.name === p.name);
        return (
          <div className="place" key={p.name}>
            <div>
              <b>{p.name}</b>
              <span className="muted"> · {p.type}</span>
            </div>
            <button className="btn-small" disabled={added} onClick={() => itinerary.add(p)}>{added ? "Added" : "+ Itinerary"}</button>
          </div>
        );
      })}
    </div>
  );
}

export default function Explore({ trip, foodPrefs }) {
  const itinerary = useItinerary(trip.destination.id);
  return (
    <section>
      {foodPrefs.length > 0 && <p className="muted">You mentioned: {foodPrefs.join(", ")}. Look for these at the spots below.</p>}
      <div className="grid2">
        <PlaceList title="Things to do" places={trip.places.attractions} itinerary={itinerary} />
        <PlaceList title="Food spots" places={trip.places.food} itinerary={itinerary} />
      </div>
      <p className="muted">Add places, then open the Itinerary tab to arrange them by day on the map.</p>
    </section>
  );
}
