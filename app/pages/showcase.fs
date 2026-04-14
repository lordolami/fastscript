const PROJECTS = [{
  title: "FastScript Commerce Starter",
  copy: "Checkout flow with queue-based receipts, upload API, and multi-tenant readiness.",
  meta: "8 routes · 4 APIs · queue worker",
  kind: "starter"
}, {
  title: "Realtime Ops Dashboard",
  copy: "Authenticated data workspace using route loaders and cache-scoped tenant data.",
  meta: "12 routes · auth middleware",
  kind: "full-app"
}, {
  title: "Webhook Reliability Console",
  copy: "Signature verification, dead-letter replay, and alert hooks for high-trust integrations.",
  meta: "security + observability",
  kind: "infra"
}, {
  title: "FastScript Language Website",
  copy: "The site you are viewing: docs, benchmarks, blog, dev profiles, and deploy adapters.",
  meta: "meta project",
  kind: "meta"
}, {
  title: "Migration Bridge App",
  copy: "Incremental migration from JS modules with interop guarantees and proof-pack outputs.",
  meta: "interop-first",
  kind: "migration"
}, {
  title: "Your startup next",
  copy: "Ship your own product with this stack and get listed in the public showcase.",
  meta: "open submissions",
  kind: "placeholder"
}];
function card(project) {
  if (project.kind === "placeholder") {
    return `
      <article class="project-card project-placeholder" data-project data-kind="${project.kind}" data-title="${project.title.toLowerCase()}">
        <div class="project-preview"></div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-copy">${project.copy}</p>
        <span class="project-meta">${project.meta}</span>
      </article>
    `;
  }
  return `
    <article class="project-card" data-project data-kind="${project.kind}" data-title="${project.title.toLowerCase()}">
      <div class="project-preview"></div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-copy">${project.copy}</p>
      <span class="project-meta">${project.meta}</span>
    </article>
  `;
}
export default function Showcase() {
  return `
    <section class="section showcase-hero">
      <header class="section-head">
        <p class="section-kicker">Showcase</p>
        <h1 class="section-title">Production projects built with FastScript.</h1>
        <p class="section-copy">This list highlights deploy-ready patterns. Filter by category and use it as a launchpad for your own product architecture.</p>
      </header>

      <div class="showcase-actions">
        <input class="docs-search-input" data-showcase-search placeholder="Search projects..." />
        <button class="btn btn-primary" data-filter="all">All</button>
        <button class="btn btn-ghost" data-filter="starter">Starter</button>
        <button class="btn btn-ghost" data-filter="full-app">Full app</button>
        <button class="btn btn-ghost" data-filter="infra">Infra</button>
      </div>

      <div class="showcase-grid" data-showcase-grid>
        ${PROJECTS.map(card).join("")}
      </div>
    </section>
  `;
}
export function hydrate({root}) {
  const search = root.querySelector("[data-showcase-search]");
  const grid = root.querySelector("[data-showcase-grid]");
  const buttons = [...root.querySelectorAll("[data-filter]")];
  if (!search || !grid || !buttons.length) return;
  let filter = "all";
  function apply() {
    const q = String(search.value || "").toLowerCase().trim();
    for (const card of grid.querySelectorAll("[data-project]")) {
      const kind = card.getAttribute("data-kind") || "";
      const title = card.getAttribute("data-title") || "";
      const filterMatch = filter === "all" || kind === filter;
      const textMatch = !q || title.includes(q);
      card.hidden = !(filterMatch && textMatch);
    }
  }
  search.addEventListener("input", apply);
  for (const button of buttons) {
    button.addEventListener("click", () => {
      filter = button.getAttribute("data-filter") || "all";
      for (const b of buttons) {
        b.classList.toggle("btn-primary", b === button);
        b.classList.toggle("btn-ghost", b !== button);
      }
      apply();
    });
  }
  apply();
}
