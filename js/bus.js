/* ============================================
   Bus tickets — route search + seat-map picker.
   Renders routes from bus-data.js, builds a 2+2
   seat grid, tracks selection, price, and
   Book → checkout.
   ============================================ */

(function () {
  if (typeof BUS_ROUTES === "undefined") return;
  const INR = (n) => "₹" + n.toLocaleString("en-IN");
  const $ = (id) => document.getElementById(id);
  const toast = (m, t) => (window.showToast ? showToast(m, t) : alert(m));
  const todayStr = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  const routeSel = $("busRoute");
  routeSel.innerHTML = BUS_ROUTES.map((r) =>
    `<option value="${r.id}">${r.from} → ${r.to} (${r.depart}, ${r.type})</option>`).join("");

  let route = BUS_ROUTES[0];
  const selectedSeats = new Set();

  const letters = "ABCDEFGHIJK".split("");

  function bookedFor(id) {
    return new Set((BUS_SEAT_CONFIG.booked[id] || []));
  }

  function buildSeatMap() {
    const booked = bookedFor(route.id);
    const map = $("seatMap");
    let html = "";
    for (let r = 0; r < BUS_SEAT_CONFIG.rows; r++) {
      const row = letters[r];
      html += '<div class="seat-row">';
      // left block (2)
      for (let c = 1; c <= BUS_SEAT_CONFIG.leftCols; c++) html += seatBtn(row + c, booked);
      html += '<span class="seat-aisle"></span>';
      // right block (2)
      for (let c = BUS_SEAT_CONFIG.leftCols + 1; c <= BUS_SEAT_CONFIG.leftCols + BUS_SEAT_CONFIG.rightCols; c++) html += seatBtn(row + c, booked);
      html += "</div>";
    }
    map.innerHTML = html;
  }

  function seatBtn(id, booked) {
    const isBooked = booked.has(id);
    const isSel = selectedSeats.has(id);
    const cls = isBooked ? "is-booked" : isSel ? "is-selected" : "";
    return `<button type="button" class="seat ${cls}" data-seat="${id}" ${isBooked ? "disabled" : ""}>${id}</button>`;
  }

  function maxPax() { return parseInt($("busPax").value, 10) || 1; }

  function updateSummary() {
    const seats = [...selectedSeats];
    $("sumRoute").textContent = `${route.from} → ${route.to}`;
    $("sumDate").textContent = $("busDate").value || "—";
    $("sumSeats").textContent = seats.length ? seats.sort().join(", ") : "None";
    $("sumFare").textContent = INR(route.fare);
    const total = route.fare * seats.length;
    $("sumTotal").textContent = INR(total);
    const btn = $("busBookBtn");
    btn.disabled = seats.length === 0;
    btn.textContent = seats.length ? `Book ${seats.length} Seat${seats.length > 1 ? "s" : ""} · ${INR(total)}` : "Select Seats to Continue";
    return total;
  }

  function showResult() {
    route = BUS_ROUTES.find((r) => r.id === routeSel.value) || BUS_ROUTES[0];
    selectedSeats.clear();
    $("brRoute").textContent = `${route.from} → ${route.to}`;
    $("brMeta").textContent = `${route.depart} – ${route.arrive} · ${route.duration} · ${route.type}`;
    $("brFare").textContent = INR(route.fare);
    buildSeatMap();
    updateSummary();
    $("busResult").hidden = false;
    $("busResult").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // no past travel date
  $("busDate").min = todayStr();

  $("busSearchBtn").addEventListener("click", () => {
    const dateEl = $("busDate");
    dateEl.classList.remove("is-invalid");
    if (!dateEl.value) {
      dateEl.classList.add("is-invalid");
      dateEl.focus();
      toast("Please pick a travel date to search buses.", "error");
      return;
    }
    if (dateEl.value < todayStr()) {
      dateEl.classList.add("is-invalid");
      toast("Travel date cannot be in the past.", "error");
      return;
    }
    showResult();
  });

  // seat click (delegated)
  $("seatMap").addEventListener("click", (e) => {
    const btn = e.target.closest(".seat");
    if (!btn || btn.disabled) return;
    const id = btn.dataset.seat;
    if (selectedSeats.has(id)) {
      selectedSeats.delete(id);
      btn.classList.remove("is-selected");
    } else {
      if (selectedSeats.size >= maxPax()) {
        if (window.showToast) showToast(`You selected ${maxPax()} passenger(s). Increase passengers to pick more seats.`, "error");
        return;
      }
      selectedSeats.add(id);
      btn.classList.add("is-selected");
    }
    updateSummary();
  });

  // if pax reduced below selected count, trim extra seats
  $("busPax").addEventListener("change", () => {
    const max = maxPax();
    while (selectedSeats.size > max) {
      const last = [...selectedSeats].pop();
      selectedSeats.delete(last);
      const b = document.querySelector(`.seat[data-seat="${last}"]`);
      if (b) b.classList.remove("is-selected");
    }
    updateSummary();
  });

  // Book -> checkout
  $("busBookBtn").addEventListener("click", () => {
    const seats = [...selectedSeats].sort();
    if (!seats.length) { toast("Please select at least one seat.", "error"); return; }
    const date = $("busDate").value;
    if (!date) { toast("Please pick a travel date.", "error"); return; }
    const total = route.fare * seats.length;
    const q = new URLSearchParams({
      type: "bus",
      pkg: `Bus: ${route.from} → ${route.to}`,
      price: total,
      meta: `Seats ${seats.join(", ")}${date ? " · " + date : ""} · ${route.type}`,
      img: route.img,
      qty: "1",
    });
    location.href = "checkout.html?" + q.toString();
  });
})();
