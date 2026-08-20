(function () {
  const grid = document.getElementById("jobs-grid");
  if (!grid) return;

  const API = "http://localhost:5000/api/jobs?status=published&limit=50";

  function initials(name) {
    const parts = String(name || "CO").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function salary(job) {
    const currency = job.currency || "USD";
    const fmt = (n) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
    if (job.minSalary && job.maxSalary) return `${fmt(job.minSalary)}–${fmt(job.maxSalary)}`;
    if (job.minSalary || job.maxSalary) return fmt(job.minSalary || job.maxSalary);
    return "Competitive";
  }

  function timeAgo(date) {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days <= 0) return "Today";
    if (days === 1) return "1d ago";
    if (days < 14) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  }

  function employment(type) {
    if (type === "Full Time") return "Full-time";
    if (type === "Part Time") return "Part-time";
    return type || "Full-time";
  }

  function card(job) {
    const company = job.company?.name || "Company";
    const location = job.location || "";
    const type = employment(job.employmentType);
    return `<article class="job-card">
      <div class="job-top">
        <div class="company-chip">
          <div class="company-initial">${initials(company)}</div>
          <div>
            <h3>${job.title}</h3>
            <p class="muted">${company}${location ? " · " + location : ""}</p>
          </div>
        </div>
        <button class="save-btn" aria-label="Save job"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4h10a1 1 0 0 1 1 1v16l-6-3.5L6 21V5a1 1 0 0 1 1-1z"/></svg></button>
      </div>
      <div class="job-meta"><span>${salary(job)}</span><span>${type}</span><span>${timeAgo(job.createdAt)}</span></div>
      <div class="job-footer"><span class="tag">${job.category || "General"}</span><a class="btn btn-primary btn-sm" href="http://localhost:3000/jobs/${job.slug}">Apply</a></div>
    </article>`;
  }

  fetch(API)
    .then((r) => r.json())
    .then((data) => {
      const items = data.items || [];
      if (!items.length) {
        grid.innerHTML = "<p class='muted'>No published jobs yet. Create one from the admin panel.</p>";
        return;
      }
      grid.innerHTML = items.map(card).join("");
      document.querySelectorAll(".save-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          btn.classList.toggle("saved");
          btn.setAttribute("aria-pressed", btn.classList.contains("saved"));
        });
      });
    })
    .catch(() => {
      grid.innerHTML = "<p class='muted'>Could not load jobs from the API. Make sure the backend is running on port 5000.</p>";
    });
})();
