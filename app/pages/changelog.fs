const RELEASES = [{
  version: "v2.0.0",
  date: "April 2026",
  copy: "FastScript v2.0 ratified: ambient runtime and standard library completed, zero-JS authored app proof gates passed, public/private boundary frozen, and the formal execution tracker published."
}, {
  version: "v1.0.0",
  date: "April 2026",
  copy: "FastScript v1 stable release: language baseline locked, website polished, deploy adapters hardened, and interop guarantees published."
}, {
  version: "v0.1.4",
  date: "April 2026",
  copy: "Canonical repo lock, quality gate hardening, proof-pack publishing, and benchmark suite stabilization."
}, {
  version: "v0.1.3",
  date: "April 2026",
  copy: "VS Code language toolkit refresh and extension packaging improvements for .fs editor workflows."
}, {
  version: "v0.1.2",
  date: "April 2026",
  copy: "Full-stack platform baseline: routing, SSR, middleware, auth, DB, jobs, storage, and deploy adapter outputs."
}, {
  version: "v0.1.1",
  date: "April 2026",
  copy: "Release prep and scaffolding improvements. Initial QA pipeline foundation."
}, {
  version: "v0.1.0",
  date: "April 2026",
  copy: "Initial FastScript public release with JavaScript ecosystem compatibility and core build pipeline."
}];
export default function ChangelogPage() {
  const items = RELEASES.map(r => `
    <div class="list-item">
      <div class="list-item-meta">${r.date}</div>
      <div class="list-item-body">
        <p class="list-item-version">${r.version}</p>
        <p class="list-item-copy">${r.copy}</p>
      </div>
      <span class="list-item-arrow">&#8594;</span>
    </div>
  `).join("");
  return `
    <section class="changelog-page">
      <header class="sec-header">
        <p class="kicker">Changelog</p>
        <h1 class="h1">Every release tied to evidence.</h1>
        <p class="lead">FastScript ships with proof-pack updates, regression tests, and release signoff artifacts. No guesswork &mdash; just verifiable milestones.</p>
      </header>

      <div class="list-items">${items}</div>

      <div class="action-row">
        <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript/releases" target="_blank" rel="noreferrer">GitHub releases</a>
        <a class="btn btn-ghost btn-lg" href="/benchmarks">View proof pack</a>
      </div>
    </section>
  `;
}
