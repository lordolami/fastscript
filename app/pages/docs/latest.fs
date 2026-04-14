export default function DocsLatest() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Docs latest</p>
        <h1 class="section-title">Latest stable docs track: v1.1</h1>
        <p class="section-copy">This alias points to the newest stable FastScript track so teams can always deep-link to one canonical docs entrypoint.</p>
      </header>

      <div class="docs-grid">
        <article class="docs-card">
          <h3 class="docs-title">v1.1 highlights</h3>
          <p class="docs-copy">Route priority sorting, loader data type inference, and expanded deploy adapter hardening.</p>
          <a class="docs-arrow" href="/docs/v1.1">Open v1.1 -></a>
        </article>

        <article class="docs-card">
          <h3 class="docs-title">Need legacy mapping?</h3>
          <p class="docs-copy">Use the v1 route to cross-check older migration guidance and upgrade notes.</p>
          <a class="docs-arrow" href="/docs/v1">Open v1 -></a>
        </article>

        <article class="docs-card">
          <h3 class="docs-title">API reference</h3>
          <p class="docs-copy">Generated API docs are available in repo docs and searchable through the docs index API.</p>
          <a class="docs-arrow" href="/docs/search">Search reference -></a>
        </article>
      </div>
    </section>
  `;
}
