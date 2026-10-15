import { distanceKm, timezoneHours } from "./geo.js";
import { hash } from "./pricing.js";

// [app, service, price factor vs. a standard ride]. Which apps exist depends on the region.
const APPS = {
  us: [["Uber", "UberX", 1.0], ["Uber", "Uber Comfort", 1.2], ["Uber", "Uber XL", 1.55], ["Lyft", "Lyft Standard", 0.97], ["Lyft", "Lyft XL", 1.5], ["Taxi", "Taxi (metered)", 1.1]],
  ca: [["Uber", "UberX", 1.0], ["Uber", "Uber XL", 1.55], ["Lyft", "Lyft Standard", 0.97], ["Taxi", "Taxi (metered)", 1.1]],
  mx: [["Uber", "UberX", 1.0], ["DiDi", "DiDi Express", 0.8], ["Taxi", "Taxi (agree price first)", 1.3]],
  eu: [["Uber", "UberX", 1.0], ["Bolt", "Bolt", 0.85], ["FREE NOW", "FREE NOW", 1.05], ["Taxi", "Taxi (metered)", 1.1]],
  jp: [["Uber", "Uber Taxi", 1.15], ["GO", "GO Taxi", 1.05], ["DiDi", "DiDi Taxi", 1.0], ["Taxi", "Taxi (metered)", 1.1]],
  id: [["Grab", "GrabCar", 0.85], ["Gojek", "GoCar", 0.8], ["Taxi", "Blue Bird taxi", 1.1]],
  ae: [["Careem", "Careem Go", 0.95], ["Uber", "UberX", 1.0], ["Taxi", "RTA taxi", 1.05]],
  ng: [["Uber", "UberX", 1.0], ["Bolt", "Bolt", 0.85], ["Taxi", "Taxi (negotiate first)", 1.2]],
  is: [["Taxi", "Hreyfill / BSR taxi", 1.0]],
};

export const MEAL_BASE = { breakfast: 11, lunch: 17, dinner: 30 };
export const LEVEL_FACTOR = { budget: 0.55, standard: 1, splurge: 2.1 };
const RIDES_PER_DAY = { budget: 1, standard: 3, splurge: 5 };

const surge = (hour) => (hour >= 7 && hour <= 9 ? 1.25 : hour >= 16 && hour <= 19 ? 1.3 : hour >= 20 && hour <= 22 ? 1.1 : hour <= 4 ? 1.1 : 1.0);
const mod24 = (h) => ((Math.round(h) % 24) + 24) % 24;
const hourOf = (hhmm) => Number(hhmm.slice(0, 2));
const round = Math.round;

function estimateRide({ km, hour, ci, rides, airport }) {
  const minutes = km < 15 ? km * 2 + 5 : km * 1.1 + 10;
  const metered = 2.5 + 1.15 * km * ci + 0.3 * minutes + (airport ? 5.5 * ci : 0);
  const rush = surge(hour);
  const options = (APPS[rides] || APPS.us).map(([app, name, factor]) => {
    const jitter = 0.94 + ((hash(`${rides}${name}${round(km)}`) % 13) / 100);
    const mid = metered * factor * jitter * (app === "Taxi" ? 1 : rush);
    return { app, name, low: round(mid * 0.88), mid: round(mid), high: round(mid * 1.15) };
  });
  const sorted = [...options].sort((a, b) => a.mid - b.mid);
  return { minutes: round(minutes), surge: rush, options: sorted, cheapest: sorted[0], priciest: sorted[sorted.length - 1] };
}

