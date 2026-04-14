export default function DocsV11Page() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Docs v1.1</p>
        <h1 class="section-title">Hardening track: editor intelligence, adapters, and interop scale.</h1>
        <p class="section-copy">v1.1 expands route priority logic, loader data inference, VS Code LSP diagnostics, and deploy adapter resilience for Vercel + Cloudflare.</p>
      </header>

      <div class="docs-grid">
        <article class="docs-card">
          <h3 class="docs-title">Route priority sorting</h3>
          <p class="docs-copy">Specific static routes now consistently outrank optional and catch-all dynamic patterns in all runtimes.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Loader data contracts</h3>
          <p class="docs-copy">Typecheck now emits route loader return shape mappings in generated route context types.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">LSP improvements</h3>
          <p class="docs-copy">Import resolution diagnostics, document links, references, and quick-fix actions ship in the extension toolkit.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Adapter verification</h3>
          <p class="docs-copy">Deploy adapter tests now validate generated Node/Vercel/Cloudflare artifacts as part of core test flow.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Interop matrix expansion</h3>
          <p class="docs-copy">Matrix coverage now includes preact, solid-js, scoped package subpaths, and dual-mode package exports.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Release confidence</h3>
          <p class="docs-copy">Proof-pack remains synchronized with benchmark suite and interop reports through qa:all.</p>
        </article>
      </div>
    </section>
  `;
}
