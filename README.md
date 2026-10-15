# Travl

A travel comparison and trip-planning site. Describe a trip in plain English ("5 days in Lisbon from Miami, love pastries and nightlife, under $2000") and get:

- **Flight, stay and bundle comparison** across Skyscanner, Google Flights, Kayak, Expedia, Momondo, Kiwi.com, Booking.com and Hotels.com, with deep links that open each site pre-filled with your dates.
- **Cheapest-day analysis**: best weekday, time of day and booking window, plus the cheapest departure dates (click one to re-search).
- **Explore + itinerary builder**: attractions and food spots, arranged by day on an interactive map (saved in your browser, no accounts).
- 7-day weather forecast from Open-Meteo.

## Stack
React + Vite + Leaflet (client), Node.js + Express (server).

## Run it
Requires Node 18+.

```bash
cd server && npm install && npm run dev
```

```bash
cd client && npm install && npm run dev
```

Open http://localhost:5173.

## Live data
Without keys the app uses a deterministic fare-pattern model (midweek departures, 6-8 week booking window, seasonality) so the UI is fully demoable. For live flight fares, get free keys at https://developers.amadeus.com/self-service, copy `server/.env.example` to `server/.env`, and fill them in. The app then uses Amadeus Flight Offers and Flight Cheapest Date Search and labels results as live.

## Notes
- No scraping: booking sites prohibit it in their terms. The app uses public APIs and outbound deep links instead.
- Hotel prices are modeled; Amadeus hotel search can be added in `server/src/providers/`.
- Deep-link URL formats for third-party sites can change; they live in `server/src/services/links.js`.
