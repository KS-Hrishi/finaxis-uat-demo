/* ============================================================
   FinAxis — EMI Calculator (dependency-free)
   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
   ============================================================ */
(function () {
  "use strict";

  var el = function (id) { return document.getElementById(id); };
  var amount = el("emi-amount"),
    amountRange = el("emi-amount-range"),
    rate = el("emi-rate"),
    rateRange = el("emi-rate-range"),
    years = el("emi-years"),
    yearsRange = el("emi-years-range");

  if (!amount || !rate || !years) return; // not on this page

  // Indian-format a number as ₹ (no decimals)
  function inr(n) {
    if (!isFinite(n)) n = 0;
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // Keep a number field and its range slider in sync.
  // The typed value drives the calculation in full (so large loans above the
  // slider's max still compute); the slider just tracks within its own range.
  function link(field, range) {
    field.addEventListener("input", function () {
      var v = parseFloat(field.value) || 0;
      range.value = clamp(v, +range.min, +range.max);
      calc();
    });
    range.addEventListener("input", function () {
      field.value = range.value;
      calc();
    });
  }

  // Custom donut chart (principal vs interest)
  function drawDonut(principal, interest) {
    var canvas = el("emi-chart");
    if (!canvas) return;
    var size = 210, dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    var total = principal + interest;
    var cx = size / 2, cy = size / 2, r = 82, lw = 30;
    var segs = [[principal, "#7fb2c4"], [interest, "#0a9646"]];
    var start = -Math.PI / 2;
    // track
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = lw; ctx.stroke();
    segs.forEach(function (s) {
      var ang = total ? (s[0] / total) * Math.PI * 2 : 0;
      if (ang <= 0) return;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + ang);
      ctx.strokeStyle = s[1];
      ctx.lineWidth = lw;
      ctx.lineCap = "butt";
      ctx.stroke();
      start += ang;
    });
  }

  // Yearly amortization schedule
  function amortize(P, monthlyRate, n, emi) {
    var rows = [], balance = P, yearInt = 0, yearPrin = 0, yp = 0;
    for (var m = 1; m <= n; m++) {
      var interest = balance * monthlyRate;
      var principal = emi - interest;
      balance -= principal;
      yearInt += interest;
      yearPrin += principal;
      yp++;
      if (yp === 12 || m === n) {
        rows.push({
          year: Math.ceil(m / 12),
          principal: yearPrin,
          interest: yearInt,
          balance: balance > 0 ? balance : 0
        });
        yearInt = 0; yearPrin = 0; yp = 0;
      }
    }
    return rows;
  }

  function renderAmort(rows) {
    var box = el("emi-amort-table");
    if (!box) return;
    var h = '<table><thead><tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Balance</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      h += "<tr><td>Year " + r.year + "</td><td>" + inr(r.principal) +
        "</td><td>" + inr(r.interest) + "</td><td>" + inr(r.balance) + "</td></tr>";
    });
    h += "</tbody></table>";
    box.innerHTML = h;
  }

  function calc() {
    var P = parseFloat(amount.value) || 0;
    var annual = parseFloat(rate.value) || 0;
    var yrs = parseFloat(years.value) || 0;
    var n = Math.round(yrs * 12);
    var r = annual / 12 / 100;

    var emi;
    if (r === 0) emi = n ? P / n : 0;
    else emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    var totalPay = emi * n;
    var totalInterest = totalPay - P;

    el("emi-monthly").textContent = inr(emi);
    el("emi-principal").textContent = inr(P);
    el("emi-interest").textContent = inr(totalInterest);
    el("emi-total").textContent = inr(totalPay);

    var pctInt = totalPay ? Math.round((totalInterest / totalPay) * 100) : 0;
    var center = el("emi-chart-pct");
    if (center) center.textContent = pctInt + "%";

    drawDonut(P, totalInterest);

    if (el("emi-amort-table") && !el("emi-amort-table").hidden) {
      renderAmort(amortize(P, r, n, emi));
    }
  }

  link(amount, amountRange);
  link(rate, rateRange);
  link(years, yearsRange);

  var toggle = el("emi-amort-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var box = el("emi-amort-table");
      var open = box.hidden;
      box.hidden = !open;
      toggle.innerHTML = open
        ? "Hide amortization schedule &#9650;"
        : "View yearly amortization schedule &#9660;";
      if (open) {
        var P = parseFloat(amount.value) || 0;
        var r = (parseFloat(rate.value) || 0) / 12 / 100;
        var n = Math.round((parseFloat(years.value) || 0) * 12);
        var emi = r === 0 ? (n ? P / n : 0) : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        renderAmort(amortize(P, r, n, emi));
      }
    });
  }

  calc(); // initial
})();
