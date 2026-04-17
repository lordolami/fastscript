const RELEASES = [{
  version: "v4.0.2",
  date: "April 2026",
  copy: "Post-v4 cleanup hotfix: FastScript repairs template-literal build corruption at the compiler layer, aligns the public version/copy surfaces, fixes GitHub license links, and republishes regenerated docs, compatibility, and proof artifacts from one clean state."
}, {
  version: "v4.0.1",
  date: "April 2026",
  copy: "Platform-only completeness release plus metadata-shell patch: FastScript now publicly ratifies itself as the complete TypeScript full-stack platform, elevates /learn as a major proof surface, formalizes the Team Dashboard SaaS and Agency Ops apps as canonical references, and keeps the shipped SSR shell aligned across npm, GitHub, docs, and the live root site."
}, {
  version: "v3.1.1",
  date: "April 2026",
  copy: "Cloudflare runtime-recovery patch: router and manifest assets now refresh as volatile control-plane files, dynamic import failures retry against the latest manifest, and deployed users stop needing a manual refresh after a fresh worker rollout."
}, {
  version: "v3.1.0",
  date: "April 2026",
  copy: "Rename-only compatibility release: ordinary JS/TS/JSX/TSX now adopts .fs by extension change alone, migration stays rename-first, smoke gates run on isolated ports, and the public support matrix/docs/npm line all reflect the new contract."
}, {
  version: "v3.0.0",
  date: "April 2026",
  copy: "FastScript v3 public surface rewrite: .fs positioned as a universal JS/TS container, docs moved to the compatibility-first line, and parity proofs were elevated into release discipline."
}, {
  version: "v2.0.0",
  date: "April 2026",
  copy: "FastScript v2 ratified: ambient runtime and standard library completed, authored .fs parity hardened, public/private boundary frozen, and the formal execution tracker published."
}, {
  version: "v1.0.0",
  date: "April 2026",
  copy: "FastScript v1 stable release: language baseline locked, website polished, deploy adapters hardened, and interop guarantees published."
}, {
  version: "v0.1.2",
  date: "April 2026",
  copy: "Full-stack platform baseline: routing, SSR, middleware, auth, DB, jobs, storage, and deploy adapter outputs."
}, {
  version: "v0.1.0",
  date: "April 2026",
  copy: "Initial FastScript public release with JavaScript ecosystem compatibility and the core build pipeline."
}];
export default function ChangelogPage() {
  const items = RELEASES.map(release => `
    <div class="list-item">
      <div class="list-item-meta">${release.date}</div>
      <div class="list-item-body">
        <p class="list-item-version">${release.version}</p>
        <p class="list-item-copy">${release.copy}</p>
      </div>
      <span class="list-item-arrow">&#8594;</span>
    </div>
  `).join("");
  return `
    <section class="changelog-page">
      <header class="sec-header">
        <p class="kicker">Changelog</p>
        <h1 class="h1">Every release tied to evidence.</h1>
        <p class="lead">FastScript ships with proof-pack updates, compatibility artifacts, regression tests, and release signoff artifacts. The public line advances only when the evidence advances with it.</p>
      </header>

      <div class="list-items">${items}</div>

      <div class="action-row">
        <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript/releases" target="_blank" rel="noreferrer">GitHub releases</a>
        <a class="btn btn-ghost btn-lg" href="/benchmarks">View proof pack</a>
      </div>
    </section>
  `;
}
