export default function DocsIndex() {
  return `
    <section>
      <p class="eyebrow">Docs</p>
      <h1>FastScript Documentation</h1>
      <ul>
        <li><code>pages/</code> for file-based routing</li>
        <li><code>api/</code> for server endpoints</li>
        <li><code>middleware.fs</code> for guards/security</li>
        <li><code>db/</code> for migrations and seeds</li>
        <li><code>jobs/</code> for worker handlers</li>
      </ul>
      <div class="hero-links">
        <a href="/learn">Learn</a>
        <a href="/examples">Examples</a>
        <a href="/changelog">Changelog</a>
        <a href="/docs/search">Search</a>
        <a href="/docs/latest">Docs latest</a>
        <a href="/docs/v1">Docs v1</a>
        <a href="/docs/v1.1">Docs v1.1</a>
        <a href="/docs/playground">Playground</a>
      </div>
      <p>Quality gate: <code>npm run qa:all</code></p>
    </section>
  `;
}
