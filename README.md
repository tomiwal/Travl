# Travl

**Live demo: https://travl-nine.vercel.app**

A travel comparison and trip-planning site that shows the **real cost of the whole trip**, not just the flight. Describe a trip in plain English ("I'm in California, I want a trip to New York") or pick your departure city and destination, and get:

- **Flight, stay and bundle comparison** across Skyscanner, Google Flights, Kayak, Expedia, Momondo, Kiwi.com, Booking.com and Hotels.com, with deep links that open each site pre-filled with your dates. Domestic and international routes are priced by distance.
- **Cheapest-day analysis**: best weekday, time of day and booking window, plus the cheapest departure dates (click one to re-search).
- **Rides**: Uber, Lyft and the local ride apps for each region (Grab and Gojek in Bali, Bolt and FREE NOW in Europe, Careem in Dubai, and so on) for all four airport legs and for getting to each place on your list. Prices account for time-of-day rush pricing, and public-transit alternatives are shown where they exist.
- **Food**: breakfast, lunch and dinner costs at Budget, Comfortable and Splurge levels, plus restaurant picks with price tiers.
- **Trip cost**: one all-in number (flights + stay + airport rides + local rides + food) checked against your budget, with ways to spend less.
- **Explore + itinerary builder**: attractions and food spots arranged by day on an interactive map (saved in your browser, no accounts).
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

## Deploy (Vercel)
One Vercel project runs two services, defined in `vercel.json`: `client` (Vite) and `server` (Express), with `/api/*` routed to the server. Import this repo at vercel.com/new and keep the defaults. Optional: add `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET` as environment variables for live fares.

## Logo font
The logo uses Vergilia by Attract Studio. Add the font file to `client/public/fonts/` (see the README there). Without it the logo falls back to a serif font.

## Live data
Without keys the app uses a deterministic fare-pattern model (midweek departures, 6-8 week booking window, seasonality) so the UI is fully demoable. For live flight fares, get free keys at https://developers.amadeus.com/self-service, copy `server/.env.example` to `server/.env`, and fill them in. The app then uses Amadeus Flight Offers and Flight Cheapest Date Search and labels results as live.

## Notes
- No scraping: booking sites prohibit it in their terms. The app uses public APIs and outbound deep links instead.
- Hotel, ride and food prices are modeled estimates from regional cost levels, not live quotes. Real ride fares vary with demand.
- Deep-link URL formats for third-party sites can change; they live in `server/src/services/links.js`.
- City data, ride apps and cost levels are in `server/src/data/destinations.js` and `server/src/services/ground.js`.
