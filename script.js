// ============================================================
// HALALIS — interactivity
// ============================================================

// --- Sticky nav background on scroll ---
const nav = document.getElementById("nav");
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Mobile burger menu ---
const burger = document.querySelector(".nav-burger");
const navLinks = document.querySelector(".nav-links");
burger?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

// --- Menu category switcher ---
const cats = document.querySelectorAll(".menu-cat");
const details = document.querySelectorAll(".menu-detail");
const switchCat = (target) => {
  cats.forEach((c) => {
    const isActive = c.dataset.cat === target;
    c.classList.toggle("active", isActive);
    c.setAttribute("aria-selected", String(isActive));
  });
  details.forEach((d) => d.classList.toggle("active", d.dataset.detail === target));
};
cats.forEach((cat) => {
  cat.addEventListener("click", () => switchCat(cat.dataset.cat));
  cat.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchCat(cat.dataset.cat);
    }
  });
});

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll(
  ".story-text, .story-images, .menu-header, .menu-cat, .why-card, .reviews blockquote, .visit-text, .visit-map, .sauce, .order-card, .order-header"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => io.observe(el));
