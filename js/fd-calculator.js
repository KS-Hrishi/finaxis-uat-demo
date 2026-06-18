/* FinAxis — FD Calculator (dependency-free, quarterly compounding) */
(function () {
  "use strict";
  var el = function (id) { return document.getElementById(id); };
  var amount = el("fd-amount"), amountR = el("fd-amount-range"),
    rate = el("fd-rate"), rateR = el("fd-rate-range"),
    years = el("fd-years"), yearsR = el("fd-years-range");
  if (!amount || !rate || !years) return;

  function inr(n) { if (!isFinite(n)) n = 0; return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function link(f, r) {
    f.addEventListener("input", function () { r.value = clamp(parseFloat(f.value) || 0, +r.min, +r.max); calc(); });
    r.addEventListener("input", function () { f.value = r.value; calc(); });
  }
  function donut(a, b) {
    var c = el("fd-chart"); if (!c) return;
    var size = 210, dpr = window.devicePixelRatio || 1;
    c.width = size * dpr; c.height = size * dpr; c.style.width = size + "px"; c.style.height = size + "px";
    var ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);
    var t = a + b, cx = size / 2, cy = size / 2, rad = 82, lw = 30, st = -Math.PI / 2;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = lw; ctx.stroke();
    [[a, "#7fb2c4"], [b, "#0a9646"]].forEach(function (s) {
      var ang = t ? (s[0] / t) * Math.PI * 2 : 0; if (ang <= 0) return;
      ctx.beginPath(); ctx.arc(cx, cy, rad, st, st + ang); ctx.strokeStyle = s[1]; ctx.lineWidth = lw; ctx.stroke(); st += ang;
    });
  }
  function calc() {
    var P = parseFloat(amount.value) || 0;
    var r = (parseFloat(rate.value) || 0) / 100;
    var t = parseFloat(years.value) || 0;
    var nc = 4; // quarterly compounding
    var A = P * Math.pow(1 + r / nc, nc * t);
    var interest = A - P;
    el("fd-maturity").textContent = inr(A);
    el("fd-principal").textContent = inr(P);
    el("fd-interest").textContent = inr(interest);
    var pct = A ? Math.round((interest / A) * 100) : 0;
    if (el("fd-chart-pct")) el("fd-chart-pct").textContent = pct + "%";
    donut(P, interest);
  }
  link(amount, amountR); link(rate, rateR); link(years, yearsR);
  calc();
})();
