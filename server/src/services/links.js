const enc = encodeURIComponent;
const yymmdd = (iso) => iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10);
const mdy = (iso) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(0, 4)}`;

export function flightLinks({ origin, dest, depart, ret, travelers }) {
  const o = origin.toLowerCase();
  const d = dest.toLowerCase();
  return [
    { site: "Google Flights", url: `https://www.google.com/travel/flights?q=${enc(`Flights to ${dest} from ${origin} on ${depart} through ${ret}`)}` },
    { site: "Skyscanner", url: `https://www.skyscanner.com/transport/flights/${o}/${d}/${yymmdd(depart)}/${yymmdd(ret)}/?adultsv2=${travelers}` },
    { site: "Kayak", url: `https://www.kayak.com/flights/${origin}-${dest}/${depart}/${ret}/${travelers}adults` },
    { site: "Expedia", url: `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${origin},to:${dest},departure:${mdy(depart)}TANYT&leg2=from:${dest},to:${origin},departure:${mdy(ret)}TANYT&passengers=adults:${travelers}` },
    { site: "Momondo", url: `https://www.momondo.com/flight-search/${origin}-${dest}/${depart}/${ret}/${travelers}adults` },
    { site: "Kiwi.com", url: `https://www.kiwi.com/en/search/results/${o}/${d}/${depart}/${ret}` },
  ];
}

export function hotelLinks({ city, depart, ret, travelers }) {
  return [
    { site: "Booking.com", url: `https://www.booking.com/searchresults.html?ss=${enc(city)}&checkin=${depart}&checkout=${ret}&group_adults=${travelers}` },
    { site: "Expedia", url: `https://www.expedia.com/Hotel-Search?destination=${enc(city)}&startDate=${depart}&endDate=${ret}&adults=${travelers}` },
    { site: "Hotels.com", url: `https://www.hotels.com/Hotel-Search?destination=${enc(city)}&startDate=${depart}&endDate=${ret}&adults=${travelers}` },
    { site: "Kayak", url: `https://www.kayak.com/hotels/${enc(city)}/${depart}/${ret}/${travelers}adults` },
    { site: "Google Hotels", url: `https://www.google.com/travel/search?q=${enc(`hotels in ${city}`)}&dates=${depart},${ret}` },
  ];
}

export function packageLinks({ city }) {
  return [
    { site: "Expedia Packages", url: "https://www.expedia.com/Vacation-Packages" },
    { site: "Priceline Bundles", url: "https://www.priceline.com/vacations/" },
    { site: "Booking.com Flight + Stay", url: `https://www.booking.com/searchresults.html?ss=${enc(city)}` },
  ];
}
