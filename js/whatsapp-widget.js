/* ============================================================
   FinAxis — Floating WhatsApp widget (self-contained)
   Injects its own styles + button. Bottom-left to avoid the
   back-to-top button and any future Chatbase bubble (bottom-right).
   ============================================================ */
(function () {
  "use strict";
  if (document.getElementById("fx-wa")) return;

  var PHONE = "919326522790"; // FinAxis primary WhatsApp number
  var TEXT = encodeURIComponent("Hello FinAxis, I have a question about your financial services. Please assist.");
  var HREF = "https://api.whatsapp.com/send?phone=" + PHONE + "&text=" + TEXT + "&type=phone_number&app_absent=0";

  var css = [
    "#fx-wa{position:fixed;left:22px;bottom:22px;z-index:99990;display:flex;align-items:center;gap:10px;text-decoration:none;font-family:'Manrope',sans-serif;}",
    "#fx-wa .fx-wa-btn{width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.22);flex:0 0 auto;transition:transform .18s ease;animation:fxWaPulse 2.4s infinite;}",
    "#fx-wa:hover .fx-wa-btn{transform:scale(1.06);}",
    "#fx-wa .fx-wa-btn svg{width:32px;height:32px;fill:#fff;}",
    "#fx-wa .fx-wa-label{background:#fff;color:#264653;font-weight:600;font-size:14px;padding:9px 14px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.15);white-space:nowrap;opacity:0;transform:translateX(-8px);transition:opacity .2s ease,transform .2s ease;pointer-events:none;}",
    "#fx-wa:hover .fx-wa-label{opacity:1;transform:translateX(0);}",
    "@keyframes fxWaPulse{0%{box-shadow:0 6px 18px rgba(0,0,0,.22),0 0 0 0 rgba(37,211,102,.55);}70%{box-shadow:0 6px 18px rgba(0,0,0,.22),0 0 0 14px rgba(37,211,102,0);}100%{box-shadow:0 6px 18px rgba(0,0,0,.22),0 0 0 0 rgba(37,211,102,0);}}",
    "@media (max-width:600px){#fx-wa{left:16px;bottom:16px;}#fx-wa .fx-wa-label{display:none;}#fx-wa .fx-wa-btn{width:54px;height:54px;}}",
    "@media (prefers-reduced-motion:reduce){#fx-wa .fx-wa-btn{animation:none;}}"
  ].join("");

  var style = document.createElement("style");
  style.id = "fx-wa-style";
  style.textContent = css;
  document.head.appendChild(style);

  var svg = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.18 1.6 6L4 29l8.16-1.55a12 12 0 0 0 3.88.64h.01C22.7 28.09 28.1 22.69 28.1 16.05 28.1 8.4 22.7 3 16.04 3zm0 21.86h-.01c-1.18 0-2.34-.32-3.35-.92l-.24-.14-4.84.92.97-4.72-.16-.25a9.86 9.86 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.89 9.9zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/></svg>';

  var a = document.createElement("a");
  a.id = "fx-wa";
  a.href = HREF;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with FinAxis on WhatsApp");
  a.innerHTML = '<span class="fx-wa-btn">' + svg + '</span><span class="fx-wa-label">Chat with us</span>';
  document.body.appendChild(a);
})();
