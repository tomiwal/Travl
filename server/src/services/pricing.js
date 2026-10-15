// Deterministic price model used when no live API keys are configured.
// Encodes well-known fare patterns: midweek departures, ~6-8 week booking window, seasonality, off-peak times.

export const WEEKDAY_FACTOR = [1.12, 0.98, 0.88, 0.9, 1.0, 1.1, 0.95]; // Sun..Sat
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SEASON_FACTOR = [0.9, 0.9, 1.0, 1.0, 1.05, 1.2, 1.25, 1.2, 0.92, 0.9, 0.95, 1.2]; // Jan..Dec

export const AIRLINES = [
  { code: "DL", name: "Delta", factor: 1.08 },
  { code: "UA", name: "United", factor: 1.04 },
  { code: "AA", name: "American", factor: 1.02 },
  { code: "B6", name: "JetBlue", factor: 0.93 },
  { code: "NK", name: "Spirit", factor: 0.8 },
  { code: "EK", name: "Emirates", factor: 1.1 },
  { code: "TP", name: "TAP Air Portugal", factor: 0.95 },
  { code: "TK", name: "Turkish Airlines", factor: 0.9 },
];

export const TIME_SLOTS = [
  { label: "Red-eye (10pm-5am)", hour: 23, factor: 0.88 },
  { label: "Early morning (6-8am)", hour: 7, factor: 0.95 },
  { label: "Midday (11am-2pm)", hour: 12, factor: 1.0 },
  { label: "Evening (5-8pm)", hour: 18, factor: 1.08 },
];

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = typeof seed === "string" ? hash(seed) : seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const addDays = (iso, n) => {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const today = () => new Date().toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 86400000);
const weekday = (iso) => new Date(iso + "T12:00:00Z").getUTCDay();

function advanceFactor(daysAhead) {
  if (daysAhead < 7) return 1.6;
  if (daysAhead < 14) return 1.35;
  if (daysAhead < 21) return 1.15;
  if (daysAhead < 42) return 1.03;
  if (daysAhead <= 70) return 0.92;
  if (daysAhead <= 120) return 0.97;
  return 1.05;
}

export function modelFare({ origin, dest, flightBase, depart }) {
  const originFactor = 0.85 + (hash(origin) % 30) / 100;
  const daysAhead = Math.max(0, daysBetween(today(), depart));
  const noise = 0.94 + rng(`${origin}${dest}${depart}`)() * 0.12;
  const month = Number(depart.slice(5, 7)) - 1;
  return flightBase * originFactor * WEEKDAY_FACTOR[weekday(depart)] * advanceFactor(daysAhead) * SEASON_FACTOR[month] * noise;
}

export function modelDailyPrices({ origin, dest, flightBase, start, days = 90 }) {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i);
    return { date, weekday: weekday(date), price: Math.round(modelFare({ origin, dest, flightBase, depart: date })) };
  });
}

export function analyzeDailyPrices(daily, source) {
  const byWeekday = WEEKDAYS.map((name, i) => {
    const rows = daily.filter((d) => d.weekday === i);
    const avg = rows.length ? rows.reduce((s, r) => s + r.price, 0) / rows.length : null;
    return { weekday: name, avg: avg ? Math.round(avg) : null };
  });
  const valid = byWeekday.filter((d) => d.avg);
  const overall = daily.reduce((s, d) => s + d.price, 0) / daily.length;
  const cheapestWeekday = valid.reduce((a, b) => (b.avg < a.avg ? b : a));
  const priciestWeekday = valid.reduce((a, b) => (b.avg > a.avg ? b : a));
  const cheapestDates = [...daily].sort((a, b) => a.price - b.price).slice(0, 5);

  const t0 = daily[0].date;
  const byWeeksAhead = [];
  for (let w = 0; w * 7 < daily.length; w++) {
    const rows = daily.slice(w * 7, w * 7 + 7);
    byWeeksAhead.push({ weeksAhead: w + 1, avg: Math.round(rows.reduce((s, r) => s + r.price, 0) / rows.length) });
  }
  const bestWindow = byWeeksAhead.reduce((a, b) => (b.avg < a.avg ? b : a));

  const mid = Math.round(overall);
  return {
    source,
    startDate: t0,
    overallAvg: mid,
    cheapestWeekday: cheapestWeekday.weekday,
    priciestWeekday: priciestWeekday.weekday,
    weekdaySavingsPct: Math.round((1 - cheapestWeekday.avg / priciestWeekday.avg) * 100),
    byWeekday,
    byWeeksAhead,
    bestBookingWindowWeeks: bestWindow.weeksAhead,
    cheapestDates,
    timeOfDay: TIME_SLOTS.map((t) => ({ label: t.label, price: Math.round(mid * t.factor), vsAvgPct: Math.round((t.factor - 1) * 100) })),
    daily,
  };
}

