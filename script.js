const DATA_URL = "data/site-data.json";
const $ = (selector) => document.querySelector(selector);

function md(text = "") {
  return esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function linkClass(label = "") {
  const l = label.toLowerCase();
  if (l.includes("abstract")) return "btn-outline";
  if (l.includes("email") || l.includes("resume") || l.includes("paper") || l.includes("pdf") || l.includes("doi") || l.includes("journal") || l.includes("published") || l.includes("preprint")) return "btn-fill";
  return "btn-light";
}

function linkHtml(link) {
  const external = /^https?:\/\//.test(link.url);
  const cls = linkClass(link.label);
  return `<a class="${cls}" href="${esc(link.url)}"${external ? ' target="_blank" rel="noopener"' : ""}>${esc(link.label)}</a>`;
}

function detailsHtml(text, label = "Abstract") {
  if (!text) return "";
  return `<details class="abstract"><summary class="btn-outline">${label}</summary><p>${esc(text)}</p></details>`;
}

function tagsHtml(tags = []) {
  if (!tags.length) return "";
  return `<div class="tags">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
}

function publicationEntry(pub) {
  const status = pub.status ? `<div class="entry-status">${esc(pub.status)}</div>` : "";

  const abstractBtn = pub.abstract
    ? `
      <button class="btn-outline abstract-toggle" type="button" aria-expanded="false">
        Abstract
      </button>
      <div class="abstract-panel" hidden>
        <p>${esc(pub.abstract)}</p>
      </div>`
    : "";

  const links = [
    ...(pub.links?.map(linkHtml) ?? []),
    abstractBtn,
  ].filter(Boolean).join("");

  return `
    <article class="entry" id="${esc(pub.id)}">
      <div class="entry-title">${esc(pub.title)}</div>
      <div class="entry-meta">${esc(pub.authors)}</div>
      <div class="entry-meta">${esc(pub.venue)}${pub.year ? ` · ${esc(pub.year)}` : ""}</div>
      ${status}
      <div class="entry-links">${links}</div>
    </article>`;
}

function projectEntry(project) {
  const links = project.links?.length ? `<div class="entry-links">${project.links.map(linkHtml).join("")}</div>` : "";
  const items = project.items?.length ? `<ul class="project-items">${project.items.map(i => `<li>${md(i)}</li>`).join("")}</ul>` : "";
  const gallery = project.gallery?.length ? `<div class="project-gallery">${project.gallery.map(img => `<img src="${esc(img.src)}" alt="${esc(img.alt)}">`).join("")}</div>` : "";
  return `
    <article class="project-entry" id="${esc(project.id)}">
      <h3>${esc(project.title)}</h3>
      ${project.advisor ? `<p class="entry-meta">Advisor: ${esc(project.advisor)}</p>` : ""}
      <p class="tagline">${esc(project.summary)}</p>
      ${project.impact ? `<p class="impact">${esc(project.impact)}</p>` : ""}
      <div class="project-tags">${tagsHtml(project.tags)}</div>
      ${gallery}
      ${items}
      ${links}
      ${detailsHtml(project.details, "Details")}
    </article>`;
}

function previewPublication(pub) {
  return `
    <article class="preview-card">
      <div class="entry-title"><a href="research.html#${esc(pub.id)}">${esc(pub.title)}</a></div>
      <p class="tagline">${esc(pub.venue)}${pub.year ? ` · ${esc(pub.year)}` : ""}${pub.status ? ` — ${esc(pub.status)}` : ""}</p>
      ${pub.abstract ? `<a class="card-link" href="research.html#${esc(pub.id)}">Abstract</a>` : ""}
    </article>`;
}

function previewProject(project) {
  return `
    <article class="preview-card">
      <div class="entry-title"><a href="projects.html#${esc(project.id)}">${esc(project.title)}</a></div>
      <p class="tagline">${esc(project.summary)}</p>
      ${project.impact ? `<p class="impact">${esc(project.impact)}</p>` : ""}
      ${tagsHtml((project.tags || []).slice(0, 3))}
      <a class="card-link" href="projects.html#${esc(project.id)}">Details</a>
    </article>`;
}

function awardEntry(award) {
  const imgHtml = award.image
    ? `<img class="award-img" src="${esc(award.image)}" alt="${esc(award.imageAlt || award.title)}">`
    : "";
  const bodyClass = award.image ? "award-body" : "award-body no-image";
  const paras = (award.description || []).map(p => `<p>${md(p)}</p>`).join("");
  return `
    <div class="award-entry">
      <h3 class="award-title">${esc(award.title)}</h3>
      <div class="${bodyClass}">
        ${imgHtml}
        <div class="award-text">${paras}</div>
      </div>
    </div>`;
}

function timelineItem({ when, title, sub, items = [] }) {
  return `
    <article class="timeline-item">
      <div class="when">${esc(when)}</div>
      <div>
        <h3>${md(title)}</h3>
        ${sub ? `<p class="entry-meta">${esc(sub)}</p>` : ""}
        ${items.length ? `<ul>${items.map(i => `<li>${md(i)}</li>`).join("")}</ul>` : ""}
      </div>
    </article>`;
}

function renderHome(data) {
  if (!$("[data-page='home']")) return;
  const p = data.profile;
  $("#profile-name").textContent = p.name;
  $("#profile-title").textContent = p.title;
  if (p.availability) $("#profile-availability").textContent = p.availability;
  else $("#profile-availability")?.remove();
  if (p.headline) $("#profile-headline").textContent = p.headline;
  $("#profile-hero").innerHTML = p.hero.map(t => `<p>${md(t)}</p>`).join("");
  $("#profile-links").innerHTML = p.links.map(linkHtml).join(" ");

  if (data.stats?.length) {
    $("#stats-list").innerHTML = data.stats.map(s => `
      <div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("");
  }

  $("#experience-list").innerHTML = data.experience.map(exp => timelineItem({
    when: exp.when,
    title: `${exp.role} — ${exp.place}`,
    sub: exp.advisor ? `Advisor: ${exp.advisor}` : "",
    items: exp.items,
  })).join("");

  $("#featured-projects").innerHTML = data.projects.filter(x => x.featured).slice(0, 6).map(previewProject).join("");
  $("#featured-publications").innerHTML = data.publications.filter(x => x.featured).slice(0, 6).map(previewPublication).join("");

  if (data.skills?.length) {
    $("#skills-list").innerHTML = data.skills.map(g => `
      <div class="skill-group"><h3>${esc(g.group)}</h3>${tagsHtml(g.items)}</div>`).join("");
  }

  if (data.awards?.length) $("#awards-list").innerHTML = data.awards.map(awardEntry).join("");
  else $("#awards-section")?.remove();

  if (data.education?.length) {
    $("#education-list").innerHTML = data.education.map(e => timelineItem({
      when: e.when, title: `${e.degree} — ${e.school}`, sub: e.detail, items: e.items,
    })).join("");
  }

  if (data.teaching?.length) {
    $("#teaching-list").innerHTML = data.teaching.map(t => timelineItem({ when: t.when, title: t.title, items: t.items })).join("");
  }

  if (data.contact) {
    $("#contact-text").innerHTML = md(data.contact.text);
    $("#contact-links").innerHTML = data.contact.links.map(linkHtml).join("");
  }
}

function renderResearch(data) {
  if (!$("[data-page='research']")) return;
  const groups = { journal: "#journal-list", conference: "#conference-list", report: "#report-list" };
  Object.entries(groups).forEach(([type, selector]) => {
    const items = data.publications.filter(p => p.type === type);
    $(selector).innerHTML = items.length ? items.map(publicationEntry).join("") : `<p class="muted">Coming soon.</p>`;
  });
}

function renderProjects(data) {
  if (!$("[data-page='projects']")) return;
  $("#project-list").innerHTML = data.projects.map(projectEntry).join("");
}

function setActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

async function init() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  setActiveNav();
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
    const data = await response.json();
    renderHome(data);
    renderResearch(data);
    renderProjects(data);
    document.querySelectorAll(".abstract-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML("beforeend", `<p class="container muted">Could not load site data. Check that data/site-data.json exists and that you are serving the site through GitHub Pages or a local server.</p>`);
  }
}


init();


