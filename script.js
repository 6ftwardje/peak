const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.addEventListener("toggle", (event) => {
    const activeItem = event.target;

    if (!(activeItem instanceof HTMLDetailsElement) || !activeItem.open) {
      return;
    }

    accordion.querySelectorAll("details").forEach((item) => {
      if (item !== activeItem) {
        item.removeAttribute("open");
      }
    });
  }, true);
});
