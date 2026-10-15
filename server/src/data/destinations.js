// Coordinates and prices are approximate. `ci` is a cost index (1.0 = typical large US city).
// `rides` picks the ride-hailing apps that operate in that region (see services/ground.js).

const spot = (name, lat, lng, type) => ({ name, lat, lng, type });
const eat = (name, lat, lng, meal, tier) => ({ name, lat, lng, type: "food", meal, tier });

export const DESTINATIONS = [
  {
    id: "newyork", city: "New York", state: "NY", country: "USA", iata: "JFK", lat: 40.71, lng: -74.01,
    aliases: ["new york city", "new york", "newyork", "nyc", "manhattan", "brooklyn", "NY"], rides: "us",
    tags: ["city", "food", "culture", "nightlife", "shopping", "romantic"], hotelBase: 190, ci: 1.35, airportKm: 26,
    transit: { name: "AirTrain + subway", cost: 11 },
    blurb: "Museums, pizza slices and skyline views that never get old.",
    attractions: [spot("Statue of Liberty", 40.689, -74.045, "culture"), spot("Central Park", 40.785, -73.968, "nature"), spot("The Met", 40.779, -73.963, "culture"), spot("Brooklyn Bridge", 40.706, -73.997, "city")],
    food: [eat("Russ & Daughters", 40.722, -73.988, "breakfast", 2), eat("Joe's Pizza", 40.73, -74.002, "lunch", 1), eat("Katz's Delicatessen", 40.722, -73.987, "lunch", 2)],
  },
  {
    id: "losangeles", city: "Los Angeles", state: "CA", country: "USA", iata: "LAX", lat: 34.05, lng: -118.24,
    aliases: ["los angeles", "l.a.", "lax", "hollywood", "LA", "socal"], rides: "us",
    tags: ["beach", "city", "food", "nightlife", "culture", "shopping"], hotelBase: 170, ci: 1.15, airportKm: 28,
    transit: { name: "LAX FlyAway bus", cost: 10 },
    blurb: "Beaches, tacos and golden-hour hikes.",
    attractions: [spot("Griffith Observatory", 34.118, -118.3, "culture"), spot("Santa Monica Pier", 34.009, -118.497, "beach"), spot("Venice Beach", 33.985, -118.472, "beach"), spot("The Getty Center", 34.078, -118.474, "culture")],
    food: [eat("Grand Central Market", 34.051, -118.249, "breakfast", 1), eat("Langer's Deli", 34.057, -118.276, "lunch", 2), eat("Howlin' Ray's", 34.062, -118.24, "lunch", 2)],
  },
  {
    id: "sanfrancisco", city: "San Francisco", state: "CA", country: "USA", iata: "SFO", lat: 37.77, lng: -122.42,
    aliases: ["san francisco", "san fran", "sf", "SF", "bay area", "norcal"], rides: "us",
    tags: ["city", "food", "culture", "nature", "romantic"], hotelBase: 200, ci: 1.3, airportKm: 21,
    transit: { name: "BART", cost: 11 },
    blurb: "Foggy bridges, sourdough and steep, scenic streets.",
    attractions: [spot("Golden Gate Bridge", 37.82, -122.478, "city"), spot("Alcatraz Island", 37.827, -122.423, "culture"), spot("Fisherman's Wharf", 37.808, -122.417, "city"), spot("Golden Gate Park", 37.769, -122.486, "nature")],
    food: [eat("Tartine Bakery", 37.761, -122.424, "breakfast", 2), eat("La Taqueria", 37.751, -122.418, "lunch", 1), eat("Ferry Building Marketplace", 37.796, -122.394, "lunch", 2)],
  },
  {
    id: "miami", city: "Miami", state: "FL", country: "USA", iata: "MIA", lat: 25.76, lng: -80.19,
    aliases: ["miami", "south beach", "miami beach"], rides: "us",
    tags: ["beach", "nightlife", "food", "relax", "shopping"], hotelBase: 170, ci: 1.15, airportKm: 11,
    transit: { name: "Metrorail", cost: 3 },
    blurb: "Art deco, Cuban coffee and warm water year-round.",
    attractions: [spot("South Beach", 25.783, -80.134, "beach"), spot("Wynwood Walls", 25.801, -80.199, "culture"), spot("Vizcaya Museum", 25.744, -80.211, "culture"), spot("Little Havana", 25.765, -80.22, "culture")],
    food: [eat("Versailles Restaurant", 25.766, -80.253, "dinner", 2), eat("Garcia's Seafood Grille", 25.775, -80.202, "lunch", 2), eat("Joe's Stone Crab", 25.768, -80.135, "dinner", 3)],
  },
  {
    id: "chicago", city: "Chicago", state: "IL", country: "USA", iata: "ORD", lat: 41.88, lng: -87.63,
    aliases: ["chicago", "chi-town"], rides: "us",
    tags: ["city", "food", "culture", "nightlife", "budget"], hotelBase: 150, ci: 1.05, airportKm: 27,
    transit: { name: "CTA Blue Line", cost: 5 },
    blurb: "Deep dish, lakefront walks and architecture boat tours.",
    attractions: [spot("Millennium Park", 41.883, -87.623, "city"), spot("Art Institute of Chicago", 41.88, -87.624, "culture"), spot("Navy Pier", 41.892, -87.609, "city"), spot("Chicago Riverwalk", 41.889, -87.624, "city")],
    food: [eat("Au Cheval", 41.884, -87.648, "breakfast", 2), eat("Portillo's", 41.891, -87.636, "lunch", 1), eat("Lou Malnati's", 41.891, -87.632, "dinner", 2)],
  },
  {
    id: "lasvegas", city: "Las Vegas", state: "NV", country: "USA", iata: "LAS", lat: 36.17, lng: -115.14,
    aliases: ["las vegas", "vegas"], rides: "us",
    tags: ["nightlife", "city", "shopping", "adventure", "budget"], hotelBase: 110, ci: 1.0, airportKm: 8,
    transit: null,
    blurb: "Shows, buffets and desert canyons a short drive away.",
    attractions: [spot("The Strip", 36.115, -115.173, "city"), spot("Bellagio Fountains", 36.113, -115.177, "city"), spot("Fremont Street", 36.171, -115.143, "nightlife"), spot("Red Rock Canyon", 36.135, -115.427, "nature")],
    food: [eat("Hash House A Go Go", 36.118, -115.17, "breakfast", 2), eat("Lotus of Siam", 36.146, -115.14, "dinner", 2), eat("Bacchanal Buffet", 36.116, -115.175, "dinner", 3)],
  },
  {
    id: "orlando", city: "Orlando", state: "FL", country: "USA", iata: "MCO", lat: 28.54, lng: -81.38,
    aliases: ["orlando", "disney world", "disneyworld"], rides: "us",
    tags: ["family", "adventure", "relax", "budget"], hotelBase: 120, ci: 0.95, airportKm: 20,
    transit: null,
    blurb: "Theme parks, spring-fed lakes and space launches.",
    attractions: [spot("Walt Disney World", 28.385, -81.564, "family"), spot("Universal Orlando", 28.474, -81.468, "family"), spot("Lake Eola Park", 28.543, -81.373, "nature"), spot("Kennedy Space Center", 28.573, -80.649, "culture")],
    food: [eat("Gideon's Bakehouse", 28.371, -81.516, "breakfast", 2), eat("The Ravenous Pig", 28.596, -81.353, "dinner", 3), eat("Hawkers Asian Street Food", 28.568, -81.357, "dinner", 2)],
  },
  {
    id: "seattle", city: "Seattle", state: "WA", country: "USA", iata: "SEA", lat: 47.61, lng: -122.33,
    aliases: ["seattle"], rides: "us",
    tags: ["nature", "city", "food", "hiking", "culture"], hotelBase: 170, ci: 1.15, airportKm: 22,
    transit: { name: "Link light rail", cost: 3 },
    blurb: "Coffee, ferries and Mount Rainier on a clear day.",
    attractions: [spot("Space Needle", 47.62, -122.349, "city"), spot("Pike Place Market", 47.61, -122.342, "city"), spot("Chihuly Garden and Glass", 47.621, -122.35, "culture"), spot("Discovery Park", 47.657, -122.406, "nature")],
    food: [eat("Piroshky Piroshky", 47.61, -122.343, "breakfast", 1), eat("Pike Place Chowder", 47.609, -122.341, "lunch", 2), eat("Canlis", 47.642, -122.348, "dinner", 3)],
  },
  {
    id: "austin", city: "Austin", state: "TX", country: "USA", iata: "AUS", lat: 30.27, lng: -97.74,
    aliases: ["austin"], rides: "us",
    tags: ["food", "nightlife", "nature", "relax", "budget"], hotelBase: 150, ci: 1.0, airportKm: 14,
    transit: null,
    blurb: "Barbecue, live music and swimming holes.",
    attractions: [spot("Barton Springs Pool", 30.264, -97.771, "nature"), spot("Texas State Capitol", 30.275, -97.74, "culture"), spot("Zilker Park", 30.267, -97.773, "nature"), spot("South Congress Avenue", 30.25, -97.75, "shopping")],
    food: [eat("Juan in a Million", 30.255, -97.719, "breakfast", 1), eat("Franklin Barbecue", 30.27, -97.731, "lunch", 2), eat("Torchy's Tacos", 30.25, -97.754, "lunch", 1)],
  },
  {
    id: "nashville", city: "Nashville", state: "TN", country: "USA", iata: "BNA", lat: 36.16, lng: -86.78,
    aliases: ["nashville"], rides: "us",
    tags: ["nightlife", "culture", "food", "city"], hotelBase: 150, ci: 0.95, airportKm: 13,
    transit: null,
    blurb: "Live music on every corner and hot chicken to match.",
    attractions: [spot("Country Music Hall of Fame", 36.158, -86.776, "culture"), spot("Ryman Auditorium", 36.161, -86.778, "culture"), spot("Broadway honky-tonks", 36.161, -86.778, "nightlife"), spot("The Parthenon", 36.15, -86.813, "culture")],
    food: [eat("Biscuit Love", 36.152, -86.793, "breakfast", 2), eat("Hattie B's", 36.151, -86.8, "lunch", 1), eat("Prince's Hot Chicken", 36.201, -86.744, "dinner", 1)],
  },
  {
    id: "honolulu", city: "Honolulu", state: "HI", country: "USA", iata: "HNL", lat: 21.31, lng: -157.86,
    aliases: ["honolulu", "oahu", "waikiki", "hawaii"], rides: "us",
    tags: ["beach", "relax", "hiking", "nature", "romantic"], hotelBase: 230, ci: 1.3, airportKm: 14,
    transit: null,
    blurb: "Surf, volcano hikes and plate lunches.",
    attractions: [spot("Waikiki Beach", 21.277, -157.827, "beach"), spot("Diamond Head", 21.262, -157.806, "hiking"), spot("Pearl Harbor", 21.365, -157.95, "culture"), spot("Hanauma Bay", 21.269, -157.694, "beach")],
    food: [eat("Leonard's Bakery", 21.287, -157.813, "breakfast", 1), eat("Marukame Udon", 21.279, -157.829, "lunch", 1), eat("Helena's Hawaiian Food", 21.331, -157.87, "dinner", 2)],
  },
  {
    id: "bali", city: "Bali", country: "Indonesia", iata: "DPS", lat: -8.65, lng: 115.22,
    aliases: ["bali", "ubud", "seminyak", "canggu"], rides: "id",
    tags: ["beach", "relax", "culture", "nature", "food", "budget"], hotelBase: 70, ci: 0.4, airportKm: 13, transit: null,
    blurb: "Rice terraces, surf beaches and temples at a gentle price.",
    attractions: [spot("Tegallalang Rice Terraces", -8.43, 115.28, "nature"), spot("Uluwatu Temple", -8.83, 115.08, "culture"), spot("Seminyak Beach", -8.69, 115.16, "beach")],
    food: [eat("Warung Babi Guling Ibu Oka", -8.51, 115.26, "lunch", 1), eat("Locavore", -8.51, 115.26, "dinner", 3)],
  },
  {
    id: "tokyo", city: "Tokyo", country: "Japan", iata: "TYO", lat: 35.68, lng: 139.69,
    aliases: ["tokyo", "japan"], rides: "jp",
    tags: ["food", "culture", "city", "nightlife", "shopping"], hotelBase: 120, ci: 0.85, airportKm: 35, transit: null,
    blurb: "Neon nights, world-class food and quiet shrines.",
    attractions: [spot("Senso-ji Temple", 35.71, 139.8, "culture"), spot("Shibuya Crossing", 35.66, 139.7, "city"), spot("teamLab Planets", 35.65, 139.79, "culture")],
    food: [eat("Tsukiji Outer Market", 35.66, 139.77, "breakfast", 2), eat("Ichiran Shibuya", 35.66, 139.7, "dinner", 1)],
  },
  {
    id: "lisbon", city: "Lisbon", country: "Portugal", iata: "LIS", lat: 38.72, lng: -9.14,
    aliases: ["lisbon", "portugal"], rides: "eu",
    tags: ["food", "culture", "city", "nightlife", "beach", "budget"], hotelBase: 95, ci: 0.7, airportKm: 7,
    transit: { name: "Metro", cost: 3 },
    blurb: "Tiled hills, custard tarts and sunset miradouros.",
    attractions: [spot("Belem Tower", 38.69, -9.22, "culture"), spot("Alfama District", 38.71, -9.13, "culture"), spot("Cascais Beach", 38.69, -9.42, "beach")],
    food: [eat("Pasteis de Belem", 38.7, -9.2, "breakfast", 1), eat("Time Out Market", 38.71, -9.15, "lunch", 2)],
  },
  {
    id: "cancun", city: "Cancun", country: "Mexico", iata: "CUN", lat: 21.16, lng: -86.85,
    aliases: ["cancun", "mexico", "tulum", "playa del carmen"], rides: "mx",
    tags: ["beach", "relax", "nightlife", "family", "budget"], hotelBase: 110, ci: 0.75, airportKm: 20, transit: null,
    blurb: "Turquoise water, all-inclusives and Mayan ruins nearby.",
    attractions: [spot("Isla Mujeres", 21.23, -86.73, "beach"), spot("Chichen Itza (day trip)", 20.68, -88.57, "culture"), spot("Playa Delfines", 21.07, -86.78, "beach")],
    food: [eat("Mercado 23", 21.16, -86.83, "breakfast", 1), eat("La Parrilla", 21.16, -86.82, "dinner", 2)],
  },
  {
    id: "paris", city: "Paris", country: "France", iata: "PAR", lat: 48.86, lng: 2.35,
    aliases: ["paris", "france"], rides: "eu",
    tags: ["culture", "food", "city", "romantic", "shopping"], hotelBase: 160, ci: 1.2, airportKm: 30,
    transit: { name: "RER B train", cost: 14 },
    blurb: "Museums, bakeries and long walks along the Seine.",
    attractions: [spot("Louvre Museum", 48.86, 2.34, "culture"), spot("Eiffel Tower", 48.86, 2.29, "city"), spot("Montmartre", 48.89, 2.34, "culture")],
    food: [eat("Du Pain et des Idees", 48.87, 2.36, "breakfast", 2), eat("Le Marais Falafel Row", 48.857, 2.36, "lunch", 1)],
  },
  {
    id: "reykjavik", city: "Reykjavik", country: "Iceland", iata: "KEF", lat: 64.15, lng: -21.94,
    aliases: ["reykjavik", "iceland"], rides: "is",
    tags: ["nature", "hiking", "adventure", "relax"], hotelBase: 175, ci: 1.4, airportKm: 50,
    transit: { name: "Flybus", cost: 35 },
    blurb: "Glaciers, geysers and hot springs under the northern lights.",
    attractions: [spot("Blue Lagoon", 63.88, -22.45, "relax"), spot("Golden Circle", 64.31, -20.3, "nature"), spot("Hallgrimskirkja", 64.14, -21.93, "culture")],
    food: [eat("Baejarins Beztu Pylsur", 64.15, -21.94, "lunch", 1), eat("Fish Market", 64.15, -21.94, "dinner", 3)],
  },
  {
    id: "lagos", city: "Lagos", country: "Nigeria", iata: "LOS", lat: 6.52, lng: 3.38,
    aliases: ["lagos", "nigeria"], rides: "ng",
    tags: ["nightlife", "food", "culture", "city", "beach"], hotelBase: 85, ci: 0.45, airportKm: 22, transit: null,
    blurb: "Afrobeats, suya and the Atlantic coast.",
    attractions: [spot("Lekki Conservation Centre", 6.44, 3.53, "nature"), spot("Nike Art Gallery", 6.43, 3.47, "culture"), spot("Elegushi Beach", 6.44, 3.48, "beach")],
    food: [eat("Bukka Hut", 6.45, 3.42, "lunch", 1), eat("Terra Kulture", 6.43, 3.42, "dinner", 2)],
  },
  {
    id: "barcelona", city: "Barcelona", country: "Spain", iata: "BCN", lat: 41.39, lng: 2.17,
    aliases: ["barcelona", "spain"], rides: "eu",
    tags: ["beach", "food", "culture", "nightlife", "city"], hotelBase: 130, ci: 0.85, airportKm: 14,
    transit: { name: "Aerobus", cost: 8 },
    blurb: "Gaudi, tapas and city beaches.",
    attractions: [spot("Sagrada Familia", 41.4, 2.17, "culture"), spot("Park Guell", 41.41, 2.15, "nature"), spot("Barceloneta Beach", 41.38, 2.19, "beach")],
    food: [eat("La Boqueria Market", 41.38, 2.17, "breakfast", 1), eat("Bar Canyes", 41.38, 2.18, "dinner", 2)],
  },
  {
    id: "banff", city: "Banff", country: "Canada", iata: "YYC", lat: 51.18, lng: -115.57,
    aliases: ["banff", "calgary"], rides: "ca",
    tags: ["hiking", "nature", "adventure", "relax", "family"], hotelBase: 190, ci: 1.1, airportKm: 145, transit: null,
    blurb: "Turquoise lakes and Rocky Mountain trails.",
    attractions: [spot("Lake Louise", 51.42, -116.18, "nature"), spot("Moraine Lake", 51.32, -116.19, "nature"), spot("Banff Gondola", 51.14, -115.57, "adventure")],
    food: [eat("Banff Avenue Brewing Co.", 51.18, -115.57, "lunch", 2), eat("Park Distillery", 51.18, -115.57, "dinner", 2)],
  },
  {
    id: "dubai", city: "Dubai", country: "UAE", iata: "DXB", lat: 25.2, lng: 55.27,
    aliases: ["dubai", "uae"], rides: "ae",
    tags: ["shopping", "city", "luxury", "beach", "nightlife"], hotelBase: 150, ci: 1.0, airportKm: 15,
    transit: { name: "Metro", cost: 3 },
    blurb: "Skyscrapers, souks and desert safaris.",
    attractions: [spot("Burj Khalifa", 25.2, 55.27, "city"), spot("Desert Safari", 24.9, 55.5, "adventure"), spot("Jumeirah Beach", 25.2, 55.26, "beach")],
    food: [eat("Arabian Tea House", 25.26, 55.3, "breakfast", 2), eat("Al Ustad Special Kabab", 25.26, 55.3, "dinner", 1)],
  },
];

