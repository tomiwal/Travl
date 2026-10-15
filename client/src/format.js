export const money = (n) => (n == null ? "-" : `$${Math.round(n).toLocaleString()}`);

export function prettyDate(iso, short = false) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", short ? { month: "short", day: "numeric", timeZone: "UTC" } : { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}
