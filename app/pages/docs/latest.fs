export default function DocsLatest() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Docs latest</p>
        <h1 class="h1">Current docs tracks: v1 baseline and v1.1 additions</h1>
        <p class="lead">This alias gives teams one canonical docs entrypoint for the stable v1 baseline plus the latest additive updates.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Repo install + npm link</p>
          <p class="docs-card-copy">Today the cleanest developer flow is repo-first: clone FastScript, run npm install, then npm link for a global CLI backed by your local checkout.</p>
          <a class="docs-card-link" href="/learn">Open install flow &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Styling primitives</p>
          <p class="docs-card-copy">Box, Stack, Row, Text, Heading, Button, semantic spacing, tones, surfaces, and generated primitive CSS now form the permanent styling direction.</p>
          <a class="docs-card-link" href="/docs/primitives">Read primitive guide &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">v1.1 additions</p>
          <p class="docs-card-copy">Route priority sorting, loader data type inference, and expanded deploy adapter hardening.</p>
          <a class="docs-card-link" href="/docs/v1.1">Open v1.1 &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Need legacy mapping?</p>
          <p class="docs-card-copy">Use the v1 route to cross-check older migration guidance and upgrade notes.</p>
          <a class="docs-card-link" href="/docs/v1">Open v1 &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">API reference</p>
          <p class="docs-card-copy">Generated API docs are available in repo docs and searchable through the docs index API.</p>
          <a class="docs-card-link" href="/docs/search">Search reference &#8594;</a>
        </div>
      </div>
    </section>
  `;
}
