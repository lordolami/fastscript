const EXAMPLES = [{
  title: "Startup MVP",
  copy: "Commerce starter with SSR pages, checkout API, queue jobs for receipts, dashboard routes with auth gate, and primitive-first UI.",
  tags: ["Full-stack", "Payments", "Queue"]
}, {
  title: "Primitive UI starter",
  copy: "Box, Stack, Row, Text, Heading, Button, token-backed semantic props, and generated primitive CSS from the first commit.",
  tags: ["Primitives", "UI", "Starter"]
}, {
  title: "Internal ops dashboard",
  copy: "Typed route loaders, filtered data tables, and auth middleware for internal tooling at scale.",
  tags: ["Admin", "Auth", "Data"]
}, {
  title: "Webhook control plane",
  copy: "Signature validation, replay protection, audit logs, and dead-letter retries in one app repository.",
  tags: ["Security", "Webhooks", "Reliability"]
}, {
  title: "Content + blog engine",
  copy: "Dynamic routes with slug params, docs search index API, and static-friendly SEO output via SSG.",
  tags: ["Routing", "SEO", "Docs"]
}, {
  title: "Multi-tenant API backend",
  copy: "Tenant-scoped DB and cache helpers with session policies and request-level observability hooks.",
  tags: ["Tenant", "DB", "Metrics"]
}, {
  title: "Interop migration project",
  copy: "Migrate incrementally from JavaScript modules while preserving full deployment parity and zero lock-in.",
  tags: ["Migration", "Interop", "No lock-in"]
}];
export default function ExamplesPage() {
  const cards = EXAMPLES.map(ex => `
    <div class="product-card">
      <p class="product-card-meta">${ex.tags[0]}</p>
      <p class="product-card-title">${ex.title}</p>
      <p class="product-card-copy">${ex.copy}</p>
      <div class="tag-row">${ex.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </div>
  `).join("");
  return `
    <section class="examples-page">
      <header class="sec-header">
        <p class="kicker">Example blueprints</p>
        <h1 class="h1">Battle-tested patterns built in .fs.</h1>
        <p class="lead">These blueprints map directly to production concerns - auth, data integrity, observability, and shipping speed. Not toy samples.</p>
      </header>

      <div class="card-grid-3">${cards}</div>

      <div class="action-row">
        <a class="btn btn-secondary btn-lg" href="/docs/primitives">Read primitive guide</a>
        <a class="btn btn-primary btn-lg" href="/docs">Open architecture docs</a>
        <a class="btn btn-ghost btn-lg" href="https://github.com/lordolami/fastscript/tree/master/examples" target="_blank" rel="noreferrer">Browse repo examples</a>
      </div>
    </section>
  `;
}
