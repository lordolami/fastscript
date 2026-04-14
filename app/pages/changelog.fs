const RELEASES = [{
  version: "v0.1.5",
  date: "April 2026",
  copy: "LSP intelligence expansion, deploy adapter hardening, route priority sorting, richer route loader type contracts, and broader interop matrix coverage."
}, {
  version: "v0.1.4",
  date: "April 2026",
  copy: "Canonical repo lock, quality gate hardening, proof-pack publishing, and benchmark suite stabilization."
}, {
  version: "v0.1.3",
  date: "April 2026",
  copy: "VS Code language toolkit refresh and extension packaging improvements for .fs workflows."
}, {
  version: "v0.1.2",
  date: "April 2026",
  copy: "Full-stack platform baseline: routing, SSR, middleware, auth, DB, jobs, storage, and deploy outputs."
}, {
  version: "v0.1.0",
  date: "April 2026",
  copy: "Initial FastScript public release with JS ecosystem compatibility and full QA pipeline foundation."
}];
export default function ChangelogPage() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Changelog</p>
        <h1 class="section-title">Every release is tied to evidence, not guesswork.</h1>
        <p class="section-copy">FastScript ships with proof-pack updates, regression tests, and release signoff artifacts. This page summarizes the visible product milestones.</p>
      </header>

      <div class="release-list">
        ${RELEASES.map(release => `
          <article class="release-item">
            <h3 class="release-version">${release.version}</h3>
            <span class="release-date">${release.date}</span>
            <p class="release-copy">${release.copy}</p>
          </article>
        `).join("")}
      </div>

      <div class="hero-actions">
        <a class="btn btn-primary" href="https://github.com/lordolami/fastscript/releases" target="_blank" rel="noreferrer">GitHub releases</a>
        <a class="btn btn-ghost" href="/benchmarks">Proof pack</a>
      </div>
    </section>
  `;
}
