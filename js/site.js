/* ============================================
   Shared site JS — runs on every page
   (nav active state, mobile toggle, tabs,
   filters, gallery thumbs)
   ============================================ */

/* ---- Mark active nav link from <body data-page="..."> ---- */
function initActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  const link = document.querySelector(`.nav a[data-nav="${page}"]`);
  link?.classList.add("active");
}

/* ---- Mobile nav drawer (slide-in from right + backdrop) ---- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  // backdrop overlay (created once)
  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
  }

  // The header has backdrop-filter, which makes it a containing block for
  // fixed descendants — that traps the drawer at the scrolled header position.
  // Relocate the drawer to <body> so position:fixed is viewport-relative.
  const homeParent = nav.parentElement;   // .site-header .container
  const homeNext = nav.nextElementSibling;
  let scrollY = 0;

  // Close (✕) button INSIDE the drawer — when the drawer is moved to <body>
  // it covers the header hamburger, so the drawer needs its own close control.
  let closeBtn = nav.querySelector(".nav-close");
  if (!closeBtn) {
    closeBtn = document.createElement("button");
    closeBtn.className = "nav-close";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    nav.insertBefore(closeBtn, nav.firstChild);
  }

  const open = () => {
    document.body.appendChild(nav);        // escape header containing block
    // lock scroll without jump: pin body at current scroll
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add("nav-lock");
    // next frame so the transform transition plays from off-screen
    requestAnimationFrame(() => nav.classList.add("open"));
    toggle.classList.add("is-open");
    backdrop.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    nav.classList.remove("open");
    toggle.classList.remove("is-open");
    backdrop.classList.remove("show");
    // restore scroll position
    document.body.classList.remove("nav-lock");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
    // put the drawer back into the header for desktop layout
    if (homeNext) homeParent.insertBefore(nav, homeNext);
    else homeParent.appendChild(nav);
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open());
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  // reset if resized back to desktop
  window.addEventListener("resize", () => { if (window.innerWidth > 960) close(); });
}

/* ---- Generic filter tabs: [data-filter-group] wraps buttons[data-filter];
        items live in [data-filter-items] with [data-cat] ---- */
function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const items = document.querySelector(group.dataset.filterGroup); // selector to item container
    if (!items) return;
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      group.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      items.querySelectorAll("[data-cat]").forEach((el) => {
        el.style.display = (cat === "all" || el.dataset.cat.split(" ").includes(cat)) ? "" : "none";
      });
    });
  });
}

/* ---- Detail page tabs ---- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-tab]");
      if (!btn) return;
      tabs.querySelectorAll("button[data-tab]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      document.querySelectorAll("[data-panel]").forEach((p) => {
        p.style.display = p.dataset.panel === target ? "" : "none";
      });
    });
  });
}

/* ---- Gallery main/thumb swap (package detail) ---- */
function initGallerySwap() {
  const main = document.getElementById("galleryMain");
  if (!main) return;
  document.querySelectorAll(".gallery-thumbs img").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".gallery-thumbs img").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      main.src = t.src;
    });
  });
}

/* ---- Toast notification ---- */
function showToast(msg, type = "success") {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = `toast toast--${type} toast--show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 4200);
}

/* ---- Form validation + fake success (no backend yet) ---- */
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validPhone(v) { return /^\d{10}$/.test(v.replace(/\D/g, "")); }

function fieldError(field, msg) {
  const wrap = field.closest(".form-field") || field.parentElement;
  field.classList.add("is-invalid");
  let e = wrap.querySelector(".field-error");
  if (!e) { e = document.createElement("small"); e.className = "field-error"; wrap.appendChild(e); }
  e.textContent = msg;
}
function clearError(field) {
  field.classList.remove("is-invalid");
  const wrap = field.closest(".form-field") || field.parentElement;
  const e = wrap && wrap.querySelector(".field-error");
  if (e) e.remove();
}

function initForms() {
  document.querySelectorAll("form.site-form:not([data-custom])").forEach((form) => {
    // live-clear errors on input
    form.querySelectorAll(".form-control").forEach((f) =>
      f.addEventListener("input", () => clearError(f)));

    // phone: digits only, max 10
    form.querySelectorAll('input[type="tel"]').forEach((f) => {
      f.setAttribute("inputmode", "numeric");
      f.setAttribute("maxlength", "10");
      f.addEventListener("input", () => { f.value = f.value.replace(/\D/g, "").slice(0, 10); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      let firstBad = null;

      form.querySelectorAll(".form-control").forEach((f) => {
        clearError(f);
        const val = (f.value || "").trim();
        const required = f.hasAttribute("required");
        // skip selects with a chosen value
        if (required && !val) {
          fieldError(f, "This field is required.");
          ok = false; firstBad = firstBad || f; return;
        }
        if (f.type === "email" && val && !validEmail(val)) {
          fieldError(f, "Enter a valid email address.");
          ok = false; firstBad = firstBad || f; return;
        }
        if (f.type === "tel" && val && !validPhone(val)) {
          fieldError(f, "Enter a valid 10-digit mobile number.");
          ok = false; firstBad = firstBad || f;
        }
      });

      if (!ok) {
        firstBad && firstBad.focus();
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      // success (front-end only — no backend connected)
      const btn = form.querySelector("button[type=submit], button");
      const label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.dataset.label = label; btn.innerHTML = "Sending…"; }

      setTimeout(() => {
        form.reset();
        form.querySelectorAll(".is-invalid").forEach((f) => clearError(f));
        if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label; }
        const msg = form.dataset.success || "Thank you! Your message has been received. We'll get back to you soon.";
        showToast(msg, "success");
      }, 700);
    });
  });
}

/* ---- Hero slideshow (auto-rotate + dots) ---- */
function initHeroSlider() {
  const hero = document.querySelector("[data-hero-slider]");
  if (!hero) return;
  const slides = [...hero.querySelectorAll("[data-slide]")];
  const dots = [...hero.querySelectorAll("[data-dot]")];
  if (slides.length < 2) return;

  let i = 0;
  let timer = null;
  const DELAY = 5000;

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
  };
  const next = () => show(i + 1);
  const start = () => { stop(); timer = setInterval(next, DELAY); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };

  dots.forEach((d, k) => d.addEventListener("click", () => { show(k); start(); }));
  // pause when tab hidden, resume when visible
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  show(0);
  start();
}

document.addEventListener("DOMContentLoaded", () => {
  initActiveNav();
  initNav();
  initFilters();
  initTabs();
  initGallerySwap();
  initForms();
  initHeroSlider();
});
