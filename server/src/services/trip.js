import { DESTINATIONS } from "../data/destinations.js";
import { amadeusEnabled, liveCheapestDates, liveFlightOffers } from "../providers/amadeus.js";
import { getForecast } from "../providers/weather.js";
import { flightLinks, hotelLinks, packageLinks } from "./links.js";
import { addDays, analyzeDailyPrices, buildBundles, mockFlights, mockHotels, modelDailyPrices, today } from "./pricing.js";

export const findDestination = (id) => DESTINATIONS.find((d) => d.id === id);

async function getInsights({ origin, dest, nights }) {
  const start = addDays(today(), 7);
  if (amadeusEnabled()) {
    try {
      const daily = await liveCheapestDates({ origin, dest: dest.iata, start, end: addDays(start, 90), nights });
      if (daily.length >= 14) return analyzeDailyPrices(daily.sort((a, b) => a.date.localeCompare(b.date)), "live");
    } catch (err) {
      console.warn("Live cheapest-dates failed, using price model:", err.message);
    }
  }
  return analyzeDailyPrices(modelDailyPrices({ origin, dest: dest.iata, flightBase: dest.flightBase, start }), "model");
}

export async function buildTrip({ destId, origin, originCity, depart, nights, travelers, budget }) {
  const dest = findDestination(destId);
  if (!dest) throw new Error("Unknown destination");

  const insights = await getInsights({ origin, dest, nights });
  const chosenDepart = depart || insights.cheapestDates.find((d) => d.date >= addDays(today(), 14))?.date || insights.cheapestDates[0].date;
  const ret = addDays(chosenDepart, nights);

  let flights;
  let flightSource = "model";
  if (amadeusEnabled()) {
    try {
      flights = await liveFlightOffers({ origin, dest: dest.iata, depart: chosenDepart, ret, travelers });
      flightSource = "live";
    } catch (err) {
      console.warn("Live flights failed, using price model:", err.message);
    }
  }
  if (!flights?.length) flights = mockFlights({ origin, dest: dest.iata, flightBase: dest.flightBase, depart: chosenDepart, ret, travelers });

  const hotels = mockHotels({ city: dest.city, hotelBase: dest.hotelBase, depart: chosenDepart, nights });
  const bundles = buildBundles({ flights, hotels, nights, travelers, budget });
  const weather = await getForecast(dest.lat, dest.lng);

  const cheapestFlight = flights[0];
  const cheapestStay = hotels[0];
  const rooms = Math.ceil(travelers / 2);
  return {
    destination: { id: dest.id, city: dest.city, country: dest.country, iata: dest.iata, lat: dest.lat, lng: dest.lng, blurb: dest.blurb, tags: dest.tags },
    query: { origin, originCity, depart: chosenDepart, ret, nights, travelers, budget },
    dataSources: { flights: flightSource, dateInsights: insights.source, hotels: "model" },
    estimatedTotal: cheapestFlight.pricePerPerson * travelers + cheapestStay.perNight * nights * rooms,
    flights,
    hotels,
    bundles,
    insights,
    weather,
    links: {
      flights: flightLinks({ origin, dest: dest.iata, depart: chosenDepart, ret, travelers }),
      hotels: hotelLinks({ city: dest.city, depart: chosenDepart, ret, travelers }),
      packages: packageLinks({ city: dest.city }),
    },
    places: { attractions: dest.attractions, food: dest.food },
  };
}
