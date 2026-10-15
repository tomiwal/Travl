import { money, prettyDate } from "../format.js";

function Bars({ rows, label, value, highlight }) {
  const vals = rows.map((r) => value(r)).filter(Boolean);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return (
    <div className="bars">
      {rows.map((r) => {
        const v = value(r);
        const pct = v ? 35 + ((v - min) / Math.max(max - min, 1)) * 65 : 0;
        return (
          <div className="bar-row" key={label(r)}>
            <span className="bar-label">{label(r)}</span>
            <div className="bar-track"><div className={`bar ${highlight(r) ? "low" : ""}`} style={{ width: `${pct}%` }} /></div>
            <span className="bar-val">{money(v)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DateInsights({ trip, onPick }) {
  const i = trip.insights;
  const cheapestTime = [...i.timeOfDay].sort((a, b) => a.price - b.price)[0];
  return (
    <section className="insights">
      <div className="callout">
        <strong>Fly on a {i.cheapestWeekday}.</strong> Over the next 90 days, {i.cheapestWeekday} departures average about {i.weekdaySavingsPct}% less than {i.priciestWeekday}s.
        Booking around <b>{i.bestBookingWindowWeeks} weeks</b> ahead is the cheapest window, and <b>{cheapestTime.label.toLowerCase()}</b> flights run cheapest.
        <p className="muted">{i.source === "live" ? "Based on live cheapest-date fares from Amadeus." : "Based on typical fare patterns (model). Add Amadeus keys for live cheapest-date data."}</p>
      </div>

      <h3>Cheapest dates to depart</h3>
      <div className="date-chips">
        {i.cheapestDates.map((d) => (
          <button key={d.date} className={`date-chip ${d.date === trip.query.depart ? "active" : ""}`} onClick={() => onPick(d.date)}>
            <b>{prettyDate(d.date)}</b>
            <span>{money(d.price)}</span>
          </button>
        ))}
      </div>
      <p className="muted">Click a date to re-run the search for that departure.</p>

      <div className="grid2">
        <div>
          <h3>Average fare by day of week</h3>
          <Bars rows={i.byWeekday} label={(r) => r.weekday.slice(0, 3)} value={(r) => r.avg} highlight={(r) => r.weekday === i.cheapestWeekday} />
        </div>
        <div>
          <h3>Average fare by time of day</h3>
          <Bars rows={i.timeOfDay} label={(r) => r.label.split(" (")[0]} value={(r) => r.price} highlight={(r) => r.label === cheapestTime.label} />
        </div>
      </div>

      <h3>Fare by weeks until departure</h3>
      <Bars rows={i.byWeeksAhead} label={(r) => `${r.weeksAhead}w`} value={(r) => r.avg} highlight={(r) => r.weeksAhead === i.bestBookingWindowWeeks} />
    </section>
  );
}
