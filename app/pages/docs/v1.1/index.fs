export default function DocsV11() {
  return `
    <section class="docs-v11-page">
      <header class="sec-header">
        <p class="kicker">Language spec v1.1</p>
        <h1 class="h1">FastScript v1.1 — what is new.</h1>
        <p class="lead">v1.1 builds on the v1 baseline with route priority sorting, richer loader type contracts, expanded interop coverage, and deploy adapter hardening.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Route priority sorting</p>
          <p class="docs-card-copy">Static segments now outrank dynamic segments and catch-alls. Exact matches always win. Priorities are computed at build time and embedded in the manifest.</p>
          <a class="docs-card-link" href="/learn">See quickstart &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Loader data type contracts</p>
          <p class="docs-card-copy">Route loader return shapes are inferred and surfaced as type suggestions in the VS Code extension. Reduces runtime guesswork on data-driven pages.</p>
          <a class="docs-card-link" href="/docs/v1">View v1 baseline &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Interop expansion</p>
          <p class="docs-card-copy">13/13 combinations in the interop matrix now passing including mixed bundle scenarios and dynamic imports routed through the asset manifest.</p>
          <a class="docs-card-link" href="/benchmarks">View interop matrix &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Deploy adapter hardening</p>
          <p class="docs-card-copy">Node, Vercel, and Cloudflare adapters now include hardened security headers, cache-control policies, and startup time optimizations by default.</p>
          <a class="docs-card-link" href="/changelog">See changelog &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">LSP intelligence</p>
          <p class="docs-card-copy">The VS Code language extension now provides hover documentation, go-to-definition across .fs files, and inline diagnostic rendering from the type checker.</p>
          <a class="docs-card-link" href="/devs">About the team &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Playground</p>
          <p class="docs-card-copy">Try v1.1 syntax directly in the browser without installing the CLI. Includes example templates for reactive bindings, page loaders, and API handlers.</p>
          <a class="docs-card-link" href="/docs/playground">Open playground &#8594;</a>
        </div>
      </div>
    </section>
  `;
}
