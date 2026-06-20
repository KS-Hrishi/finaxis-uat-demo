/* FinAxis — Careers application form (FormSubmit.co + CV upload)
   File uploads require a native form POST (not AJAX), so we let the form submit
   normally to FormSubmit, which emails the application + CV and redirects back
   to /careers#applied. We only (a) enforce a 5 MB limit and (b) show a success
   banner after the redirect. */
(function () {
  "use strict";
  var form = document.getElementById("careers-form");
  var result = document.getElementById("careers-result");
  var MAX = 5 * 1024 * 1024; // 5 MB

  function msg(text, color) { if (result) { result.textContent = text; result.style.color = color; } }

  // Success banner after FormSubmit redirects back with #applied
  if (result && window.location.hash === "#applied") {
    msg("Thank you! Your application and CV have been received. We'll be in touch when a suitable role opens.", "#0a9646");
    var sec = document.getElementById("careers-apply");
    if (sec) sec.scrollIntoView();
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    var fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0] && fileInput.files[0].size > MAX) {
      e.preventDefault();
      msg("Your CV is larger than 5 MB. Please upload a smaller file, or WhatsApp it to us.", "#c0392b");
      return;
    }
    // Otherwise let the form submit natively (FormSubmit handles the attachment + redirect)
    msg("Submitting your application…", "#6b7785");
  });
})();
