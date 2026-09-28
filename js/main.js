/* ============================================
   Site data + rendering + interactions
   ============================================ */

const IMG = (name) => `assets/images/${name}`;

/* ---- Data ---- */
const packages = [
  {
    id: "chandigarh-kinnaur-spiti-manali",
    duration: "9 Nights / 10 Days",
    title: "Chandigarh – Kinnaur – Spiti – Manali – Chandigarh",
    stops: ["Chandigarh", "Kalpa", "Kaza", "Manali"],
    desc: "Complete Himalayan circuit covering Kinnaur and Spiti with scenic drives, local experiences and more.",
    price: "₹ 55,000",
    img: "kalpa-village.jpg",
  },
  {
    id: "shimla-kinnaur-spiti-manali",
    duration: "7 Nights / 8 Days",
    title: "Shimla – Kinnaur – Spiti – Manali",
    stops: ["Shimla", "Sangla", "Kaza", "Manali"],
    desc: "A perfect short itinerary to experience the best of Kinnaur and Spiti with comfortable travel and stays.",
    price: "₹ 45,000",
    img: "sangla-valley.jpg",
  },
  {
    id: "chandigarh-kinnaur-spiti-chandratal",
    duration: "8 Nights / 9 Days",
    title: "Chandigarh – Kinnaur – Spiti – Chandigarh",
    stops: ["Chandigarh", "Kalpa", "Kaza", "Chandratal"],
    desc: "Explore the magical landscapes of Kinnaur and Spiti including the stunning Chandratal.",
    price: "₹ 55,000",
    img: "mirror-lake.jpg",
  },
];

const destinations = [
  { name: "Kalpa", sub: "Apple orchards with Kinner Kailash views", img: "kalpa-village.jpg" },
  { name: "Sangla", sub: "Picturesque valley and Baspa river", img: "sangla-valley.jpg" },
  { name: "Chitkul", sub: "India's last village on the Indo-Tibet border", img: "chitkul-village.jpg" },
  { name: "Kaza", sub: "Heart of Spiti with monasteries and culture", img: "kaza-spiti.jpg" },
  { name: "Chandratal", sub: "The stunning high-altitude lake", img: "chandratal-lake.jpg" },
];

const reviews = [
  { name: "Rohit Sharma", city: "Delhi", text: "An unforgettable journey! The team was very professional and the entire trip was well planned. Kinnaur and Spiti are truly magical." },
  { name: "Priya Mehta", city: "Mumbai", text: "Amazing experience, beautiful locations and great support throughout the trip. Highly recommended for Himalayan adventures!" },
  { name: "Amit Verma", city: "Bengaluru", text: "Everything was perfectly arranged – hotels, transport and itinerary. Loved Chitkul and Chandratal. Will travel again!" },
];

/* ---- Icon snippets ---- */
const pin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const starSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.8L12 17l-6.9 3.5 1.6-6.8L1.4 9.1l7-.6z"/></svg>';
const stars = starSvg.repeat(5);

/* ---- Deterministic avatar color from name ---- */
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 45%, 42%)`;
}
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* ---- Build checkout link from a package (price string -> number) ---- */
function checkoutUrl(p) {
  const price = parseInt(String(p.price).replace(/[^\d]/g, ""), 10) || 0;
  const q = new URLSearchParams({ pkg: p.title, price, meta: p.duration, img: IMG(p.img) });
  return "checkout.html?" + q.toString();
}

/* ---- Renderers ---- */
function renderPackages() {
  document.getElementById("pkgGrid").innerHTML = packages.map((p) => `
    <article class="card pkg">
      <div class="pkg__media">
        <img src="${IMG(p.img)}" alt="${p.title}" loading="lazy" />
        <span class="badge badge--duration">${p.duration}</span>
      </div>
      <div class="pkg__body">
        <h3 class="pkg__title">${p.title}</h3>
        <div class="pkg__chips">
          ${p.stops.map((s) => `<span class="chip">${pin}${s}</span>`).join("")}
        </div>
        <p class="pkg__desc">${p.desc}</p>
        <div class="pkg__foot">
          <div class="pkg__price"><b class="tnum">${p.price}</b><span>per person</span></div>
          <div class="pkg__actions">
            <a href="package-detail.html?id=${p.id}" class="btn btn--outline btn--sm">Details</a>
            <a href="${checkoutUrl(p)}" class="btn btn--primary btn--sm">Book Now ${arrow}</a>
          </div>
        </div>
      </div>
    </article>`).join("");
}

function renderDestinations() {
  document.getElementById("destGrid").innerHTML = destinations.map((d) => `
    <a href="gallery.html" class="dest">
      <img src="${IMG(d.img)}" alt="${d.name}" loading="lazy" />
      <span class="dest__grad"></span>
      <div class="dest__body">
        <div><b>${d.name}</b><span>${d.sub}</span></div>
        <span class="dest__go">${arrow}</span>
      </div>
    </a>`).join("");
}

function renderReviews() {
  document.getElementById("revGrid").innerHTML = reviews.map((r) => `
    <article class="card review">
      <div class="review__head">
        <span class="avatar" style="background:${avatarColor(r.name)}">${initials(r.name)}</span>
        <div><b>${r.name}</b><span>${r.city}</span></div>
      </div>
      <div class="stars">${stars}</div>
      <p>&ldquo;${r.text}&rdquo;</p>
    </article>`).join("");
}

/* ---- Boot (home page only; nav/tabs handled by site.js) ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("pkgGrid")) renderPackages();
  if (document.getElementById("destGrid")) renderDestinations();
  if (document.getElementById("revGrid")) renderReviews();
});
