export default function DocsLatest() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Docs latest</p>
        <h1 class="h1">Current docs track: FastScript v3</h1>
        <p class="lead">This alias is the canonical entrypoint for the current v3 product contract: universal JS/TS in <code class="ic">.fs</code>, optional FastScript sugar, proof-backed speed, release evidence, and a protected core that compounds into future FastScript AI tooling.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">npm install</p>
          <p class="docs-card-copy">The current shipping path is npm-first: install FastScript globally and use the self-contained CLI right away. Repo clone remains the workflow for language development.</p>
          <a class="docs-card-link" href="/learn">Open install flow &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">v3 overview</p>
          <p class="docs-card-copy">Current public line: <code class="ic">.fs</code> as a universal JS/TS container, optional sugar, parity proof, benchmark discipline, and release-facing evidence.</p>
          <a class="docs-card-link" href="/docs/v3">Open v3 &#8594;</a>
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
          <p class="docs-card-title">Compatibility matrix</p>
          <p class="docs-card-copy">Open the governed compatibility registry surface for proven JS/TS, framework, runtime, and tooling claims.</p>
          <a class="docs-card-link" href="/docs/support">Open support matrix &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Legacy docs</p>
          <p class="docs-card-copy">Older v1, v1.1, and v2 docs remain available for historical upgrade notes and earlier language baselines.</p>
          <a class="docs-card-link" href="/docs/v1">Open legacy docs &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Release notes</p>
          <p class="docs-card-copy">Launch-facing v3 release notes summarize parity, performance proof, packaging, and licensing boundaries for npm and GitHub surfaces.</p>
          <a class="docs-card-link" href="/changelog">Open release notes &#8594;</a>
        </div>
      </div>
    </section>
  `;
}