function rideLinks(point, rides) {
  if (!point) return [];
  const links = [{ app: "Uber", url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${point.lat}&dropoff[longitude]=${point.lng}` }];
  if (rides === "us" || rides === "ca") {
    links.push({ app: "Lyft", url: `https://lyft.com/ride?id=lyft&destination[latitude]=${point.lat}&destination[longitude]=${point.lng}` });
  }
  return links;
}

export function buildGround({ origin, dest, flight, travelers }) {
  const vehicles = Math.ceil(travelers / 4);
  const depHour = hourOf(flight.departTime);
  const tz = timezoneHours(dest) - timezoneHours(origin);
  const arriveThere = mod24(depHour + flight.durationHours + tz);
  const arriveHome = mod24(depHour + flight.durationHours - tz);
  const center = { lat: dest.lat, lng: dest.lng };

  const mkLeg = (id, label, km, hour, place, dropoff) => ({
    id, label, km: round(km), hour, vehicles, links: rideLinks(dropoff, place.rides),
    ...estimateRide({ km, hour, ci: place.ci, rides: place.rides, airport: true }),
  });

  const airportLegs = [
    mkLeg("to-airport", `Your place to ${origin.iata} airport`, origin.airportKm, mod24(depHour - 3), origin, null),
    mkLeg("airport-stay", `${dest.iata} airport to your stay`, dest.airportKm, arriveThere, dest, center),
    mkLeg("stay-airport", `Your stay to ${dest.iata} airport (trip home)`, dest.airportKm, mod24(depHour - 3), dest, null),
    mkLeg("airport-home", `${origin.iata} airport to your place`, origin.airportKm, arriveHome, origin, null),
  ];
  airportLegs[1].transitAlt = dest.transit;

  const placeLegs = [...dest.attractions, ...dest.food].map((p) => {
    const km = Math.max(1.5, distanceKm(center, p) * 1.3);
    const hour = p.meal === "dinner" ? 19 : p.meal === "breakfast" ? 9 : 11;
    return {
      id: p.name, label: `Your stay to ${p.name}`, km: Math.round(km * 10) / 10, hour, vehicles,
      links: rideLinks(p, dest.rides),
      ...estimateRide({ km, hour, ci: dest.ci, rides: dest.rides, airport: false }),
    };
  });

  const avgLocalRide = placeLegs.reduce((s, l) => s + l.cheapest.mid, 0) / placeLegs.length;
  const airportTotal = airportLegs.reduce((s, l) => s + l.cheapest.mid * vehicles, 0);

  return {
    vehicles,
    apps: [...new Set((APPS[dest.rides] || APPS.us).map(([app]) => app))],
    airportLegs,
    placeLegs,
    airportTotal: round(airportTotal),
    avgLocalRide: round(avgLocalRide),
    transitSavings: dest.transit ? Math.max(0, round(airportLegs[1].cheapest.mid * vehicles - dest.transit.cost * travelers)) : 0,
    ridesPerDay: RIDES_PER_DAY,
  };
}

export function buildFood({ dest, nights, travelers }) {
  const perMeal = {};
  const totals = {};
  for (const [level, f] of Object.entries(LEVEL_FACTOR)) {
    perMeal[level] = Object.fromEntries(Object.entries(MEAL_BASE).map(([meal, base]) => [meal, round(base * dest.ci * f)]));
    const m = perMeal[level];
    // Full days of three meals, plus arrival dinner and departure breakfast.
    totals[level] = (nights * (m.breakfast + m.lunch + m.dinner) + m.dinner + m.breakfast) * travelers;
  }
  return { perMeal, totals };
}

export function buildTrueCost({ flights, hotels, nights, travelers, ground, food }) {
  const rooms = Math.ceil(travelers / 2);
  const hotelByLevel = { budget: hotels[0], standard: hotels[Math.floor(hotels.length / 2)], splurge: hotels[hotels.length - 1] };
  const flightTotal = flights[0].pricePerPerson * travelers;
  const out = {};
  for (const level of Object.keys(LEVEL_FACTOR)) {
    const hotel = hotelByLevel[level];
    const lines = [
      { key: "flights", label: "Flights", amount: flightTotal },
      { key: "stay", label: `Stay (${hotel.name}, ${nights} nights)`, amount: hotel.perNight * nights * rooms },
      { key: "airport", label: "Airport rides (4 legs)", amount: ground.airportTotal },
      { key: "local", label: `Rides around town (~${ground.ridesPerDay[level]}/day)`, amount: round(ground.avgLocalRide * ground.ridesPerDay[level] * nights * ground.vehicles) },
      { key: "food", label: "Food (breakfast, lunch, dinner)", amount: food.totals[level] },
    ];
    out[level] = { hotel: { name: hotel.name, stars: hotel.stars, perNight: hotel.perNight }, lines, total: lines.reduce((s, l) => s + l.amount, 0) };
  }
  return out;
}
