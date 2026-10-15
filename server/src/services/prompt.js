import { DESTINATIONS, PLACES, STATE_ALIASES, findPlace } from "../data/destinations.js";
import { distanceKm, fareBase } from "./geo.js";

const INTEREST_WORDS = {
  beach: ["beach", "beaches", "surf", "island", "sun", "swim", "snorkel", "snorkeling"],
  food: ["food", "eat", "eating", "restaurant", "restaurants", "foodie", "cuisine", "dining"],
  culture: ["culture", "museum", "museums", "history", "temple", "temples", "art", "architecture"],
  nature: ["nature", "scenery", "lake", "lakes", "waterfall", "wildlife"],
  hiking: ["hike", "hiking", "trail", "trails", "mountain", "mountains"],
  nightlife: ["nightlife", "club", "clubs", "party", "bars", "bar", "music"],
  relax: ["relax", "relaxing", "spa", "chill", "quiet", "peaceful"],
  city: ["city", "urban", "skyline"],
  shopping: ["shopping", "shop", "markets"],
  adventure: ["adventure", "adrenaline", "diving", "safari"],
  romantic: ["romantic", "honeymoon", "couple", "anniversary"],
  family: ["family", "kids", "children"],
  budget: ["cheap", "budget", "affordable", "inexpensive"],
  luxury: ["luxury", "luxurious", "upscale", "5-star"],
};

const FOOD_WORDS = [
  "sushi", "ramen", "tacos", "seafood", "pizza", "pasta", "street food", "coffee", "bbq", "barbecue",
  "vegan", "vegetarian", "brunch", "dessert", "pastries", "steak", "curry", "dumplings", "suya", "bagels",
];

