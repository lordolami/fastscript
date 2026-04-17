const RELEASES = [{
  version: "v3.1.1",
  date: "April 2026",
  copy: "Cloudflare runtime-recovery patch: router and manifest assets now refresh as volatile control-plane files, dynamic import failures retry against the latest manifest, and deployed users stop needing a manual refresh after a fresh worker rollout."
}, {
  version: "v3.1.0",
  date: "April 2026",
  copy: "Rename-only compatibility release: ordinary JS/TS/JSX/TSX now adopts .fs by extension change alone, migration stays rename-first, smoke gates run on isolated ports, and the public support matrix/docs/npm line all reflect the new contract."
}, {
  version: "v3.0.8",
  date: "April 2026",
  copy: "Release-line cache policy cleanup: SSR HTML now ships with no-store semantics so plain root requests stop lagging behind deploys, while the production shell and logical-manifest asset contract remain stable."
}, {
  version: "v3.0.7",
  date: "April 2026",
  copy: "Final language-line wrap-up: the production shell now ships with the correct non-dev service-worker posture, the logical-manifest plus asset-manifest contract remains stable, and the root npm plus Cloudflare release surfaces are resynced from one green source state."
}, {
  version: "v3.0.6",
  date: "April 2026",
  copy: "Asset fingerprint cleanup release: FastScript now keeps a logical app graph in fastscript-manifest.json, resolves hashed modules exclusively through asset-manifest.json, and prevents multi-hash drift across repeated builds."
}, {
  version: "v3.0.5",
  date: "April 2026",
  copy: "Stabilization release: deployed apps now auto-refresh after service worker activation, production SSR resolves emitted modules through the asset manifest, and npm plus the root Cloudflare runtime are resynced from one final source state."
}, {
  version: "v3.0.4",
  date: "April 2026",
  copy: "Final foundation-grade ship line: npm, release notes, root Cloudflare deploy, and generated proof/search/benchmark surfaces aligned on the same post-gate source state."
}, {
  version: "v3.0.3",
  date: "April 2026",
  copy: "Foundation-grade release hardening: compatibility-matrix artifacts regenerated from code truth, proof/search/API/support outputs refreshed, and the full parser/typecheck/runtime gate chain re-verified green for public shipping."
}, {
  version: "v3.0.2",
  date: "April 2026",
  copy: "Team Dashboard SaaS baseline elevated across examples, showcase, adoption docs, npm metadata, and release surfaces, with validator-safe styling, CSRF/session-safe proof flow, and corrected runtime port behavior in the reference app suite."
}, {
  version: "v3.0.1",
  date: "April 2026",
  copy: "Broader governed ecosystem proof sweep: deeper Next-style, React, Node, Vue, and npm/package interop coverage shipped into the public support matrix, proof pack, docs search, and npm-facing release story."
}, {
  version: "v3.0.0",
  date: "April 2026",
  copy: "FastScript v3 public surface rewrite: `.fs` positioned as a universal JS/TS container, v3 docs became the latest line, website messaging aligned to proof-backed speed claims, and parity proofs were elevated into release discipline."
}, {
  version: "v2.0.0",
  date: "April 2026",
  copy: "FastScript v2.0 ratified: ambient runtime and standard library completed, authored `.fs` parity hardened, public/private boundary frozen, and the formal execution tracker published."
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
        <p class="lead">FastScript ships with proof-pack updates, parity artifacts, regression tests, and release signoff artifacts. No guesswork &mdash; just verifiable milestones.</p>
      </header>

      <div class="list-items">${items}</div>

      <div class="action-row">
        <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript/releases" target="_blank" rel="noreferrer">GitHub releases</a>
        <a class="btn btn-ghost btn-lg" href="/benchmarks">View proof pack</a>
      </div>
    </section>
  `;
}
