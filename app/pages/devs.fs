const TEAM = [{
  name: "Olamilekan Akinuli",
  role: "Founder - Product + Platform",
  copy: "Leads language design, full-stack product strategy, ecosystem positioning, and shipping cadence. Owns the FastScript 5.0 contract, release governance, completeness direction, and platform-proof discipline."
}, {
  name: "Compiler lane",
  role: "Parser + Typecheck",
  copy: "Owns route typing, diagnostics, source maps, and stable .fs to JavaScript compilation. Maintains the conformance snapshot harness and semantic type checker."
}, {
  name: "Runtime lane",
  role: "Server + Deploy",
  copy: "Owns middleware, auth, job queue, storage, worker orchestration, and deploy adapters for Node, Vercel, and Cloudflare Workers."
}, {
  name: "DX lane",
  role: "Editor + Docs",
  copy: "Owns the VS Code extension, LSP server, docs quality, learning surfaces, and adoption loops for developers working inside the FastScript platform."
}];
export default function DevsPage() {
  const cells = TEAM.map(member => `
    <div class="team-cell">
      <p class="team-name">${member.name}</p>
      <p class="team-role">${member.role}</p>
      <p class="team-copy">${member.copy}</p>
    </div>
  `).join("");
  return `
    <section class="devs-hero">
      <header class="sec-header">
        <p class="kicker">About the builders</p>
        <h1 class="h1">Team architecture behind FastScript.</h1>
        <p class="lead">FastScript is built as a product system, not just a compiler experiment. Each lane ships against measurable output: proof-backed speed, governed compatibility evidence, deploy reliability, and a platform boundary strong enough to keep the language core compounding in one direction.</p>
      </header>

      <div class="team-grid">${cells}</div>

      <div class="action-row">
        <a class="btn btn-primary btn-lg" href="/changelog">Release history</a>
        <a class="btn btn-ghost btn-lg" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub source &rarr;</a>
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
          <div class="feature-icon">&#128208;</div>
          <p class="feature-title">Spec-driven language</p>
          <p class="feature-copy">Every language change updates the formal spec, conformance snapshots, diagnostics, and formatter tests before merging. No informal grammar drift.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#129514;</div>
          <p class="feature-title">Evidence over intuition</p>
          <p class="feature-copy">Benchmarks, smoke tests, interop matrices, support-matrix generation, and proof packs are produced for every release, not just when something breaks.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#128274;</div>
          <p class="feature-title">Stability guarantees</p>
          <p class="feature-copy">The current 5.x line keeps parser spans, diagnostic codes, formatter output, compatibility guarantees, and security-readiness contract stable across patch releases. Breaking changes require a major version and migration docs.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">TM</div>
          <p class="feature-title">Protected core</p>
          <p class="feature-copy">The FastScript name, branding, language core, and commercial platform rights are protected by Lakesbim Infotechnology. Public review does not grant competing product rights.</p>
        </div>
      </div>
    </section>

    <hr class="section-divider">

    <section class="devs-principles">
      <header class="sec-header-sm">
        <p class="kicker">Founder note</p>
        <h2 class="h2">Why this is being built.</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell">
          <p class="story-cell-title">The mission</p>
          <p class="story-cell-copy">The goal is to collapse stack sprawl without asking developers to abandon JavaScript or TypeScript. FastScript turns <code class="ic">.fs</code> into the runtime-native container so teams keep familiar syntax, keep package compatibility, and gain a calmer full-stack pipeline.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">Why proprietary</p>
          <p class="story-cell-copy">FastScript is source-available for trust, evaluation, and adoption, but the main language/runtime remains proprietary because it is part of the platform moat. That advantage should compound inside FastScript, not subsidize copycats.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">What 5.0 means</p>
          <p class="story-cell-copy">This line makes the public claim broader and stronger: FastScript is the structured substrate for AI-system workflows, with a full platform console, governed support matrix, and release discipline that makes the system inspectable instead of mysterious.</p>
        </div>
      </div>
    </section>
  `;
}
