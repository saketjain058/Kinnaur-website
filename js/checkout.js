/* ============================================
   Checkout (demo / UI-only payment flow)
   Reads package + price from URL params, computes
   totals, switches Paytm-style methods, fake-pays.
   Backend/real gateway wired later.
   ============================================ */

(function () {
  const params = new URLSearchParams(location.search);

  // ---- Order data (URL params, with sensible defaults) ----
  const order = {
    type: params.get("type") || "tour",     // tour | cab | bus
    name: params.get("pkg") || "Kinnaur Valley Tour",
    unit: parseInt(params.get("price") || "18999", 10),
    meta: params.get("meta") || "6 Days 5 Nights · Kinnaur, HP",
    img: params.get("img") || "assets/images/kalpa-village.jpg",
    qty: parseInt(params.get("qty") || "0", 10),   // fixed qty (cab/bus pass 1)
  };

  const INR = (n) => "₹" + n.toLocaleString("en-IN");

  const $ = (id) => document.getElementById(id);
  const qtyEl = $("travellers");

  // Cab & bus prices are already the FINAL amount (whole cab / all seats),
  // so the traveller multiplier doesn't apply — lock qty to 1 and relabel.
  const fixedQty = order.type === "cab" || order.type === "bus";
  if (fixedQty) {
    // replace the travellers <select> with a static value + hide its multiplier effect
    const field = qtyEl.closest(".form-field");
    if (field) {
      const label = field.querySelector("label");
      if (label) label.textContent = order.type === "bus" ? "Passengers" : "Travellers";
    }
    // lock select to the passed qty (1) and disable
    qtyEl.value = "1";
    qtyEl.disabled = true;
    // relabel the summary "Travellers" row
    const qtyRow = $("orderQty") && $("orderQty").closest(".order-row");
    if (qtyRow) {
      const lbl = qtyRow.querySelector("span");
      if (lbl) lbl.textContent = order.type === "bus" ? "Seats/booking" : "Booking";
    }
    // relabel "Price / person"
    const unitRow = $("orderUnit") && $("orderUnit").closest(".order-row");
    if (unitRow) {
      const lbl = unitRow.querySelector("span");
      if (lbl) lbl.textContent = order.type === "bus" ? "Ticket total" : "Cab total";
    }
  }

  function recalc() {
    const qty = fixedQty ? 1 : (parseInt(qtyEl.value, 10) || 1);
    const sub = order.unit * qty;
    const tax = Math.round(sub * 0.05);
    const total = sub + tax;

    $("orderUnit").textContent = INR(order.unit);
    $("orderQty").textContent = qty;
    $("orderSub").textContent = INR(sub);
    $("orderTax").textContent = INR(tax);
    $("orderTotal").textContent = INR(total);
    $("payBtnLabel").textContent = "Pay " + INR(total) + " Securely";
    return total;
  }

  // ---- Populate summary ----
  $("orderName").textContent = order.name;
  $("orderMeta").textContent = order.meta;
  $("orderImg").src = order.img;
  $("orderImg").alt = order.name;
  document.title = "Checkout — " + order.name;
  recalc();
  qtyEl.addEventListener("change", recalc);

  // ---- Payment method switcher ----
  const methods = document.querySelectorAll(".pay-method");
  const fieldSets = document.querySelectorAll(".pay-fields");
  document.getElementById("payMethods").addEventListener("change", (e) => {
    const val = e.target.value;
    methods.forEach((m) => m.classList.toggle("is-active", m.querySelector("input").value === val));
    fieldSets.forEach((f) => f.classList.toggle("is-hidden", f.dataset.method !== val));
  });

  // ---- Input formatting (card number spacing, expiry) ----
  const form = document.getElementById("checkoutForm");
  form.addEventListener("input", (e) => {
    const el = e.target;
    if (el.name === "phone") {
      el.value = el.value.replace(/\D/g, "").slice(0, 10);
    } else if (el.name === "card") {
      el.value = el.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    } else if (el.name === "exp") {
      let v = el.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      el.value = v;
    } else if (el.name === "cvv") {
      el.value = el.value.replace(/\D/g, "").slice(0, 3);
    }
  });

  // ---- Validate active method ----
  function activeMethod() {
    return document.querySelector('input[name="method"]:checked').value;
  }

  function validate() {
    let ok = true;
    const errs = [];
    const req = (name, label, test) => {
      const el = form.elements[name];
      if (!el) return;
      const bad = test ? !test(el.value.trim()) : !el.value.trim();
      el.classList.toggle("is-invalid", bad);
      if (bad) { ok = false; errs.push(label); }
    };
    req("name", "Full Name");
    req("email", "Email", (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
    req("phone", "Phone", (v) => /^\d{10}$/.test(v));

    const m = activeMethod();
    if (m === "upi") req("upi", "UPI ID", (v) => /@/.test(v));
    if (m === "card") {
      req("card", "Card Number", (v) => v.replace(/\s/g, "").length === 16);
      req("exp", "Expiry", (v) => /^\d{2}\/\d{2}$/.test(v));
      req("cvv", "CVV", (v) => v.length === 3);
    }
    if (m === "netbanking") req("bank", "Bank");
    return ok;
  }

  // ---- Fake pay ----
  const btn = document.getElementById("payBtn");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      if (window.showToast) showToast("Please fix the highlighted fields.", "error");
      return;
    }
    const total = recalc();
    // simulate processing
    const label = document.getElementById("payBtnLabel");
    const prev = label.textContent;
    btn.disabled = true;
    label.textContent = "Processing…";
    btn.classList.add("is-loading");

    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("is-loading");
      label.textContent = prev;
      // ref from time + qty (no Math.random needed)
      const ref = "IKH-" + String(Date.now()).slice(-6);
      document.getElementById("payRef").textContent = ref;
      document.getElementById("payModalMsg").textContent =
        "Payment of " + INR(total) + " received. A confirmation has been sent to your email.";
      const modal = document.getElementById("payModal");
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }, 1400);
  });
})();
