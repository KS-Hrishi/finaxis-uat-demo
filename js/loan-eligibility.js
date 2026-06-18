/* FinAxis — Loan Eligibility Calculator (dependency-free)
   Uses FOIR: max EMI = income x FOIR - existing obligations.
   Eligible loan = reverse EMI formula. */
(function () {
  "use strict";
  var el = function (id) { return document.getElementById(id); };
  var income = el("el-income"), incomeR = el("el-income-range"),
    oblig = el("el-obligations"), obligR = el("el-obligations-range"),
    rate = el("el-rate"), rateR = el("el-rate-range"),
    years = el("el-years"), yearsR = el("el-years-range"),
    foir = el("el-foir"), foirR = el("el-foir-range");
  if (!income || !rate || !years) return;

  function inr(n) { if (!isFinite(n)) n = 0; return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function link(f, r) {
    if (!f || !r) return;
    f.addEventListener("input", function () { r.value = clamp(parseFloat(f.value) || 0, +r.min, +r.max); calc(); });
    r.addEventListener("input", function () { f.value = r.value; calc(); });
  }
  function calc() {
    var inc = parseFloat(income.value) || 0;
    var ob = parseFloat(oblig.value) || 0;
    var pctFoir = (foir ? parseFloat(foir.value) : 50) || 50;
    var r = (parseFloat(rate.value) || 0) / 12 / 100;
    var n = Math.round((parseFloat(years.value) || 0) * 12);

    var maxEMI = inc * (pctFoir / 100) - ob;
    if (maxEMI < 0) maxEMI = 0;
    var loan = r === 0 ? maxEMI * n : maxEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));

    el("el-loan").textContent = inr(loan);
    el("el-emi").textContent = inr(maxEMI);
    if (el("el-foir-val")) el("el-foir-val").textContent = Math.round(pctFoir) + "%";
  }
  link(income, incomeR); link(oblig, obligR); link(rate, rateR); link(years, yearsR); link(foir, foirR);
  calc();
})();
