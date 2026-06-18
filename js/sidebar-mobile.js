/* ============================================================
   FinAxis — Mobile slide-in drawer navigation
   - Slide panel + dim backdrop + body scroll-lock
   - Closes on backdrop tap, Esc, or selecting a link
   - Exposes window.showsidebar / window.hidesidebar so existing
     inline onclick handlers keep working on every page
   ============================================================ */
(function () {
  "use strict";

  // Optional: smooth-scroll a #servicesBtn to the #services section (null-safe)
  var servicesBtn = document.getElementById("servicesBtn");
  var servicesTarget = document.getElementById("services");
  if (servicesBtn && servicesTarget) {
    servicesBtn.addEventListener("click", function () {
      servicesTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  var panel = document.querySelector(".sidebar-custom");
  if (!panel) return; // page has no mobile drawer

  // IMPORTANT: the panel lives inside the header, which has its own stacking
  // context. Move it to <body> so it (and the backdrop) stack above the page
  // and the backdrop never covers the panel (which would block link clicks).
  if (panel.parentNode !== document.body) {
    document.body.appendChild(panel);
  }

  // Create the backdrop once, AFTER the panel in the DOM (lower z-index keeps
  // it behind the panel but above the page).
  var backdrop = document.querySelector(".mobile-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "mobile-backdrop";
    document.body.appendChild(backdrop);
  }

  // Accessibility baseline
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Main menu");
  panel.setAttribute("aria-hidden", "true");

  function openSidebar() {
    panel.classList.add("open");
    backdrop.classList.add("open");
    document.body.classList.add("mobile-nav-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closeSidebar() {
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.classList.remove("mobile-nav-open");
    panel.setAttribute("aria-hidden", "true");
  }

  // Close on backdrop tap
  backdrop.addEventListener("click", closeSidebar);

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) closeSidebar();
  });

  // Close button (first row). Prevent empty-href navigation.
  var closeLink = panel.querySelector("li:first-child a");
  if (closeLink) {
    closeLink.addEventListener("click", function (e) {
      e.preventDefault();
      closeSidebar();
    });
  }

  // Selecting any real nav link closes the drawer (navigation still proceeds)
  panel.querySelectorAll("li:not(:first-child) a[href]").forEach(function (a) {
    a.addEventListener("click", closeSidebar);
  });

  // Expose for inline onclick="showsidebar()/hidesidebar()" used across pages
  window.showsidebar = openSidebar;
  window.hidesidebar = closeSidebar;
})();
