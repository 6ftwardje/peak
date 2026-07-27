/* Peak Automations — main site interactions */

// --- Header border on scroll ---
const header = document.querySelector("[data-header]");
function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// --- Smooth scroll (Lenis), progressive enhancement ---
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  import("https://cdn.jsdelivr.net/npm/lenis@1.1.14/+esm")
    .then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
      lenis.on("scroll", updateHeader);
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Smooth in-page anchor scrolling
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -80 });
            }
          }
        });
      });
    })
    .catch(() => {
      /* offline / blocked: native scroll is fine */
    });
}
