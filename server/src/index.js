import "dotenv/config";
import cors from "cors";
import express from "express";
import { DESTINATIONS, PLACES, findDestination, findPlace, placeLabel } from "./data/destinations.js";
import { amadeusEnabled } from "./providers/amadeus.js";
import { parsePrompt } from "./services/prompt.js";
import { buildTrip } from "./services/trip.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));

const LEVELS = ["budget", "standard", "splurge"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const clampInt = (v, min, max, fallback) => Math.min(Math.max(Math.round(Number(v)) || fallback, min), max);

app.get("/api/health", (_req, res) => res.json({ ok: true, liveFlights: amadeusEnabled() }));

app.get("/api/places", (_req, res) =>
  res.json({
    origins: PLACES.map((p) => ({ id: p.id, label: placeLabel(p) })).sort((a, b) => a.label.localeCompare(b.label)),
    destinations: DESTINATIONS.map((d) => ({ id: d.id, label: placeLabel(d), domestic: d.country === "USA" })).sort((a, b) => a.label.localeCompare(b.label)),
  })
);

// Accepts a free-text prompt, explicit form fields, or both. Explicit fields win over the prompt.
app.post("/api/plan", async (req, res) => {
  try {
    const body = req.body || {};
    const prompt = String(body.prompt || "").slice(0, 500);
    const hasForm = body.origin || body.destination;
    if (!prompt.trim() && !hasForm) return res.status(400).json({ error: "Tell us where you want to go or what you like." });

    const parsed = parsePrompt(prompt);
    if (body.origin) {
      if (!findPlace(body.origin)) return res.status(400).json({ error: "Unknown departure city." });
      parsed.originId = body.origin;
      parsed.originAssumed = false;
    }
    if (body.destination) {
      if (!findDestination(body.destination)) return res.status(400).json({ error: "Unknown destination." });
      parsed.destinations = [body.destination];
      parsed.namedExplicitly = true;
    }
    if (body.nights) parsed.nights = clampInt(body.nights, 1, 30, 5);
    if (body.travelers) parsed.travelers = clampInt(body.travelers, 1, 9, 1);
    if (body.budget) parsed.budget = clampInt(body.budget, 50, 1000000, null) || parsed.budget;
    if (LEVELS.includes(body.level)) parsed.level = body.level;
    const depart = ISO_DATE.test(body.depart) ? body.depart : undefined;

    parsed.destinations = parsed.destinations.filter((id) => id !== parsed.originId);
    if (!parsed.destinations.length) return res.status(400).json({ error: "Pick a destination different from your departure city." });

    const origin = findPlace(parsed.originId);
    const trips = await Promise.all(
      parsed.destinations.map((destId) =>
        buildTrip({ destId, originId: parsed.originId, depart, nights: parsed.nights, travelers: parsed.travelers, budget: parsed.budget, level: parsed.level })
      )
    );
    res.json({ parsed: { ...parsed, origin: { id: origin.id, city: origin.city, iata: origin.iata, label: placeLabel(origin) } }, trips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong planning that trip." });
  }
});

app.get("/api/trip", async (req, res) => {
  try {
    const { dest, origin, depart, nights, travelers, budget, level } = req.query;
    const trip = await buildTrip({
      destId: String(dest),
      originId: String(origin),
      depart: ISO_DATE.test(depart) ? depart : undefined,
      nights: clampInt(nights, 1, 30, 5),
      travelers: clampInt(travelers, 1, 9, 1),
      budget: budget ? Number(budget) : null,
      level: LEVELS.includes(level) ? level : "standard",
    });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Travl API on http://localhost:${port} (live flights: ${amadeusEnabled()})`));
