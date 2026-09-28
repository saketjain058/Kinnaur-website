/* ============================================
   Package detail renderer — reads ?id= from the
   URL and fills the page from PACKAGES (packages-data.js).
   Falls back to the first package if id missing/unknown.
   Runs before site.js so tabs / gallery-swap bind to
   the rendered DOM.
   ============================================ */

(function () {
  if (typeof PACKAGES === "undefined") return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const keys = Object.keys(PACKAGES);
  const key = (id && PACKAGES[id]) ? id : keys[0];
  const p = PACKAGES[key];

  const INR = (n) => "₹" + n.toLocaleString("en-IN");
  const set = (elId, val) => { const e = document.getElementById(elId); if (e) e.textContent = val; };
  const IMG = (name) => name.startsWith("assets/") ? name : `assets/images/${name}`;

  const check = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';

  // ---- Titles / meta ----
  document.title = `${p.title} — Incredible Kinnaur Holidays`;
  set("crumbTitle", p.title);
  set("pkgTitle", p.title);
  set("pkgDuration", p.duration);
  set("pkgLocation", p.location);
  set("pkgPriceTop", INR(p.price));

  // ---- Sidebar ----
  set("pkgPriceSide", INR(p.price));
  set("sideDuration", p.duration);
  set("sideLocation", p.location);
  set("sideGroup", p.group);
  set("sideSeason", p.season);

  // ---- Overview + highlights ----
  set("pkgOverview", p.overview);
  const hl = document.getElementById("pkgHighlights");
  if (hl) hl.innerHTML = p.highlights.map((h) => `<li>${check} ${h}</li>`).join("");

  // ---- Itinerary ----
  const it = document.getElementById("pkgItinerary");
  if (it) it.innerHTML = p.itinerary
    .map(([day, text]) => `<li style="padding:8px 0;"><b>${day}:</b> ${text}</li>`).join("");

  // ---- Gallery (main + thumbs) ----
  const main = document.getElementById("galleryMain");
  const thumbs = document.getElementById("galleryThumbs");
  if (main) { main.src = IMG(p.hero); main.alt = p.title; }
  if (thumbs && p.gallery && p.gallery.length) {
    thumbs.innerHTML = p.gallery.map((g, i) =>
      `<img class="${i === 0 ? "active" : ""}" src="${IMG(g)}" alt="${p.title} photo ${i + 1}">`).join("");
    // keep main in sync with first thumb
    if (main) { main.src = IMG(p.gallery[0]); }
  }

  // ---- Book Now -> checkout with this package ----
  const book = document.getElementById("bookNowBtn");
  if (book) {
    const q = new URLSearchParams({
      pkg: p.title, price: p.price,
      meta: `${p.duration} · ${p.location}`, img: IMG(p.hero),
    });
    book.href = "checkout.html?" + q.toString();
  }
})();
