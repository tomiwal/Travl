import { useState } from "react";
import DateInsights from "./components/DateInsights.jsx";
import Explore from "./components/Explore.jsx";
import Itinerary from "./components/Itinerary.jsx";
import { Bundles, Flights, Stays } from "./components/Offers.jsx";
import { money, prettyDate } from "./format.js";

const EXAMPLES = [
  "Beach trip from NYC under $1500, love seafood and snorkeling",
  "5 days in Tokyo from Chicago, ramen and temples",
  "Cheap romantic getaway in Europe with great food",
  "Hiking and nature for 2 people from Atlanta",
];

const TABS = [
  ["flights", "Flights"],
  ["stays", "Stays"],
  ["bundles", "Bundles"],
  ["dates", "Best time to fly"],
  ["explore", "Explore"],
  ["itinerary", "Itinerary"],
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("flights");

  async function search(text) {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setPrompt(q);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: q }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setPlan(data);
      setSelected(0);
      setTab("flights");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function changeDate(date) {
    const t = plan.trips[selected];
    const q = new URLSearchParams({ dest: t.destination.id, origin: t.query.origin, originCity: t.query.originCity, depart: date, nights: t.query.nights, travelers: t.query.travelers });
    if (t.query.budget) q.set("budget", t.query.budget);
    const res = await fetch(`/api/trip?${q}`);
    if (!res.ok) return;
    const trip = await res.json();
    setPlan({ ...plan, trips: plan.trips.map((x, i) => (i === selected ? trip : x)) });
    setTab("flights");
  }

  const trip = plan?.trips[selected];

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <span className="logo">Travl</span>
          <span className="tagline">Compare every booking site in one place</span>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <h1>Where to next?</h1>
          <p>Describe your dream trip. Where, what you like to do, what you like to eat.</p>
          <form className="searchbox" onSubmit={(e) => { e.preventDefault(); search(); }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); search(); } }}
              placeholder="e.g. 5 days in Lisbon from Miami, love pastries and nightlife, under $2000"
              rows={2}
              maxLength={500}
            />
            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          </form>
          <div className="chips">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="chip" onClick={() => search(ex)}>{ex}</button>
            ))}
          </div>
        </div>
      </section>

      <main className="wrap">
        {error && <div className="alert">{error}</div>}

        {plan && (
          <>
            <div className="summary">
              Flying from <b>{plan.parsed.origin.city}</b>{plan.parsed.origin.assumed && " (assumed, add \"from <city>\" to change)"} · {plan.parsed.nights} nights · {plan.parsed.travelers} traveler{plan.parsed.travelers > 1 ? "s" : ""}
              {plan.parsed.budget && <> · budget <b>{money(plan.parsed.budget)}</b></>}
              {plan.parsed.interests.length > 0 && <> · likes: {plan.parsed.interests.join(", ")}</>}
              {plan.parsed.foodPrefs.length > 0 && <> · food: {plan.parsed.foodPrefs.join(", ")}</>}
            </div>

            <div className="dest-row">
              {plan.trips.map((t, i) => (
                <button key={t.destination.id} className={`dest-card ${i === selected ? "active" : ""}`} onClick={() => { setSelected(i); setTab("flights"); }}>
                  <strong>{t.destination.city}, {t.destination.country}</strong>
                  <span className="muted">{t.destination.blurb}</span>
                  <span className="price">from {money(t.estimatedTotal)} <small>est. total</small></span>
                  {plan.parsed.budget && <span className={t.estimatedTotal <= plan.parsed.budget ? "ok" : "over"}>{t.estimatedTotal <= plan.parsed.budget ? "Within budget" : "Over budget"}</span>}
                </button>
              ))}
            </div>

            <div className="trip-head">
              <h2>{trip.destination.city}: {prettyDate(trip.query.depart)} to {prettyDate(trip.query.ret)}</h2>
              <p className="muted">
                Dates auto-picked from the cheapest day to fly.
                {trip.dataSources.flights === "live" ? " Live fares from Amadeus." : " Prices are estimated by a fare-pattern model (add API keys for live fares)."}
              </p>
              {trip.weather && (
                <div className="weather">
                  {trip.weather.slice(0, 5).map((w) => (
                    <span key={w.date}>{prettyDate(w.date, true)}: {w.high}°/{w.low}°F · {w.rainChance ?? 0}% rain</span>
                  ))}
                </div>
              )}
            </div>

            <nav className="tabs" role="tablist">
              {TABS.map(([key, label]) => (
                <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>
              ))}
            </nav>

            {tab === "flights" && <Flights trip={trip} />}
            {tab === "stays" && <Stays trip={trip} />}
            {tab === "bundles" && <Bundles trip={trip} />}
            {tab === "dates" && <DateInsights trip={trip} onPick={changeDate} />}
            {tab === "explore" && <Explore trip={trip} foodPrefs={plan.parsed.foodPrefs} />}
            {tab === "itinerary" && <Itinerary trip={trip} />}
          </>
        )}

        {!plan && !loading && (
          <section className="how">
            <div><b>1. Describe</b><p>Type where you want to go, what you enjoy, and what you like to eat.</p></div>
            <div><b>2. Compare</b><p>See the cheapest flights, stays and bundles across Skyscanner, Google, Kayak, Expedia and more.</p></div>
            <div><b>3. Book smart</b><p>Find the cheapest day to fly, then jump straight to the booking site with your search pre-filled.</p></div>
          </section>
        )}
      </main>
      <footer className="wrap foot">Portfolio project. Prices shown are estimates unless marked live. Booking happens on partner sites.</footer>
    </>
  );
}
