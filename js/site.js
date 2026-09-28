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

/* ---- Mobile nav toggle ---- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    if (open) {
      Object.assign(nav.style, {
        display: "flex", position: "absolute", top: "var(--header-h)",
        left: "0", right: "0", flexDirection: "column", background: "#fff",
        padding: "16px 24px", boxShadow: "var(--shadow-md)", gap: "8px",
      });
    } else {
      nav.style.display = "";
    }
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (window.innerWidth <= 960) { nav.classList.remove("open"); nav.style.display = ""; }
    })
  );
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
function validPhone(v) { return /^[+\d][\d\s-]{7,}$/.test(v.trim()); }

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
  document.querySelectorAll("form.site-form").forEach((form) => {
    // live-clear errors on input
    form.querySelectorAll(".form-control").forEach((f) =>
      f.addEventListener("input", () => clearError(f)));

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
          fieldError(f, "Enter a valid phone number.");
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
        showToast("Thank you! Your message has been received. We'll get back to you soon.", "success");
      }, 700);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initActiveNav();
  initNav();
  initFilters();
  initTabs();
  initGallerySwap();
  initForms();
});
