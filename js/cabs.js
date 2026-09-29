/* ============================================
   Cabs page — per-day hire + route tours.
   Renders vehicles/routes from cabs-data.js,
   handles tab switch, selection, price calc,
   and Book → checkout.
   ============================================ */

(function () {
  if (typeof CAB_VEHICLES === "undefined") return;
  const INR = (n) => "₹" + n.toLocaleString("en-IN");
  const $ = (id) => document.getElementById(id);
  const toast = (m, t) => (window.showToast ? showToast(m, t) : alert(m));
  const todayStr = () => {
    // local YYYY-MM-DD without Date.now dependence issues
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  /* ---- Tab switch: hire | routes ---- */
  const tabs = document.querySelector("[data-cab-tabs]");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cabtab]");
      if (!btn) return;
      const key = btn.dataset.cabtab;
      tabs.querySelectorAll("[data-cabtab]").forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-cabpanel]").forEach((p) => { p.hidden = p.dataset.cabpanel !== key; });
    });
  }

  /* ---- Per-day hire ---- */
  const grid = $("cabVehicleGrid");
  let selected = CAB_VEHICLES[0];

  function renderVehicles() {
    grid.innerHTML = CAB_VEHICLES.map((v) => `
      <button type="button" class="cab-card${v === selected ? " is-selected" : ""}" data-vehicle="${v.id}">
        <div class="cab-card__media"><img src="${v.img}" alt="${v.name}" loading="lazy"><span class="cab-card__tag">${v.tag}</span></div>
        <div class="cab-card__body">
          <div class="cab-card__row">
            <b>${v.name}</b>
            <span class="cab-card__price tnum">${INR(v.perDay)}<small>/day</small></span>
          </div>
          <ul class="cab-card__feats">
            ${v.features.map((f) => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>${f}</li>`).join("")}
          </ul>
        </div>
      </button>`).join("");
  }

  function recalcHire() {
    const days = parseInt($("qDays").value, 10) || 1;
    const total = selected.perDay * days;
    $("qVehicle").textContent = selected.name;
    $("qRate").textContent = INR(selected.perDay);
    $("qTotal").textContent = INR(total);
    return total;
  }

  if (grid) {
    renderVehicles();
    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-vehicle]");
      if (!card) return;
      selected = CAB_VEHICLES.find((v) => v.id === card.dataset.vehicle) || selected;
      grid.querySelectorAll(".cab-card").forEach((c) => c.classList.toggle("is-selected", c === card));
      recalcHire();
    });
    $("qDays").addEventListener("change", recalcHire);
    recalcHire();

    // no past start date
    const dateEl = $("qDate");
    dateEl.min = todayStr();

    $("hireBookBtn").addEventListener("click", () => {
      const days = parseInt($("qDays").value, 10) || 1;
      const pax = $("qPax").value;
      const date = dateEl.value;

      // ---- validation ----
      dateEl.classList.remove("is-invalid");
      if (!date) {
        dateEl.classList.add("is-invalid");
        dateEl.focus();
        toast("Please choose a start date for your cab.", "error");
        return;
      }
      if (date < todayStr()) {
        dateEl.classList.add("is-invalid");
        toast("Start date cannot be in the past.", "error");
        return;
      }

      const total = selected.perDay * days;
      const q = new URLSearchParams({
        type: "cab",
        pkg: `${selected.name} — ${days} Day${days > 1 ? "s" : ""} Hire`,
        price: total,
        meta: `${pax} passenger(s) · ${date} · ${selected.name}`,
        img: selected.img,
        qty: "1",
      });
      location.href = "checkout.html?" + q.toString();
    });
  }

  /* ---- Route cab tours ---- */
  const routeGrid = $("cabRouteGrid");
  if (routeGrid && typeof CAB_ROUTES !== "undefined") {
    routeGrid.innerHTML = CAB_ROUTES.map((r) => {
      const classes = Object.keys(r.prices);
      return `
      <article class="card cab-route" data-route="${r.id}">
        <div class="cab-route__media"><img src="${r.img}" alt="${r.route}" loading="lazy"><span class="badge badge--duration">${r.days}</span></div>
        <div class="cab-route__body">
          <h3 class="cab-route__title">${r.route}</h3>
          <div class="cab-route__opts">
            ${classes.map((c, i) => `
              <button type="button" class="cab-route__opt${i === 0 ? " is-active" : ""}" data-cls="${c}" data-price="${r.prices[c]}">
                <span>${c}</span><b class="tnum">${INR(r.prices[c])}</b>
              </button>`).join("")}
          </div>
          <a href="#" class="btn btn--primary btn--sm cab-route__book" style="width:100%;justify-content:center;">Book This Cab
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </article>`;
    }).join("");

    // per-card: choose class + book
    routeGrid.querySelectorAll(".cab-route").forEach((card) => {
      const r = CAB_ROUTES.find((x) => x.id === card.dataset.route);
      let cls = Object.keys(r.prices)[0];
      let price = r.prices[cls];
      card.querySelectorAll(".cab-route__opt").forEach((opt) => {
        opt.addEventListener("click", () => {
          card.querySelectorAll(".cab-route__opt").forEach((o) => o.classList.toggle("is-active", o === opt));
          cls = opt.dataset.cls; price = parseInt(opt.dataset.price, 10);
        });
      });
      card.querySelector(".cab-route__book").addEventListener("click", (e) => {
        e.preventDefault();
        const q = new URLSearchParams({
          type: "cab",
          pkg: `${r.route} (${cls})`,
          price: price,
          meta: `${r.days} · ${cls} · Whole cab`,
          img: r.img,
          qty: "1",
        });
        location.href = "checkout.html?" + q.toString();
      });
    });
  }
})();
