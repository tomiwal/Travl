import { useEffect, useState } from "react";
import DateInsights from "./components/DateInsights.jsx";
import Explore from "./components/Explore.jsx";
import Food from "./components/Food.jsx";
import Ground from "./components/Ground.jsx";
import Itinerary from "./components/Itinerary.jsx";
import { Bundles, Flights, Stays } from "./components/Offers.jsx";
import TripCost from "./components/TripCost.jsx";
import { money, prettyDate } from "./format.js";

const EXAMPLES = [
  "I'm in California, I want a trip to New York",
  "Beach weekend from Chicago under $1200, love seafood",
  "5 days in Tokyo from Seattle, ramen and temples",
  "Cheap romantic getaway in Europe with great food",
];

const TABS = [
  ["flights", "Flights"],
  ["stays", "Stays"],
  ["bundles", "Bundles"],
  ["dates", "Best time to fly"],
  ["rides", "Rides"],
  ["food", "Food"],
  ["cost", "Trip cost"],
  ["explore", "Explore"],
  ["itinerary", "Itinerary"],
];

const tomorrow = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export default function App() {
  const [mode, setMode] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const [places, setPlaces] = useState({ origins: [], destinations: [] });
  const [form, setForm] = useState({ origin: "losangeles", destination: "", depart: "", nights: 5, travelers: 1, budget: "", level: "standard", likes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("flights");
  const [level, setLevel] = useState("standard");

  useEffect(() => {
    fetch("/api/places").then((r) => r.json()).then(setPlaces).catch(() => {});
  }, []);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function runSearch(payload) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setPlan(data);
      setSelected(0);
      setTab("flights");
      setLevel(data.parsed.level);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function searchPrompt(text) {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setPrompt(q);
    runSearch({ prompt: q });
  }

  function searchForm(e) {
    e.preventDefault();
    runSearch({
      origin: form.origin,
      destination: form.destination || undefined,
      depart: form.depart || undefined,
      nights: Number(form.nights),
      travelers: Number(form.travelers),
      budget: form.budget ? Number(form.budget) : undefined,
      level: form.level,
      prompt: form.likes,
    });
  }

  async function changeDate(date) {
    const t = plan.trips[selected];
    const q = new URLSearchParams({ dest: t.destination.id, origin: t.query.originId, depart: date, nights: t.query.nights, travelers: t.query.travelers, level });
    if (t.query.budget) q.set("budget", t.query.budget);
    const res = await fetch(`/api/trip?${q}`);
    if (!res.ok) return;
    const trip = await res.json();
    setPlan({ ...plan, trips: plan.trips.map((x, i) => (i === selected ? trip : x)) });
    setTab("flights");
  }

  const trip = plan?.trips[selected];
  const allIn = (t) => t.trueCost[level].total;

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <span className="logo">Travl</span>
          <span className="tagline">The real cost of the whole trip, not just the flight</span>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <h1>Where to next?</h1>
          <p>Describe your trip, or pick where you're flying from and to.</p>
          <div className="modes" role="tablist">
            <button role="tab" aria-selected={mode === "prompt"} className={mode === "prompt" ? "active" : ""} onClick={() => setMode("prompt")}>Describe it</button>
            <button role="tab" aria-selected={mode === "form"} className={mode === "form" ? "active" : ""} onClick={() => setMode("form")}>Pick cities</button>
          </div>

          {mode === "prompt" ? (
            <>
              <form className="searchbox" onSubmit={(e) => { e.preventDefault(); searchPrompt(); }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); searchPrompt(); } }}
                  placeholder="e.g. I'm in California, 5 days in New York, love bagels and museums, under $2000"
                  rows={2}
                  maxLength={500}
                />
                <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
              </form>
              <div className="chips">
                {EXAMPLES.map((ex) => <button key={ex} className="chip" onClick={() => searchPrompt(ex)}>{ex}</button>)}
              </div>
            </>
          ) : (
            <form className="planform" onSubmit={searchForm}>
              <label className="span3">Flying from
                <select value={form.origin} onChange={setField("origin")}>
                  {places.origins.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </label>
              <label className="span3">Going to
                <select value={form.destination} onChange={setField("destination")}>
                  <option value="">Surprise me (use my interests)</option>
                  {places.destinations.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </label>
              <label className="span2">Leave on
                <input type="date" min={tomorrow()} value={form.depart} onChange={setField("depart")} />
              </label>
              <label>Nights
                <input type="number" min="1" max="30" value={form.nights} onChange={setField("nights")} />
              </label>
              <label>Travelers
                <input type="number" min="1" max="9" value={form.travelers} onChange={setField("travelers")} />
              </label>
              <label>Budget ($)
                <input type="number" min="50" placeholder="optional" value={form.budget} onChange={setField("budget")} />
              </label>
              <label className="span2">Comfort level
                <select value={form.level} onChange={setField("level")}>
                  <option value="budget">Budget</option>
                  <option value="standard">Comfortable</option>
                  <option value="splurge">Splurge</option>
                </select>
              </label>
              <label className="span3">What do you like? (optional)
                <input type="text" maxLength={200} placeholder="beaches, tacos, hiking, nightlife" value={form.likes} onChange={setField("likes")} />
              </label>
              <label className="span3">&nbsp;<span className="muted" style={{ textTransform: "none", fontWeight: 400 }}>Leave the date blank and Travl picks the cheapest day to fly.</span></label>
              <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
            </form>
          )}
        </div>
      </section>

      <main className="wrap">
        {error && <div className="alert" role="alert">{error}</div>}

        {plan && (
          <>
            {plan.parsed.notes.map((n) => <div className="note" key={n}>{n}</div>)}
            <div className="summary">
              Flying from <b>{plan.parsed.origin.label}</b>{plan.parsed.originAssumed && " (assumed, use Pick cities to set it)"} · {plan.parsed.nights} nights · {plan.parsed.travelers} traveler{plan.parsed.travelers > 1 ? "s" : ""}
              {plan.parsed.budget && <> · budget <b>{money(plan.parsed.budget)}</b></>}
              {plan.parsed.interests.length > 0 && <> · likes: {plan.parsed.interests.join(", ")}</>}
              {plan.parsed.foodPrefs.length > 0 && <> · food: {plan.parsed.foodPrefs.join(", ")}</>}
            </div>

            <div className="dest-row">
              {plan.trips.map((t, i) => (
                <button key={t.destination.id} className={`dest-card ${i === selected ? "active" : ""}`} onClick={() => { setSelected(i); setTab("flights"); }}>
                  <strong>{t.destination.city}, {t.destination.country}</strong>
                  <span className="muted">{t.domestic ? "Domestic flight" : "International flight"} · {t.destination.blurb}</span>
                  <span className="price">{money(allIn(t))} <small>all-in trip cost</small></span>
                  {plan.parsed.budget && <span className={allIn(t) <= plan.parsed.budget ? "ok" : "over"}>{allIn(t) <= plan.parsed.budget ? "Within budget" : `${money(allIn(t) - plan.parsed.budget)} over budget`}</span>}
                </button>
              ))}
            </div>

            <div className="trip-head">
              <div>
                <h2>{trip.query.originCity} to {trip.destination.city}: {prettyDate(trip.query.depart)} to {prettyDate(trip.query.ret)}</h2>
                <p className="muted">
                  {trip.domestic ? "Domestic" : "International"} · {trip.distanceKm.toLocaleString()} km · dates picked from the cheapest day to fly.
                  {trip.dataSources.flights === "live" ? " Live fares from Amadeus." : " Prices are estimated by a fare-pattern model (add API keys for live fares)."}
                </p>
                {trip.weather && (
                  <div className="weather">
                    {trip.weather.slice(0, 5).map((w) => <span key={w.date}>{prettyDate(w.date, true)}: {w.high}°/{w.low}°F · {w.rainChance ?? 0}% rain</span>)}
                  </div>
                )}
              </div>
              <button className="allin" onClick={() => setTab("cost")} style={{ border: 0, cursor: "pointer" }}>
                <small>All-in trip cost</small>
                <strong>{money(allIn(trip))}</strong>
                <small>flights, stay, rides, food</small>
              </button>
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
            {tab === "rides" && <Ground trip={trip} />}
            {tab === "food" && <Food trip={trip} level={level} />}
            {tab === "cost" && <TripCost trip={trip} level={level} setLevel={setLevel} budget={plan.parsed.budget} />}
            {tab === "explore" && <Explore trip={trip} foodPrefs={plan.parsed.foodPrefs} />}
            {tab === "itinerary" && <Itinerary trip={trip} />}
          </>
        )}

        {!plan && !loading && (
          <section className="how">
            <div><b>1. Say where</b><p>Type it naturally, or pick your departure city and destination.</p></div>
            <div><b>2. Compare everything</b><p>Flights, stays and bundles across Skyscanner, Google, Kayak, Expedia and more, plus the cheapest day to fly.</p></div>
            <div><b>3. See the real total</b><p>Uber, Lyft and local ride apps for every airport leg, daily food costs, and one all-in number.</p></div>
          </section>
        )}
      </main>
      <footer className="wrap foot">Portfolio project. Prices are estimates unless marked live. Booking happens on partner sites.</footer>
    </>
  );
}
