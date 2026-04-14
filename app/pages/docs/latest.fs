export default function DocsLatest() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Docs latest</p>
        <h1 class="h1">Current docs track: FastScript v2.0</h1>
        <p class="lead">This alias is the canonical entrypoint for the ratified v2.0 language/runtime surface, release notes, install flow, and migration proof pack.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Repo install + npm link</p>
          <p class="docs-card-copy">The current shipping path is repo-first: clone FastScript, run npm install, then npm link for a global CLI backed by your local checkout.</p>
          <a class="docs-card-link" href="/learn">Open install flow &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">v2.0 formal spec</p>
          <p class="docs-card-copy">Ratified language/runtime scope, execution plan, tracker, migration proof, and performance protocol for the frozen v2.0 line.</p>
          <a class="docs-card-link" href="/docs/v2">Open v2.0 &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Interop guide</p>
          <p class="docs-card-copy">Use npm packages, mixed JS/FS modules, and incremental migration patterns without leaving the FastScript app boundary.</p>
          <a class="docs-card-link" href="/docs/interop">Open interop guide &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Styling primitives</p>
          <p class="docs-card-copy">Box, Stack, Row, Text, Heading, Button, semantic spacing, tones, surfaces, and generated primitive CSS now form the permanent styling direction.</p>
          <a class="docs-card-link" href="/docs/primitives">Read primitive guide &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">API reference</p>
          <p class="docs-card-copy">Generated API docs are available in repo docs and searchable through the docs index API.</p>
          <a class="docs-card-link" href="/docs/search">Search reference &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Legacy docs</p>
          <p class="docs-card-copy">Older v1 and v1.1 docs remain available for historical upgrade notes and earlier language baselines.</p>
          <a class="docs-card-link" href="/docs/v1">Open legacy docs &#8594;</a>
        </div>
      </div>
    </section>
  `;
}
