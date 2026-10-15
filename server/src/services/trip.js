import { findDestination, findPlace } from "../data/destinations.js";
import { amadeusEnabled, liveCheapestDates, liveFlightOffers } from "../providers/amadeus.js";
import { getForecast } from "../providers/weather.js";
import { distanceKm, fareBase, isDomestic } from "./geo.js";
import { buildFood, buildGround, buildTrueCost } from "./ground.js";
import { flightLinks, hotelLinks, packageLinks } from "./links.js";
import { addDays, analyzeDailyPrices, buildBundles, mockFlights, mockHotels, modelDailyPrices, today } from "./pricing.js";

async function getInsights({ origin, dest, flightBase, nights }) {
  const start = addDays(today(), 7);
  if (amadeusEnabled()) {
    try {
      const daily = await liveCheapestDates({ origin: origin.iata, dest: dest.iata, start, end: addDays(start, 90), nights });
      if (daily.length >= 14) return analyzeDailyPrices(daily.sort((a, b) => a.date.localeCompare(b.date)), "live");
    } catch (err) {
      console.warn("Live cheapest-dates failed, using price model:", err.message);
    }
  }
  return analyzeDailyPrices(modelDailyPrices({ origin: origin.iata, dest: dest.iata, flightBase, start }), "model");
}

export async function buildTrip({ destId, originId, depart, nights, travelers, budget, level }) {
  const dest = findDestination(destId);
  const origin = findPlace(originId);
  if (!dest) throw new Error("Unknown destination");
  if (!origin) throw new Error("Unknown departure city");
  if (origin.id === dest.id) throw new Error("Departure and destination are the same city");

  const km = distanceKm(origin, dest);
  const domestic = isDomestic(origin, dest);
  const flightBase = fareBase(origin, dest);

  const insights = await getInsights({ origin, dest, flightBase, nights });
  const chosenDepart = depart || insights.cheapestDates.find((d) => d.date >= addDays(today(), 14))?.date || insights.cheapestDates[0].date;
  const ret = addDays(chosenDepart, nights);

  let flights;
  let flightSource = "model";
  if (amadeusEnabled()) {
    try {
      flights = await liveFlightOffers({ origin: origin.iata, dest: dest.iata, depart: chosenDepart, ret, travelers });
      flightSource = "live";
    } catch (err) {
      console.warn("Live flights failed, using price model:", err.message);
    }
  }
  if (!flights?.length) flights = mockFlights({ origin: origin.iata, dest: dest.iata, flightBase, km, domestic, depart: chosenDepart, ret, travelers });

  const hotels = mockHotels({ city: dest.city, hotelBase: dest.hotelBase, depart: chosenDepart, nights });
  const bundles = buildBundles({ flights, hotels, nights, travelers, budget });
  const ground = buildGround({ origin, dest, flight: flights[0], travelers });
  const food = buildFood({ dest, nights, travelers });
  const trueCost = buildTrueCost({ flights, hotels, nights, travelers, ground, food });
  const weather = await getForecast(dest.lat, dest.lng);

  return {
    destination: { id: dest.id, city: dest.city, state: dest.state, country: dest.country, iata: dest.iata, lat: dest.lat, lng: dest.lng, blurb: dest.blurb, tags: dest.tags },
    domestic,
    distanceKm: Math.round(km),
    query: { origin: origin.iata, originId: origin.id, originCity: origin.city, depart: chosenDepart, ret, nights, travelers, budget, level },
    dataSources: { flights: flightSource, dateInsights: insights.source, hotels: "model", ground: "model" },
    trueCost,
    flights,
    hotels,
    bundles,
    ground,
    food,
    insights,
    weather,
    links: {
      flights: flightLinks({ origin: origin.iata, dest: dest.iata, depart: chosenDepart, ret, travelers }),
      hotels: hotelLinks({ city: dest.city, depart: chosenDepart, ret, travelers }),
      packages: packageLinks({ city: dest.city }),
    },
    places: { attractions: dest.attractions, food: dest.food },
  };
}
