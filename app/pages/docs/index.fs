const GROUPS = [{
  title: "Getting started",
  items: [["Quickstart", "/learn", "Install, run, and ship your first app in minutes."], ["Project structure", "/docs/v1", "Understand pages, APIs, middleware, and data layers."], ["Deploy targets", "/docs/latest", "Generate Node, Vercel, and Cloudflare adapters."]]
}, {
  title: "Core language",
  items: [["Route contracts", "/docs/v1.1", "Typed params and loader data are inferred automatically."], ["Interop model", "/benchmarks", "Mix .fs with npm ESM/CJS and framework APIs."], ["Style rules", "/docs/playground", "Constrained style tokens for predictable generated UIs."]]
}, {
  title: "Tooling",
  items: [["Docs search API", "/docs/search", "Search docs index through the built-in API route."], ["Proof pack", "/benchmarks", "Review benchmark + interop release evidence."], ["Changelog", "/changelog", "Track hardening and platform maturity milestones."]]
}];
export default function DocsIndex() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Documentation</p>
        <h1 class="section-title">Everything needed to build production apps in FastScript.</h1>
        <p class="section-copy">The docs are structured by shipping flow: get started, build with confidence, and deploy with hardened adapters.</p>
      </header>

      <div class="docs-search-shell">
        <input class="docs-search-input" placeholder="Search docs, APIs, and guides..." data-docs-home-search />
        <a class="btn btn-primary" href="/docs/search">Search docs</a>
        <span class="docs-search-shortcut">Ctrl+K</span>
      </div>

      ${GROUPS.map(group => `
        <section class="section">
          <header class="section-head">
            <p class="section-kicker">${group.title}</p>
          </header>
          <div class="docs-grid">
            ${group.items.map(item => `
              <article class="docs-card">
                <h3 class="docs-title">${item[0]}</h3>
                <p class="docs-copy">${item[2]}</p>
                <a class="docs-arrow" href="${item[1]}">Open guide -></a>
              </article>
            `).join("")}
          </div>
        </section>
      `).join("")}
    </section>
  `;
}
export function hydrate({root}) {
  const input = root.querySelector("[data-docs-home-search]");
  if (!input) return;
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const query = encodeURIComponent(String(input.value || "").trim());
    location.href = `/docs/search?q=${query}`;
  });
}