const ORIGIN_CUES = [
  /(?:\bi'?m|\bi am|\bwe'?re|\bwe are|\blive|\bliving|\blocated|\bbased|\bcurrently|\bstaying|\bresid(?:e|ing))\s+(?:currently\s+)?(?:in|at|near|around|out of)\s*$/,
  /\b(?:from|out of|leaving|departing(?: from)?|flying from|flying out of|starting from|starting in|leaving from)\s*$/,
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const has = (text, word) => new RegExp(`\\b${escapeRe(word)}\\b`, "i").test(text);

// Aliases written in capitals ("LA", "SF") only match capitalised text so "la" and "sf" in prose don't.
const ALIASES = [
  ...PLACES.flatMap((p) => p.aliases.map((alias) => ({ alias, placeId: p.id }))),
  ...Object.keys(STATE_ALIASES).map((alias) => ({ alias, state: alias })),
].sort((a, b) => b.alias.length - a.alias.length);

function findMentions(raw) {
  const lower = raw.toLowerCase();
  const found = [];
  for (const entry of ALIASES) {
    const caseSensitive = entry.alias === entry.alias.toUpperCase() && /[A-Z]/.test(entry.alias);
    const re = new RegExp(`(?<![\\w])${escapeRe(caseSensitive ? entry.alias : entry.alias.toLowerCase())}(?![\\w])`, caseSensitive ? "g" : "gi");
    for (const m of (caseSensitive ? raw : lower).matchAll(re)) {
      const start = m.index;
      const end = start + m[0].length;
      if (found.some((f) => start < f.end && end > f.start)) continue;
      found.push({ start, end, ...entry });
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

const isOriginCue = (before) => ORIGIN_CUES.some((re) => re.test(before.toLowerCase()));

export function parsePrompt(raw) {
  const text = String(raw || "");
  const lower = text.toLowerCase();

  const mentions = findMentions(text);
  let originId = null;
  const destIds = [];
  const notes = [];

  mentions.forEach((m, i) => {
    const before = text.slice(Math.max(0, m.start - 40), m.start);
    const asOrigin = !originId && isOriginCue(before);
    if (m.state) {
      // "Houston, Texas": the state just qualifies the city before it.
      const prev = mentions[i - 1];
      if (prev && !prev.state && /^[\s,]*$/.test(text.slice(prev.end, m.start))) return;
      const s = STATE_ALIASES[m.state];
      if (asOrigin) {
        originId = s.origin;
        notes.push(`Using ${findPlace(s.origin).city} as your departure airport for ${m.state[0].toUpperCase() + m.state.slice(1)}. Pick another city in the form to change it.`);
      } else {
        destIds.push(...s.dest);
      }
      return;
    }
    if (asOrigin) originId = m.placeId;
    else if (!originId && !destIds.length && mentions[i + 1] && /^\s*(?:to|->|→|-)\s*$/i.test(text.slice(m.end, mentions[i + 1].start))) originId = m.placeId;
    else destIds.push(m.placeId);
  });

  const namedDest = [...new Set(destIds)].filter((id) => id !== originId && DESTINATIONS.some((d) => d.id === id));

  const interests = Object.entries(INTEREST_WORDS)
    .filter(([, words]) => words.some((w) => has(lower, w)))
    .map(([tag]) => tag);
  const foodPrefs = FOOD_WORDS.filter((w) => has(lower, w));

  const budgetMatch = lower.match(/\$\s?([\d,]+)\s?(k)?/) || lower.match(/([\d,]+)\s?(?:usd|dollars|bucks)/);
  let budget = null;
  if (budgetMatch) {
    budget = Number(budgetMatch[1].replace(/,/g, ""));
    if (budgetMatch[2] === "k") budget *= 1000;
  }

  const nightsMatch = lower.match(/(\d+)\s?(?:nights?|days?)/);
  const weekMatch = lower.match(/(\d+)\s?weeks?/);
  const nights = nightsMatch ? Math.min(Number(nightsMatch[1]), 30) : weekMatch ? Math.min(Number(weekMatch[1]) * 7, 30) : /\bweekend\b/.test(lower) ? 2 : 5;

  const travMatch = lower.match(/(\d+)\s?(?:people|travell?ers|adults|guests|of us)/);
  const travelers = travMatch ? Math.min(Number(travMatch[1]), 9) : /\bcouple\b|\bhoneymoon\b/.test(lower) ? 2 : 1;

  const depart = parseDepart(lower);

  const level = interests.includes("luxury") ? "splurge" : interests.includes("budget") ? "budget" : "standard";
  const domesticOnly = /\bdomestic\b|within the (?:us|u\.s\.|states)|in the (?:us|u\.s\.|usa)\b|\busa\b/.test(lower);

  const originAssumed = !originId;
  if (!originId) originId = namedDest[0] === "newyork" ? "losangeles" : "newyork";
  const origin = findPlace(originId);

  let destinations = namedDest;
  if (!destinations.length) {
    const wanted = interests.length ? interests : ["culture", "food"];
    destinations = DESTINATIONS.filter((d) => d.id !== originId && (!domesticOnly || d.country === origin.country))
      .map((d) => {
        let score = wanted.filter((t) => d.tags.includes(t)).length * 3;
        if (budget) score += fareBase(origin, d) * 2 + d.hotelBase * nights < budget ? 2 : -2;
        score -= distanceKm(origin, d) / 20000;
        return { d, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.d.id);
  }

  if (!namedDest.length) {
    const unknown = text.match(/\b(?:go|going|trip|travel|fly|flying|visit|vacation|weekend|getaway)\s+(?:to|in)\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+)?)/);
    if (unknown) notes.push(`We don't have ${unknown[1]} yet, so here are similar ideas. Pick a city in the form to choose a specific one.`);
  }

  return { originId, originAssumed, destinations, namedExplicitly: namedDest.length > 0, interests, foodPrefs, budget, nights, travelers, level, domesticOnly, depart, notes };
}

// "this weekend" / "next weekend" mean leaving that Friday; "tomorrow" is tomorrow.
function parseDepart(lower) {
  const weekend = /\b(?:(this|next) )?weekend\b/.exec(lower);
  const day = new Date();
  day.setUTCDate(day.getUTCDate() + 1);
  if (weekend) {
    // A bare "weekend" means a Friday about two weeks out, when fares are better than last-minute.
    if (!weekend[1]) day.setUTCDate(day.getUTCDate() + 13);
    while (day.getUTCDay() !== 5) day.setUTCDate(day.getUTCDate() + 1);
    if (weekend[1] === "next") day.setUTCDate(day.getUTCDate() + 7);
    return day.toISOString().slice(0, 10);
  }
  return /\btomorrow\b/.test(lower) ? day.toISOString().slice(0, 10) : undefined;
}
