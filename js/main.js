const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");

if (nav) {
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll(".faq-item button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("open"));
    if (!open) item.classList.add("open");
  });
});

document.querySelectorAll(".save-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("saved");
    btn.setAttribute("aria-pressed", btn.classList.contains("saved"));
  });
});

const heroPhoto = document.querySelector(".hero-photo");
if (heroPhoto) {
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y < 700) heroPhoto.style.transform = `translateY(${y * 0.08}px)`;
    },
    { passive: true }
  );
}

const searchForm = document.querySelector("#job-search");
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(searchForm);
    const params = new URLSearchParams([...data.entries()].filter(([, v]) => v));
    window.location.href = `jobs.html?${params.toString()}`;
  });
}

const params = new URLSearchParams(location.search);
const role = params.get("role");
if (role) {
  const input = document.querySelector("[name='role']");
  if (input) input.value = role;
}

document.querySelectorAll(".filters .filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters .filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const key = btn.textContent.trim().toLowerCase();
    document.querySelectorAll(".jobs-grid .job-card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = key === "all" || text.includes(key) ? "" : "none";
    });
  });
});

document.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
});
