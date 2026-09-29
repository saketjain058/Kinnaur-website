/* ============================================
   Cab catalogue — vehicles (per-day hire) +
   fixed route cab tours. Single source of truth
   for cabs.html and checkout.
   ============================================ */

/* Per-day hire vehicles */
const CAB_VEHICLES = [
  {
    id: "innova-scorpio",
    name: "Innova / Scorpio",
    seats: 6,
    perDay: 5500,
    img: "assets/images/hero-car.jpg",
    tag: "Popular",
    features: ["6 seater", "AC", "Experienced hill driver", "Fuel included"],
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    seats: 6,
    perDay: 6000,
    img: "assets/images/hero-car.jpg",
    tag: "Comfort",
    features: ["6 seater", "Premium AC", "Extra legroom", "Fuel included"],
  },
  {
    id: "fortuner-4x4",
    name: "Fortuner 4X4",
    seats: 6,
    perDay: 10000,
    img: "assets/images/hero-car.jpg",
    tag: "Luxury 4X4",
    features: ["6 seater", "4X4 drive", "High ground clearance", "Fuel included"],
  },
];

/* Fixed route cab tours (whole-cab price, choose vehicle class) */
const CAB_ROUTES = [
  {
    id: "shimla-manali-spiti",
    route: "Shimla → Manali via Spiti",
    days: "7–8 Days",
    img: "assets/images/kaza-spiti.jpg",
    prices: { "Innova Crysta": 45000, "Fortuner 4X4": 65000 },
  },
  {
    id: "chandigarh-circuit",
    route: "Chandigarh → Shimla → Kinnaur/Spiti → Manali → Chandigarh",
    days: "9–10 Days",
    img: "assets/images/mirror-lake.jpg",
    prices: { "Innova Crysta": 55000, "Fortuner 4X4": 80000 },
  },
  {
    id: "kinnaur-valley-cab",
    route: "Shimla → Sangla → Chitkul → Kalpa → Shimla",
    days: "5–6 Days",
    img: "assets/images/chitkul-village.jpg",
    prices: { "Innova Crysta": 32000, "Fortuner 4X4": 46000 },
  },
  {
    id: "spiti-circuit-cab",
    route: "Manali → Kaza → Chandratal → Manali",
    days: "6–7 Days",
    img: "assets/images/chandratal-lake.jpg",
    prices: { "Innova Crysta": 40000, "Fortuner 4X4": 58000 },
  },
];
