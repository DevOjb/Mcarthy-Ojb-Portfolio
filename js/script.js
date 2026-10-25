const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();


// Portfolio projects are managed through the /admin/ dashboard.
const projectGrid = document.querySelector("#managed-project-grid");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function safeLink(value = "") {
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed, window.location.origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function renderProjectCard(project, index) {
  const title = escapeHTML(project.title || "Untitled project");
  const category = escapeHTML(project.category || "Project");
  const description = escapeHTML(project.description || "");
  const image = typeof project.image === "string" ? project.image.trim() : "";
  const safeImage = image.startsWith("/") || image.startsWith("https://") || image.startsWith("http://")
    ? escapeHTML(image) : "";
  const technologies = Array.isArray(project.technologies)
    ? project.technologies.map((item) => String(item).trim()).filter(Boolean) : [];
  const demo = safeLink(project.demo_url);
  const repo = safeLink(project.repo_url);
  const links = [
    demo ? `<a class="text-link" href="${escapeHTML(demo)}" target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>` : "",
    repo ? `<a class="text-link" href="${escapeHTML(repo)}" target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">↗</span></a>` : ""
  ].filter(Boolean).join("");
  const imageMarkup = safeImage
    ? `<img class="managed-project-image" src="${safeImage}" alt="${title} project screenshot" loading="lazy">`
    : `<div class="managed-project-placeholder"><span>${String(index + 1).padStart(2, "0")}</span><strong>${title}</strong><small>Preview coming soon</small></div>`;
  const techMarkup = technologies.length
    ? `<div class="tag-list">${technologies.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>`
    : "";
  return `<article class="project-card">
    <div class="project-card-preview managed-project-preview">${imageMarkup}</div>
    <div class="project-card-body">
      <div class="project-card-top"><span class="project-type">${category.toUpperCase()}</span></div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${techMarkup}
      ${links ? `<div class="managed-project-links">${links}</div>` : ""}
    </div>
  </article>`;
}

// Category tabs. "Other" collects anything outside the three main disciplines.
const DISCIPLINES = ["Web Design", "Graphic Design", "Mockup Design"];
const SHOW_EMPTY_TABS = false; // set to true to always show every tab, even with no projects
const filterBar = document.querySelector("#project-filters");

function groupOf(category) {
  return DISCIPLINES.includes(category) ? category : "Other";
}

function renderProjects(projects, filter) {
  const visible = filter === "All" ? projects : projects.filter((p) => groupOf(p.category) === filter);
  projectGrid.innerHTML = visible.length
    ? visible.map(renderProjectCard).join("")
    : '<p class="project-loading">No projects in this category yet.</p>';
}

function buildFilters(projects) {
  if (!filterBar) return;
  const tabs = ["All", ...DISCIPLINES, "Other"].filter((name) =>
    name === "All" || SHOW_EMPTY_TABS || projects.some((p) => groupOf(p.category) === name));
  if (tabs.length <= 2 && !SHOW_EMPTY_TABS) { filterBar.hidden = true; return; }
  filterBar.innerHTML = tabs.map((name) => {
    const count = name === "All" ? projects.length : projects.filter((p) => groupOf(p.category) === name).length;
    return `<button type="button" class="filter-btn" data-filter="${name}" aria-pressed="${name === "All"}">${name}<small>${count}</small></button>`;
  }).join("");
  filterBar.hidden = false;
  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    renderProjects(projects, button.dataset.filter);
  });
}

async function readProjectData() {
  try {
    const response = await fetch("data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Project data could not be loaded.");
    return await response.json();
  } catch (error) {
    // Opened straight from a folder (file://), browsers block fetch. Use the embedded copy instead.
    const fallback = document.querySelector("#projects-fallback");
    if (fallback) return JSON.parse(fallback.textContent);
    throw error;
  }
}

async function loadManagedProjects() {
  if (!projectGrid) return;
  try {
    const data = await readProjectData();
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const published = projects.filter((project) => project && project.published !== false && project.title);
    if (!published.length) {
      projectGrid.innerHTML = '<p class="project-loading">New projects are coming soon.</p>';
      return;
    }
    buildFilters(published);
    renderProjects(published, "All");
  } catch (error) {
    projectGrid.innerHTML = '<p class="project-loading">Projects are temporarily unavailable. Please try again shortly.</p>';
  }
}

loadManagedProjects();

// Photos: never show a broken-image icon, and make the frames fit whatever image is used.
const profilePhoto = document.querySelector("#profile-photo");
function fitPortrait() {
  const frame = profilePhoto.closest(".portrait-frame");
  const ratio = profilePhoto.naturalWidth / profilePhoto.naturalHeight;
  frame.style.aspectRatio = String(Math.min(Math.max(ratio, 0.7), 1.1)); // frame follows the photo's shape
  frame.classList.add("has-photo");
}
function whenImageReady(img, onLoad, onFail) {
  if (img.complete) { img.naturalWidth > 0 ? onLoad() : onFail(); return; } // may have finished before this script ran
  img.addEventListener("load", onLoad);
  img.addEventListener("error", onFail);
}
if (profilePhoto) whenImageReady(profilePhoto, fitPortrait, () => profilePhoto.remove());

// Optional images (for example the service cards): the slot only appears once its image loads.
document.querySelectorAll(".slot-img").forEach((img) => {
  const slot = img.closest(".slot");
  const card = img.closest(".service-card");
  whenImageReady(img, () => { slot.classList.add("is-ready"); if (card) card.classList.add("has-media"); }, () => slot.remove());
});
