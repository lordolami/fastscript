const TEAM = [{
  name: "Olamilekan Akinuli",
  role: "Founder &mdash; Product + Platform",
  copy: "Leads language design, full-stack strategy, ecosystem positioning, and production shipping cadence. Responsible for FastScript v3 positioning, release governance, compatibility-first product direction, and the next FastScript AI assistant line."
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
        <p class="lead">FastScript is built as a product system, not just a compiler experiment. Each lane ships against measurable output: test evidence, runtime parity, deploy reliability, and protection of the language core as part of the wider FastScript AI platform.</p>
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
          <p class="feature-copy">Benchmarks, smoke tests, interop matrices, and proof packs are produced for every release &mdash; not just when something breaks.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#128274;</div>
          <p class="feature-title">Stability guarantees</p>
          <p class="feature-copy">The current v3 line keeps parser spans, diagnostic codes, formatter output, and compatibility guarantees stable across patch releases. Breaking changes require a major version and migration docs.</p>
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
          <p class="story-cell-copy">The goal is to collapse stack sprawl without asking developers to abandon JavaScript or TypeScript. v3 turns <code class="ic">.fs</code> into the runtime-native container so teams keep familiar syntax and gain a faster pipeline.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">Why proprietary</p>
          <p class="story-cell-copy">FastScript is source-available for trust, evaluation, and adoption, but the main language/runtime remains proprietary because it is also the foundation for the future FastScript AI assistant. That moat is intentional.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">What comes next</p>
          <p class="story-cell-copy">The next wave is an AI coding assistant built on the main FastScript language/runtime, designed for stronger accuracy, faster deciphering of messy codebases, and better full-stack execution discipline than generic assistants.</p>
        </div>
      </div>
    </section>
  `;
}
