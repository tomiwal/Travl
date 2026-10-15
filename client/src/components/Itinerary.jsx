import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { useItinerary } from "../useItinerary.js";

const DAY_COLORS = ["#0057b8", "#e4572e", "#2a9d8f", "#9b5de5", "#f4a261", "#e63946", "#118ab2"];

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Itinerary({ trip }) {
  const { items, remove, move, clear } = useItinerary(trip.destination.id);
  const days = Array.from({ length: trip.query.nights }, (_, i) => i + 1);
  const center = [trip.destination.lat, trip.destination.lng];
  const color = (d) => DAY_COLORS[(d - 1) % DAY_COLORS.length];

  return (
    <section className="grid2 itin">
      <div>
        <div className="itin-head">
          <h3>Your {trip.destination.city} itinerary</h3>
          {items.length > 0 && <button className="btn-small" onClick={clear}>Clear all</button>}
        </div>
        {items.length === 0 && <p className="muted">Nothing here yet. Add places from the Explore tab.</p>}
        {days.map((d) => {
          const dayItems = items.filter((x) => Math.min(x.day, days.length) === d);
          if (!dayItems.length) return null;
          return (
            <div key={d} className="day">
              <b style={{ color: color(d) }}>Day {d}</b>
              {dayItems.map((p) => (
                <div className="place" key={p.name}>
                  <span>{p.name}</span>
                  <span>
                    <select aria-label={`Day for ${p.name}`} value={Math.min(p.day, days.length)} onChange={(e) => move(p.name, Number(e.target.value))}>
                      {days.map((n) => <option key={n} value={n}>Day {n}</option>)}
                    </select>
                    <button className="btn-small" onClick={() => remove(p.name)} aria-label={`Remove ${p.name}`}>✕</button>
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="map">
        <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: "100%", minHeight: 360 }}>
          <Recenter center={center} />
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {days.map((d) => {
            const pts = items.filter((x) => Math.min(x.day, days.length) === d).map((x) => [x.lat, x.lng]);
            return pts.length > 1 ? <Polyline key={d} positions={pts} pathOptions={{ color: color(d), weight: 3, dashArray: "6" }} /> : null;
          })}
          {items.map((p) => (
            <CircleMarker key={p.name} center={[p.lat, p.lng]} radius={9} pathOptions={{ color: "#fff", weight: 2, fillColor: color(Math.min(p.day, days.length)), fillOpacity: 1 }}>
              <Popup>{p.name}<br />Day {Math.min(p.day, days.length)}</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
