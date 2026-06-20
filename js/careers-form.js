/* FinAxis — Careers application form (Web3Forms + CV upload) */
(function () {
  "use strict";
  var form = document.getElementById("careers-form");
  if (!form) return;
  var result = document.getElementById("careers-result");
  var MAX = 5 * 1024 * 1024; // 5 MB

  function msg(text, color) { if (result) { result.textContent = text; result.style.color = color; } }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0] && fileInput.files[0].size > MAX) {
      msg("Your CV is larger than 5 MB. Please upload a smaller file, or WhatsApp it to us.", "#c0392b");
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    msg("Submitting your application…", "#6b7785");

    fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          msg("Thank you! Your application and CV have been received. We'll be in touch when a suitable role opens.", "#0a9646");
          form.reset();
        } else {
          msg((json.message || "Something went wrong") + " — please try again or WhatsApp us your CV.", "#c0392b");
        }
      })
      .catch(function () {
        msg("Network error. Please try again, or WhatsApp us your CV.", "#c0392b");
      })
      .finally(function () { if (btn) btn.disabled = false; });
  });
})();