export function mockFlights({ origin, dest, flightBase, depart, ret, travelers }) {
  const r = rng(`flights${origin}${dest}${depart}${ret}`);
  const base = modelFare({ origin, dest, flightBase, depart });
  const sites = ["Skyscanner", "Google Flights", "Kayak", "Expedia", "Momondo", "Kiwi.com"];
  const hours = [6, 9, 13, 17, 21, 23];
  const durationBase = 5 + Math.round((flightBase / 1200) * 12);
  return hours
    .map((hour, i) => {
      const airline = AIRLINES[Math.floor(r() * AIRLINES.length)];
      const slot = hour >= 22 || hour < 5 ? 0.88 : hour < 9 ? 0.95 : hour < 16 ? 1.0 : 1.08;
      const stops = r() < 0.45 ? 0 : r() < 0.8 ? 1 : 2;
      const perPerson = base * airline.factor * slot * (1 - stops * 0.07) * (0.97 + r() * 0.06);
      const prices = sites
        .map((site) => ({ site, price: Math.round(perPerson * (0.95 + r() * 0.1)) }))
        .sort((a, b) => a.price - b.price);
      const best = prices[0];
      return {
        id: `${origin}-${dest}-${depart}-${i}`,
        airline: airline.name,
        code: airline.code,
        departTime: `${String(hour).padStart(2, "0")}:${["00", "15", "30", "45"][i % 4]}`,
        durationHours: durationBase + stops * 2,
        stops,
        pricePerPerson: best.price,
        total: best.price * travelers,
        cheapestSite: best.site,
        priceBySite: prices,
        timeSlot: hour >= 22 || hour < 5 ? "Red-eye" : hour < 9 ? "Early morning" : hour < 16 ? "Midday" : "Evening",
      };
    })
    .sort((a, b) => a.pricePerPerson - b.pricePerPerson);
}

const HOTEL_NAMES = ["Grand", "Harbor View", "Central Plaza", "Old Town Boutique", "Garden Inn", "Skyline Suites", "Riverside", "The Courtyard"];
export function mockHotels({ city, hotelBase, depart, nights }) {
  const r = rng(`hotels${city}${depart}`);
  const month = Number(depart.slice(5, 7)) - 1;
  const sites = ["Booking.com", "Expedia", "Hotels.com", "Kayak", "Google Hotels"];
  return HOTEL_NAMES.map((name, i) => {
    const stars = 2 + (i % 4);
    const perNight = hotelBase * (0.45 + stars * 0.22) * SEASON_FACTOR[month] * (0.92 + r() * 0.16);
    const prices = sites
      .map((site) => ({ site, price: Math.round(perNight * (0.94 + r() * 0.12)) }))
      .sort((a, b) => a.price - b.price);
    return {
      id: `${city}-${i}`,
      name: `${name} ${city}`,
      stars,
      rating: Math.round((6.8 + stars * 0.5 + r() * 0.9) * 10) / 10,
      distanceKm: Math.round((0.3 + r() * 6) * 10) / 10,
      perNight: prices[0].price,
      cheapestSite: prices[0].site,
      priceBySite: prices,
      freeCancel: r() > 0.4,
      breakfast: r() > 0.6,
      nights,
    };
  }).sort((a, b) => a.perNight - b.perNight);
}

export function buildBundles({ flights, hotels, nights, travelers, budget }) {
  const rooms = Math.ceil(travelers / 2);
  const combos = [];
  for (const f of flights.slice(0, 3)) {
    for (const h of hotels.slice(0, 4)) {
      const separate = f.pricePerPerson * travelers + h.perNight * nights * rooms;
      const bundle = Math.round(separate * 0.93);
      combos.push({
        id: `${f.id}|${h.id}`,
        flight: f,
        hotel: h,
        separateTotal: Math.round(separate),
        bundleTotal: bundle,
        estSavings: Math.round(separate - bundle),
        withinBudget: budget ? bundle <= budget : null,
      });
    }
  }
  return combos.sort((a, b) => a.bundleTotal - b.bundleTotal).slice(0, 5);
}
