import { money } from "../format.js";

const LEVELS = [["budget", "Budget"], ["standard", "Comfortable"], ["splurge", "Splurge"]];

export default function TripCost({ trip, level, setLevel, budget }) {
  const cost = trip.trueCost[level];
  const { travelers, nights } = trip.query;
  const lines = cost.lines;
  const budgetTotal = trip.trueCost.budget.total;
  const tips = [];

  if (level !== "budget" && cost.total - budgetTotal > 50) tips.push(`The Budget level would save about ${money(cost.total - budgetTotal)} (cheapest stay, lighter food and fewer rides).`);
  if (trip.ground.transitSavings > 20) tips.push(`Taking ${trip.ground.airportLegs[1].transitAlt.name} from the airport instead of a car saves about ${money(trip.ground.transitSavings)} each way.`);
  const cheapestApp = trip.ground.airportLegs[1].cheapest.name;
  tips.push(`${cheapestApp} is the cheapest ride from the airport at the time you land. Compare apps before you book it.`);
  if (trip.insights.cheapestWeekday) tips.push(`Flying on a ${trip.insights.cheapestWeekday} is typically ${trip.insights.weekdaySavingsPct}% cheaper than a ${trip.insights.priciestWeekday}.`);

  return (
    <section>
      <div className="levels" role="group" aria-label="Comfort level">
        {LEVELS.map(([key, label]) => (
          <button key={key} className={level === key ? "active" : ""} aria-pressed={level === key} onClick={() => setLevel(key)}>{label}</button>
        ))}
      </div>

      <article className="card">
        <div className="stack" aria-hidden="true">
          {lines.map((l) => <div key={l.key} className={`c-${l.key}`} style={{ width: `${(l.amount / cost.total) * 100}%` }} title={l.label} />)}
        </div>
        {lines.map((l) => (
          <div className="cost-line" key={l.key}>
            <i className={`c-${l.key}`} />
            <span>{l.label}</span>
            <span className="muted">{Math.round((l.amount / cost.total) * 100)}%</span>
            <b>{money(l.amount)}</b>
          </div>
        ))}
        <div className="cost-total"><span>All-in total</span><span>{money(cost.total)}</span></div>
        <p className="muted">
          About {money(cost.total / (nights + 1))} per day, {money(cost.total / travelers)} per person · {nights} nights, {travelers} traveler{travelers > 1 ? "s" : ""}.
        </p>
        {budget && (
          cost.total <= budget
            ? <p className="ok">{money(budget - cost.total)} under your {money(budget)} budget.</p>
            : <p className="over">{money(cost.total - budget)} over your {money(budget)} budget.{budgetTotal <= budget ? " The Budget level fits." : " Even the Budget level is over, so try other dates or a closer destination."}</p>
        )}
      </article>

      <h3>Ways to spend less</h3>
      <ul className="tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
      <p className="muted">Flights are the cheapest fare found. Rides and food are estimates from regional price levels, so use this as a planning number.</p>
    </section>
  );
}
