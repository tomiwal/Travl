export const AIRPORTS = {
  nyc: { iata: "JFK", city: "New York" },
  "new york": { iata: "JFK", city: "New York" },
  la: { iata: "LAX", city: "Los Angeles" },
  "los angeles": { iata: "LAX", city: "Los Angeles" },
  chicago: { iata: "ORD", city: "Chicago" },
  miami: { iata: "MIA", city: "Miami" },
  atlanta: { iata: "ATL", city: "Atlanta" },
  dallas: { iata: "DFW", city: "Dallas" },
  houston: { iata: "IAH", city: "Houston" },
  london: { iata: "LHR", city: "London" },
  toronto: { iata: "YYZ", city: "Toronto" },
  lagos: { iata: "LOS", city: "Lagos" },
};

export const DESTINATIONS = [
  {
    id: "bali", city: "Bali", country: "Indonesia", iata: "DPS", lat: -8.65, lng: 115.22,
    tags: ["beach", "relax", "culture", "nature", "food", "budget"], hotelBase: 70, flightBase: 980,
    blurb: "Rice terraces, surf beaches and temples at a gentle price.",
    attractions: [
      { name: "Tegallalang Rice Terraces", lat: -8.43, lng: 115.28, type: "nature" },
      { name: "Uluwatu Temple", lat: -8.83, lng: 115.08, type: "culture" },
      { name: "Seminyak Beach", lat: -8.69, lng: 115.16, type: "beach" },
    ],
    food: [
      { name: "Warung Babi Guling Ibu Oka", lat: -8.51, lng: 115.26, type: "food" },
      { name: "Locavore", lat: -8.51, lng: 115.26, type: "food" },
    ],
  },
  {
    id: "tokyo", city: "Tokyo", country: "Japan", iata: "TYO", lat: 35.68, lng: 139.69,
    tags: ["food", "culture", "city", "nightlife", "shopping"], hotelBase: 120, flightBase: 1050,
    blurb: "Neon nights, world-class food and quiet shrines.",
    attractions: [
      { name: "Senso-ji Temple", lat: 35.71, lng: 139.8, type: "culture" },
      { name: "Shibuya Crossing", lat: 35.66, lng: 139.7, type: "city" },
      { name: "teamLab Planets", lat: 35.65, lng: 139.79, type: "culture" },
    ],
    food: [
      { name: "Tsukiji Outer Market", lat: 35.66, lng: 139.77, type: "food" },
      { name: "Ichiran Shibuya", lat: 35.66, lng: 139.7, type: "food" },
    ],
  },
  {
    id: "lisbon", city: "Lisbon", country: "Portugal", iata: "LIS", lat: 38.72, lng: -9.14,
    tags: ["food", "culture", "city", "nightlife", "beach", "budget"], hotelBase: 95, flightBase: 620,
    blurb: "Tiled hills, custard tarts and sunset miradouros.",
    attractions: [
      { name: "Belem Tower", lat: 38.69, lng: -9.22, type: "culture" },
      { name: "Alfama District", lat: 38.71, lng: -9.13, type: "culture" },
      { name: "Cascais Beach", lat: 38.69, lng: -9.42, type: "beach" },
    ],
    food: [
      { name: "Pasteis de Belem", lat: 38.7, lng: -9.2, type: "food" },
      { name: "Time Out Market", lat: 38.71, lng: -9.15, type: "food" },
    ],
  },
  {
    id: "cancun", city: "Cancun", country: "Mexico", iata: "CUN", lat: 21.16, lng: -86.85,
    tags: ["beach", "relax", "nightlife", "family", "budget"], hotelBase: 110, flightBase: 380,
    blurb: "Turquoise water, all-inclusives and Mayan ruins nearby.",
    attractions: [
      { name: "Isla Mujeres", lat: 21.23, lng: -86.73, type: "beach" },
      { name: "Chichen Itza (day trip)", lat: 20.68, lng: -88.57, type: "culture" },
      { name: "Playa Delfines", lat: 21.07, lng: -86.78, type: "beach" },
    ],
    food: [
      { name: "La Parrilla", lat: 21.16, lng: -86.82, type: "food" },
      { name: "Mercado 23", lat: 21.16, lng: -86.83, type: "food" },
    ],
  },
  {
    id: "paris", city: "Paris", country: "France", iata: "PAR", lat: 48.86, lng: 2.35,
    tags: ["culture", "food", "city", "romantic", "shopping"], hotelBase: 160, flightBase: 640,
    blurb: "Museums, bakeries and long walks along the Seine.",
    attractions: [
      { name: "Louvre Museum", lat: 48.86, lng: 2.34, type: "culture" },
      { name: "Eiffel Tower", lat: 48.86, lng: 2.29, type: "city" },
      { name: "Montmartre", lat: 48.89, lng: 2.34, type: "culture" },
    ],
    food: [
      { name: "Du Pain et des Idees", lat: 48.87, lng: 2.36, type: "food" },
      { name: "Le Marais Falafel Row", lat: 48.857, lng: 2.36, type: "food" },
    ],
  },
  {
    id: "reykjavik", city: "Reykjavik", country: "Iceland", iata: "KEF", lat: 64.15, lng: -21.94,
    tags: ["nature", "hiking", "adventure", "relax"], hotelBase: 175, flightBase: 520,
    blurb: "Glaciers, geysers and hot springs under the northern lights.",
    attractions: [
      { name: "Blue Lagoon", lat: 63.88, lng: -22.45, type: "relax" },
      { name: "Golden Circle", lat: 64.31, lng: -20.3, type: "nature" },
      { name: "Hallgrimskirkja", lat: 64.14, lng: -21.93, type: "culture" },
    ],
    food: [
      { name: "Baejarins Beztu Pylsur", lat: 64.15, lng: -21.94, type: "food" },
      { name: "Fish Market", lat: 64.15, lng: -21.94, type: "food" },
    ],
  },
  {
    id: "lagos", city: "Lagos", country: "Nigeria", iata: "LOS", lat: 6.52, lng: 3.38,
    tags: ["nightlife", "food", "culture", "city", "beach"], hotelBase: 85, flightBase: 1150,
    blurb: "Afrobeats, suya and the Atlantic coast.",
    attractions: [
      { name: "Lekki Conservation Centre", lat: 6.44, lng: 3.53, type: "nature" },
      { name: "Nike Art Gallery", lat: 6.43, lng: 3.47, type: "culture" },
      { name: "Elegushi Beach", lat: 6.44, lng: 3.48, type: "beach" },
    ],
    food: [
      { name: "Bukka Hut", lat: 6.45, lng: 3.42, type: "food" },
      { name: "Terra Kulture", lat: 6.43, lng: 3.42, type: "food" },
    ],
  },
  {
    id: "barcelona", city: "Barcelona", country: "Spain", iata: "BCN", lat: 41.39, lng: 2.17,
    tags: ["beach", "food", "culture", "nightlife", "city"], hotelBase: 130, flightBase: 580,
    blurb: "Gaudi, tapas and city beaches.",
    attractions: [
      { name: "Sagrada Familia", lat: 41.4, lng: 2.17, type: "culture" },
      { name: "Park Guell", lat: 41.41, lng: 2.15, type: "nature" },
      { name: "Barceloneta Beach", lat: 41.38, lng: 2.19, type: "beach" },
    ],
    food: [
      { name: "La Boqueria Market", lat: 41.38, lng: 2.17, type: "food" },
      { name: "Bar Canyes", lat: 41.38, lng: 2.18, type: "food" },
    ],
  },
  {
    id: "banff", city: "Banff", country: "Canada", iata: "YYC", lat: 51.18, lng: -115.57,
    tags: ["hiking", "nature", "adventure", "relax", "family"], hotelBase: 190, flightBase: 360,
    blurb: "Turquoise lakes and Rocky Mountain trails.",
    attractions: [
      { name: "Lake Louise", lat: 51.42, lng: -116.18, type: "nature" },
      { name: "Moraine Lake", lat: 51.32, lng: -116.19, type: "nature" },
      { name: "Banff Gondola", lat: 51.14, lng: -115.57, type: "adventure" },
    ],
    food: [
      { name: "Banff Avenue Brewing Co.", lat: 51.18, lng: -115.57, type: "food" },
      { name: "Park Distillery", lat: 51.18, lng: -115.57, type: "food" },
    ],
  },
  {
    id: "dubai", city: "Dubai", country: "UAE", iata: "DXB", lat: 25.2, lng: 55.27,
    tags: ["shopping", "city", "luxury", "beach", "nightlife"], hotelBase: 150, flightBase: 900,
    blurb: "Skyscrapers, souks and desert safaris.",
    attractions: [
      { name: "Burj Khalifa", lat: 25.2, lng: 55.27, type: "city" },
      { name: "Desert Safari", lat: 24.9, lng: 55.5, type: "adventure" },
      { name: "Jumeirah Beach", lat: 25.2, lng: 55.26, type: "beach" },
    ],
    food: [
      { name: "Al Ustad Special Kabab", lat: 25.26, lng: 55.3, type: "food" },
      { name: "Arabian Tea House", lat: 25.26, lng: 55.3, type: "food" },
    ],
  },
];
