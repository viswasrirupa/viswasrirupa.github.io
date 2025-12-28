// Set current year in footer (guard in case #year is missing)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Highlight active nav link (handles /, /index.html, and GitHub Pages paths)
(function setActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href");
    // Consider index for both "" and "index.html"
    if ((here === "index.html" && (href === "" || href === "index.html")) || href === here) {
      a.classList.add("active");
    }
  });
})();

// Smooth horizontal wheel scroll for carousels (kept for Publications/Projects)
document.querySelectorAll(".h-scroll").forEach(scroller => {
  scroller.addEventListener("wheel", (evt) => {
    if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
      scroller.scrollLeft += evt.deltaY;
      evt.preventDefault();
    }
  }, { passive: false });
});

// Optional: smooth in-page anchor scrolling (keeps things polished)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href").slice(1);
    const target = id && document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    }
  });
});