const origin = (id, city, state, country, iata, lat, lng, aliases, rides = "us", airportKm = 20, ci = 1.0) => ({
  id, city, state, country, iata, lat, lng, aliases, rides, airportKm, ci,
});

// Departure-only airports (no destination content).
export const EXTRA_ORIGINS = [
  origin("sandiego", "San Diego", "CA", "USA", "SAN", 32.72, -117.16, ["san diego"], "us", 6, 1.1),
  origin("sanjose", "San Jose", "CA", "USA", "SJC", 37.34, -121.89, ["san jose", "silicon valley"], "us", 8, 1.25),
  origin("sacramento", "Sacramento", "CA", "USA", "SMF", 38.58, -121.49, ["sacramento"], "us", 16, 1.0),
  origin("oakland", "Oakland", "CA", "USA", "OAK", 37.8, -122.27, ["oakland"], "us", 8, 1.2),
  origin("orangecounty", "Orange County", "CA", "USA", "SNA", 33.75, -117.87, ["orange county", "irvine", "anaheim"], "us", 10, 1.15),
  origin("burbank", "Burbank", "CA", "USA", "BUR", 34.18, -118.31, ["burbank"], "us", 6, 1.1),
  origin("boston", "Boston", "MA", "USA", "BOS", 42.36, -71.06, ["boston"], "us", 8, 1.3),
  origin("washington", "Washington", "DC", "USA", "DCA", 38.91, -77.04, ["washington dc", "washington, dc", "DC"], "us", 8, 1.2),
  origin("philadelphia", "Philadelphia", "PA", "USA", "PHL", 39.95, -75.17, ["philadelphia", "philly"], "us", 12, 1.05),
  origin("denver", "Denver", "CO", "USA", "DEN", 39.74, -104.99, ["denver"], "us", 38, 1.05),
  origin("phoenix", "Phoenix", "AZ", "USA", "PHX", 33.45, -112.07, ["phoenix"], "us", 8, 0.95),
  origin("portland", "Portland", "OR", "USA", "PDX", 45.52, -122.68, ["portland"], "us", 16, 1.05),
  origin("minneapolis", "Minneapolis", "MN", "USA", "MSP", 44.98, -93.27, ["minneapolis"], "us", 16, 1.0),
  origin("detroit", "Detroit", "MI", "USA", "DTW", 42.33, -83.05, ["detroit"], "us", 30, 0.95),
  origin("saltlake", "Salt Lake City", "UT", "USA", "SLC", 40.76, -111.89, ["salt lake city", "salt lake"], "us", 12, 0.95),
  origin("atlanta", "Atlanta", "GA", "USA", "ATL", 33.75, -84.39, ["atlanta", "atl"], "us", 17, 1.0),
  origin("dallas", "Dallas", "TX", "USA", "DFW", 32.78, -96.8, ["dallas", "fort worth"], "us", 28, 1.0),
  origin("houston", "Houston", "TX", "USA", "IAH", 29.76, -95.37, ["houston"], "us", 32, 0.95),
  origin("toronto", "Toronto", "ON", "Canada", "YYZ", 43.65, -79.38, ["toronto"], "ca", 27, 1.0),
  origin("london", "London", "", "UK", "LHR", 51.51, -0.13, ["london"], "eu", 25, 1.4),
];

export const PLACES = [...DESTINATIONS, ...EXTRA_ORIGINS];

export const findPlace = (id) => PLACES.find((p) => p.id === id);
export const findDestination = (id) => DESTINATIONS.find((d) => d.id === id);

export const placeLabel = (p) => (p.state ? `${p.city}, ${p.state}` : `${p.city}, ${p.country}`) + ` (${p.iata})`;

// What a bare state name means, as a departure point or as a destination.
export const STATE_ALIASES = {
  california: { origin: "losangeles", dest: ["losangeles", "sanfrancisco"] },
  florida: { origin: "miami", dest: ["miami", "orlando"] },
  texas: { origin: "dallas", dest: ["austin"] },
  nevada: { origin: "lasvegas", dest: ["lasvegas"] },
  tennessee: { origin: "nashville", dest: ["nashville"] },
  washington: { origin: "seattle", dest: ["seattle"] },
};
