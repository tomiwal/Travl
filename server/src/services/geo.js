export function distanceKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export const isDomestic = (a, b) => a.country === b.country;

// Typical round-trip economy fare for a route, before date/season adjustments.
export function fareBase(a, b) {
  return Math.max(150, 140 + 0.07 * distanceKm(a, b)) * (isDomestic(a, b) ? 1 : 1.15);
}

export const flightHours = (km) => Math.max(1, Math.round(km / 820 + 0.9));

export const timezoneHours = (place) => Math.round(place.lng / 15);
