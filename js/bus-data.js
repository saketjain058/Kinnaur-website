/* ============================================
   Bus route catalogue + seat layout config.
   Used by bus-tickets.html and checkout.
   ============================================ */

/* Bus routes with fare per seat */
const BUS_ROUTES = [
  {
    id: "shimla-reckongpeo",
    from: "Shimla",
    to: "Reckong Peo",
    depart: "06:30 AM",
    arrive: "05:30 PM",
    duration: "11h",
    fare: 850,
    type: "AC Semi-Sleeper",
    img: "assets/images/hero-bus.jpg",
  },
  {
    id: "shimla-kaza",
    from: "Shimla",
    to: "Kaza (Spiti)",
    depart: "05:00 AM",
    arrive: "09:00 PM",
    duration: "16h",
    fare: 1350,
    type: "AC Semi-Sleeper",
    img: "assets/images/hero-bus.jpg",
  },
  {
    id: "chandigarh-sangla",
    from: "Chandigarh",
    to: "Sangla",
    depart: "07:00 AM",
    arrive: "08:00 PM",
    duration: "13h",
    fare: 1100,
    type: "AC Seater",
    img: "assets/images/hero-bus.jpg",
  },
  {
    id: "manali-kaza",
    from: "Manali",
    to: "Kaza (Spiti)",
    depart: "05:30 AM",
    arrive: "03:30 PM",
    duration: "10h",
    fare: 1000,
    type: "Deluxe Seater",
    img: "assets/images/hero-bus.jpg",
  },
  {
    id: "delhi-reckongpeo",
    from: "Delhi",
    to: "Reckong Peo",
    depart: "08:00 PM",
    arrive: "04:00 PM",
    duration: "20h",
    fare: 1600,
    type: "AC Sleeper",
    img: "assets/images/hero-bus.jpg",
  },
];

/* Seat layout: 2 + 2, rows A..K (44 seats).
   Some seats pre-marked booked (deterministic, no RNG). */
const BUS_SEAT_CONFIG = {
  rows: 11,           // A..K
  leftCols: 2,        // window + aisle
  rightCols: 2,
  // seats already taken (per route id) — deterministic demo data
  booked: {
    "shimla-reckongpeo": ["A1", "A2", "C3", "D4", "F1", "G2", "J3"],
    "shimla-kaza": ["B1", "B2", "E3", "E4", "H1"],
    "chandigarh-sangla": ["A3", "A4", "D1", "D2", "G3", "G4", "K1", "K2"],
    "manali-kaza": ["C1", "F4", "I2", "I3"],
    "delhi-reckongpeo": ["A1", "B2", "C3", "D4", "E1", "F2", "G3", "H4", "K1"],
  },
};
