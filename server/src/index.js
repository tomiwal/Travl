import "dotenv/config";
import cors from "cors";
import express from "express";
import { DESTINATIONS } from "./data/destinations.js";
import { amadeusEnabled } from "./providers/amadeus.js";
import { parsePrompt } from "./services/prompt.js";
import { buildTrip } from "./services/trip.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, liveFlights: amadeusEnabled() }));

app.get("/api/destinations", (_req, res) =>
  res.json(DESTINATIONS.map(({ id, city, country, iata, blurb, tags }) => ({ id, city, country, iata, blurb, tags })))
);

app.post("/api/plan", async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || "").slice(0, 500);
    if (!prompt.trim()) return res.status(400).json({ error: "Tell us where you want to go or what you like." });
    const parsed = parsePrompt(prompt);
    const trips = await Promise.all(
      parsed.destinations.map((destId) =>
        buildTrip({ destId, origin: parsed.origin.iata, originCity: parsed.origin.city, nights: parsed.nights, travelers: parsed.travelers, budget: parsed.budget })
      )
    );
    res.json({ parsed, trips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong planning that trip." });
  }
});

app.get("/api/trip", async (req, res) => {
  try {
    const { dest, origin = "JFK", originCity = "New York", depart, nights = 5, travelers = 1, budget } = req.query;
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    const trip = await buildTrip({
      destId: String(dest),
      origin: String(origin).toUpperCase().slice(0, 3),
      originCity: String(originCity),
      depart: iso.test(depart) ? depart : undefined,
      nights: Math.min(Math.max(Number(nights) || 5, 1), 30),
      travelers: Math.min(Math.max(Number(travelers) || 1, 1), 9),
      budget: budget ? Number(budget) : null,
    });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Travl API on http://localhost:${port} (live flights: ${amadeusEnabled()})`));
