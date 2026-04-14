export default function DocsV1Page() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Docs v1</p>
        <h1 class="section-title">FastScript v1 baseline architecture.</h1>
        <p class="section-copy">This track captures the foundational contract: file routing, server runtime, middleware, API handlers, and initial production adapters.</p>
      </header>

      <div class="docs-grid">
        <article class="docs-card">
          <h3 class="docs-title">Routing conventions</h3>
          <p class="docs-copy">Use <code>app/pages</code> for page routes, dynamic params in bracket syntax, and <code>_layout.fs</code> for shared wrappers.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Server primitives</h3>
          <p class="docs-copy">Use <code>ctx</code> for auth helpers, storage, queue, tenant scope, and input validation in API handlers.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Release policy</h3>
          <p class="docs-copy">Every release must pass qa:all and produce synchronized benchmark + interop proof artifacts.</p>
        </article>
      </div>
    </section>
  `;
}
