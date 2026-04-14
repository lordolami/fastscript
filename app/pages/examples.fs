const EXAMPLES = [{
  title: "Startup MVP",
  copy: "Commerce starter with SSR pages, checkout API, queue jobs for receipts, and dashboard routes.",
  tags: ["Full-stack", "Payments", "Queue"]
}, {
  title: "Internal ops dashboard",
  copy: "Typed route loaders + filtered tables + auth gate middleware for internal tooling at scale.",
  tags: ["Admin", "Auth", "Data"]
}, {
  title: "Webhook control plane",
  copy: "Signature validation, replay protection, audit logs, and dead-letter retries in one app repository.",
  tags: ["Security", "Webhooks", "Reliability"]
}, {
  title: "Content + blog engine",
  copy: "Dynamic routes with slug params, docs search index API, and static-friendly SEO output.",
  tags: ["Routing", "SEO", "Docs"]
}, {
  title: "Multi-tenant API backend",
  copy: "Tenant-scoped DB/cache helpers with session policies and request-level observability hooks.",
  tags: ["Tenant", "DB", "Metrics"]
}, {
  title: "Interop migration project",
  copy: "Migrate incrementally from JavaScript and mixed npm modules while preserving deployment parity.",
  tags: ["Migration", "Interop", "No lock-in"]
}];
export default function ExamplesPage() {
  const cards = EXAMPLES.map(example => `
    <article class="example-card">
      <h3 class="example-title">${example.title}</h3>
      <p class="example-copy">${example.copy}</p>
      <div class="tag-row">${example.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    </article>
  `).join("");
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Example blueprints</p>
        <h1 class="section-title">Battle-tested app patterns built in .fs.</h1>
        <p class="section-copy">Use these blueprints as starting architecture, not toy samples. Each pattern maps directly to production concerns: auth, data integrity, observability, and shipping speed.</p>
      </header>

      <div class="example-grid">${cards}</div>

      <div class="hero-actions">
        <a class="btn btn-primary" href="/docs">Open architecture docs</a>
        <a class="btn btn-ghost" href="https://github.com/lordolami/fastscript/tree/master/examples" target="_blank" rel="noreferrer">Browse repo examples</a>
      </div>
    </section>
  `;
}
