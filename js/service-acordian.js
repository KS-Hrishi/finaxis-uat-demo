const headers = document.querySelectorAll(".fx-header");

headers.forEach((header) => {
  header.addEventListener("click", () => {
    const openItem = header.nextElementSibling;
    const isOpen = header.classList.contains("active");

    // Close all
    document.querySelectorAll(".fx-content").forEach((content) => {
      content.style.maxHeight = null;
      content.classList.remove("open");
    });
    document.querySelectorAll(".fx-header").forEach((h) => {
      h.classList.remove("active");
    });

    // Open clicked one
    if (!isOpen) {
      header.classList.add("active");
      openItem.classList.add("open");
      // openItem.style.maxHeight = openItem.scrollHeight + "px";
    }
  });
});
