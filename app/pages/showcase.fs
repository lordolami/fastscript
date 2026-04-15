const PROJECTS = [{
  title: "FastScript Commerce Starter",
  copy: "Checkout flow with queue-based receipts, upload API, and multi-tenant readiness.",
  meta: "starter",
  detail: "8 routes - 4 APIs - queue worker",
  kind: "starter"
}, {
  title: "Realtime Ops Dashboard",
  copy: "Authenticated data workspace using route loaders and cache-scoped tenant data.",
  meta: "full-app",
  detail: "12 routes - auth middleware",
  kind: "full-app"
}, {
  title: "Webhook Reliability Console",
  copy: "Signature verification, dead-letter replay, and alert hooks for high-trust integrations.",
  meta: "infra",
  detail: "security + observability",
  kind: "infra"
}, {
  title: "FastScript Language Website",
  copy: "The site you are viewing: docs, benchmarks, blog, dev profiles, and deploy adapters.",
  meta: "meta",
  detail: "meta project",
  kind: "meta"
}, {
  title: "Migration Bridge App",
  copy: "Incremental migration from JS modules with interop guarantees and proof-pack outputs.",
  meta: "migration",
  detail: "interop-first",
  kind: "migration"
}, {
  title: "Your startup next",
  copy: "Ship your own product with this stack and get listed in the public showcase.",
  meta: "open",
  detail: "open submissions",
  kind: "placeholder"
}];
function cardNormal(p) {
  return `
    <div class="product-card" data-project data-kind="${p.kind}" data-title="${p.title.toLowerCase()}">
      <div class="product-card-preview"></div>
      <p class="product-card-meta">${p.meta}</p>
      <p class="product-card-title">${p.title}</p>
      <p class="product-card-copy">${p.copy}</p>
      <div class="tag-row"><span class="tag">${p.detail}</span></div>
    </div>
  `;
}
function cardPlaceholder(p) {
  return `
    <div class="product-card product-placeholder" data-project data-kind="${p.kind}" data-title="${p.title.toLowerCase()}">
      <div class="product-card-preview"></div>
      <p class="product-card-meta">${p.meta}</p>
      <p class="product-card-title">${p.title}</p>
      <p class="product-card-copy">${p.copy}</p>
      <div class="tag-row"><span class="tag">${p.detail}</span></div>
    </div>
  `;
}
function card(p) {
  if (p.kind === "placeholder") return cardPlaceholder(p);
  return cardNormal(p);
}
export default function Showcase() {
  return `
    <section class="showcase-page">
      <header class="sec-header">
        <p class="kicker">Showcase</p>
        <h1 class="h1">Production projects built with FastScript.</h1>
        <p class="lead">Deploy-ready patterns and real apps built on the v3 product contract: universal JS/TS in <code class="ic">.fs</code>, proof-backed speed, and one runtime-native pipeline.</p>
      </header>

      <div class="filter-row">
        <input class="input filter-input" data-showcase-search placeholder="Search projects..." />
        <button type="button" class="btn btn-primary btn-sm" data-filter="all">All</button>
        <button type="button" class="btn btn-ghost btn-sm" data-filter="starter">Starter</button>
        <button type="button" class="btn btn-ghost btn-sm" data-filter="full-app">Full app</button>
        <button type="button" class="btn btn-ghost btn-sm" data-filter="infra">Infra</button>
        <button type="button" class="btn btn-ghost btn-sm" data-filter="migration">Migration</button>
      </div>

      <div class="card-grid-3" data-showcase-grid>
        ${PROJECTS.map(card).join("")}
      </div>
    </section>

    <hr class="section-divider">

    <div class="cta-block">
      <h2 class="cta-title">Submit your project.</h2>
      <p class="cta-copy">Built something with FastScript? Open a PR to the showcase index and get listed here.</p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">Open GitHub</a>
      </div>
    </div>
  `;
}
export function hydrate({root}) {
  const search = root.querySelector("[data-showcase-search]");
  const grid = root.querySelector("[data-showcase-grid]");
  const buttons = [...root.querySelectorAll("[data-filter]")];
  if (!search || !grid) return;
  let filter = "all";
  function apply() {
    const q = String(search.value || "").toLowerCase().trim();
    for (const c of grid.querySelectorAll("[data-project]")) {
      const kind = c.dataset.kind || "";
      const title = c.dataset.title || "";
      c.hidden = !((filter === "all" || kind === filter) && (!q || title.includes(q)));
    }
  }
  search.addEventListener("input", apply);
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter || "all";
      buttons.forEach(b => {
        b.className = b === btn ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm";
      });
      apply();
    });
  });
  apply();
}
