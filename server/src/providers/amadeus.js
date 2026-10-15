const BASE = "https://test.api.amadeus.com";
let token = null;
let tokenExpiry = 0;

export const amadeusEnabled = () => Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Amadeus auth failed (${res.status})`);
  const json = await res.json();
  token = json.access_token;
  tokenExpiry = Date.now() + (json.expires_in - 30) * 1000;
  return token;
}

async function api(path, params) {
  const res = await fetch(`${BASE}${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  if (!res.ok) throw new Error(`Amadeus ${path} failed (${res.status})`);
  return res.json();
}

export async function liveFlightOffers({ origin, dest, depart, ret, travelers }) {
  const json = await api("/v2/shopping/flight-offers", {
    originLocationCode: origin,
    destinationLocationCode: dest,
    departureDate: depart,
    returnDate: ret,
    adults: String(travelers),
    currencyCode: "USD",
    max: "10",
  });
  const carriers = json.dictionaries?.carriers || {};
  return json.data
    .map((o) => {
      const out = o.itineraries[0];
      const seg = out.segments[0];
      const total = Math.round(Number(o.price.grandTotal));
      const code = o.validatingAirlineCodes?.[0] || seg.carrierCode;
      const hour = Number(seg.departure.at.slice(11, 13));
      return {
        id: o.id,
        airline: carriers[code] || code,
        code,
        departTime: seg.departure.at.slice(11, 16),
        durationHours: Math.round(Number(/PT(?:(\d+)H)?/.exec(out.duration)?.[1] || 0)),
        stops: out.segments.length - 1,
        pricePerPerson: Math.round(total / travelers),
        total,
        cheapestSite: "Amadeus (live)",
        priceBySite: [],
        timeSlot: hour >= 22 || hour < 5 ? "Red-eye" : hour < 9 ? "Early morning" : hour < 16 ? "Midday" : "Evening",
      };
    })
    .sort((a, b) => a.pricePerPerson - b.pricePerPerson);
}

export async function liveCheapestDates({ origin, dest, start, end, nights }) {
  const json = await api("/v1/shopping/flight-dates", {
    origin,
    destination: dest,
    departureDate: `${start},${end}`,
    duration: String(nights),
    oneWay: "false",
    viewBy: "DATE",
  });
  return json.data.map((d) => ({
    date: d.departureDate,
    weekday: new Date(d.departureDate + "T12:00:00Z").getUTCDay(),
    price: Math.round(Number(d.price.total)),
  }));
}
