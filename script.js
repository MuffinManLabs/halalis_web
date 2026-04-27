// ============================================================
// HALALIS — interactivity
// ============================================================

// --- Promo banner dismiss (persists via localStorage) ---
const promoClose = document.getElementById("promo-close");
const PROMO_KEY = "halalis-promo-dismissed";
try {
  if (localStorage.getItem(PROMO_KEY) === "true") {
    document.body.classList.add("promo-dismissed");
  }
} catch (e) {}
if (promoClose) {
  promoClose.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.add("promo-dismissed");
    try { localStorage.setItem(PROMO_KEY, "true"); } catch (err) {}
  });
}

// --- Live "Open Now" status (hours: 11am – 2am every day) ---
const navStatus = document.getElementById("nav-status");
const statusText = navStatus?.querySelector(".status-text");
const updateStatus = () => {
  if (!navStatus || !statusText) return;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const minutesNow = h * 60 + m;
  // Open: 11:00 (660) → 26:00 (next day 2am, i.e. 0–120 in same day)
  // Easier: open if h >= 11 OR h < 2
  const isOpen = h >= 11 || h < 2;
  // Closing soon: within 30 minutes of 2am close (1:30am – 2:00am)
  const isClosingSoon = h === 1 && m >= 30;

  navStatus.classList.remove("closing", "closed");
  if (!isOpen) {
    navStatus.classList.add("closed");
    const minsUntilOpen = 11 * 60 - minutesNow;
    statusText.textContent = minsUntilOpen < 60 ? `Opens in ${minsUntilOpen}m` : "Opens at 11am";
  } else if (isClosingSoon) {
    navStatus.classList.add("closing");
    const minsUntilClose = 60 - m; // h === 1, so close (2am) is 60-m min away
    statusText.textContent = `Closing in ${minsUntilClose}m`;
  } else {
    statusText.textContent = "Open Now";
  }
};
updateStatus();
setInterval(updateStatus, 60 * 1000);

// --- Count-up stats (animate when hero meta enters view) ---
const countEls = document.querySelectorAll(".count-up");
const animateCount = (el) => {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
  };
  requestAnimationFrame(tick);
};
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
countEls.forEach((el) => countObserver.observe(el));

// --- Floating order button: hide when order section is in view ---
const floatingOrder = document.getElementById("floating-order");
const orderSection = document.getElementById("order");
if (floatingOrder && orderSection) {
  const orderObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        floatingOrder.classList.toggle("hidden", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );
  orderObserver.observe(orderSection);
}

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
