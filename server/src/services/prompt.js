import { AIRPORTS, DESTINATIONS } from "../data/destinations.js";

const INTEREST_WORDS = {
  beach: ["beach", "beaches", "surf", "island", "sun", "swim", "snorkel"],
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
  "sushi", "ramen", "tacos", "seafood", "pizza", "pasta", "street food", "coffee", "bbq",
  "vegan", "vegetarian", "brunch", "dessert", "pastries", "steak", "curry", "dumplings", "suya",
];

const has = (text, word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);

export function parsePrompt(raw) {
  const text = String(raw || "").toLowerCase();

  let origin = { iata: "JFK", city: "New York", assumed: true };
  const fromMatch = text.match(/\bfrom\s+([a-z .]+?)(?=\s+(?:to|for|in|on|with|and|around|under)\b|[,.]|$)/);
  const originKeys = Object.keys(AIRPORTS).sort((a, b) => b.length - a.length);
  const originKey = fromMatch && originKeys.find((k) => fromMatch[1].trim() === k || fromMatch[1].includes(k));
  if (originKey) origin = { ...AIRPORTS[originKey], assumed: false };

  const afterFrom = fromMatch ? text.replace(fromMatch[0], " ") : text;
  const named = DESTINATIONS.filter((d) => has(afterFrom, d.city.toLowerCase()) || has(afterFrom, d.country.toLowerCase()));

  const interests = Object.entries(INTEREST_WORDS)
    .filter(([, words]) => words.some((w) => has(text, w)))
    .map(([tag]) => tag);
  const foodPrefs = FOOD_WORDS.filter((w) => has(text, w));

  const budgetMatch = text.match(/\$\s?([\d,]+)\s?(k)?/) || text.match(/([\d,]+)\s?(?:usd|dollars|bucks)/);
  let budget = null;
  if (budgetMatch) {
    budget = Number(budgetMatch[1].replace(/,/g, ""));
    if (budgetMatch[2] === "k") budget *= 1000;
  }

  const nightsMatch = text.match(/(\d+)\s?(?:nights?|days?)/);
  const weekMatch = text.match(/(\d+)\s?weeks?/);
  const nights = nightsMatch ? Math.min(Number(nightsMatch[1]), 30) : weekMatch ? Math.min(Number(weekMatch[1]) * 7, 30) : 5;

  const travMatch = text.match(/(\d+)\s?(?:people|travell?ers|adults|guests|of us)/);
  const travelers = travMatch ? Math.min(Number(travMatch[1]), 9) : /\bcouple\b|\bhoneymoon\b/.test(text) ? 2 : 1;

  let picks = named;
  if (!picks.length) {
    const wanted = interests.length ? interests : ["culture", "food"];
    picks = DESTINATIONS.map((d) => {
      let score = wanted.filter((t) => d.tags.includes(t)).length * 3;
      if (budget) score += d.flightBase * 2 + d.hotelBase * nights < budget ? 2 : -2;
      return { d, score };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.d);
  }

  return { origin, destinations: picks.map((d) => d.id), namedExplicitly: named.length > 0, interests, foodPrefs, budget, nights, travelers };
}
