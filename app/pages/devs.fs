const TEAM = [{
  name: "Olamilekan Akinuli",
  role: "Founder — Product + Platform",
  copy: "Leads language design, full-stack strategy, ecosystem positioning, and production shipping cadence. Responsible for FastScript v1 scope freeze and release governance."
}, {
  name: "Compiler lane",
  role: "Parser + Typecheck",
  copy: "Owns route typing, diagnostics, source maps, and stability of .fs to JavaScript compilation. Maintains the conformance snapshot harness and semantic type checker."
}, {
  name: "Runtime lane",
  role: "Server + Deploy",
  copy: "Owns middleware pipeline, auth, job queue, storage, worker orchestration, and deploy adapters for Node, Vercel, and Cloudflare Workers."
}, {
  name: "DX lane",
  role: "Editor + Docs",
  copy: "Owns VS Code language extension, LSP server, documentation quality, and adoption loops for developers and AI systems consuming FastScript context packs."
}];
export default function DevsPage() {
  const cells = TEAM.map(m => `
    <div class="team-cell">
      <p class="team-name">${m.name}</p>
      <p class="team-role">${m.role}</p>
      <p class="team-copy">${m.copy}</p>
    </div>
  `).join("");
  return `
    <section class="devs-hero">
      <header class="sec-header">
        <p class="kicker">About the builders</p>
        <h1 class="h1">Team architecture behind FastScript.</h1>
        <p class="lead">FastScript is built as a product system, not just a compiler experiment. Each lane ships against measurable output: test evidence, runtime parity, and deploy reliability.</p>
      </header>

      <div class="team-grid">${cells}</div>

      <div class="action-row">
        <a class="btn btn-primary btn-lg" href="/changelog">Release history</a>
        <a class="btn btn-ghost btn-lg" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub source →</a>
      </div>
    </section>

    <hr class="section-divider">

    <section class="devs-principles">
      <header class="sec-header-sm">
        <p class="kicker">Principles</p>
        <h2 class="h2">How we build.</h2>
      </header>
      <div class="feature-grid">
        <div class="feature-cell">
          <div class="feature-icon">📐</div>
          <p class="feature-title">Spec-driven language</p>
          <p class="feature-copy">Every language change updates the formal spec, conformance snapshots, diagnostics, and formatter tests before merging. No informal grammar drift.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">🧪</div>
          <p class="feature-title">Evidence over intuition</p>
          <p class="feature-copy">Benchmarks, smoke tests, interop matrices, and proof packs are produced for every release — not just when something breaks.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">🔒</div>
          <p class="feature-title">Stability guarantees</p>
          <p class="feature-copy">v1 parser spans, diagnostic codes, and formatter output are stable across patch releases. Breaking changes require major version and migration docs.</p>
        </div>
      </div>
    </section>
  `;
}
