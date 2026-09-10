const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const progressBar = document.querySelector(".scroll-progress span");
const typedText = document.querySelector(".typed-text");
const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = window.localStorage.getItem("saranga-theme");
if (savedTheme === "light") {
  document.documentElement.dataset.theme = "light";
}

function updateThemeButton() {
  const isLight = document.documentElement.dataset.theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme",
  );
}

if (themeToggle) {
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    document.documentElement.dataset.theme = isLight ? "dark" : "light";
    window.localStorage.setItem("saranga-theme", isLight ? "dark" : "light");
    updateThemeButton();
    if (menuToggle && siteMenu) {
      menuToggle.setAttribute("aria-expanded", "false");
      siteMenu.classList.remove("is-open");
    }
  });
}

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteMenu.classList.toggle("is-open", !isOpen);
  });

  siteMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteMenu.classList.remove("is-open");
    }),
  );
}

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const learningFields = [
  "Programming",
  "Artificial Intelligence",
  "Software Development",
  "Game Development",
  "Cybersecurity",
  "Linux",
  "Open Source",
];
let fieldIndex = 0;
let characterIndex = learningFields[0].length;
let deleting = true;

function typeLearningField() {
  const field = learningFields[fieldIndex];
  typedText.textContent = deleting
    ? field.slice(0, characterIndex--)
    : field.slice(0, characterIndex++);
  if (characterIndex === 0) {
    deleting = false;
    fieldIndex = (fieldIndex + 1) % learningFields.length;
  }
  if (characterIndex === field.length + 1) {
    deleting = true;
    characterIndex = field.length;
  }
  window.setTimeout(typeLearningField, deleting ? 65 : 100);
}

window.setTimeout(typeLearningField, 1500);

const revealElements = [...document.querySelectorAll(".reveal")];

function revealOnScroll() {
  revealElements.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
      element.classList.add("is-visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("resize", revealOnScroll);
revealOnScroll();

document
  .querySelectorAll("a, button, .learning-card, .interests-list article")
  .forEach((element) => {
    element.classList.add("ripple-target");
    element.addEventListener("pointerdown", (event) => {
      const bounds = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - bounds.left}px`;
      ripple.style.top = `${event.clientY - bounds.top}px`;
      element.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), {
        once: true,
      });
    });
  });
