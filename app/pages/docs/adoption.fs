export default function DocsAdoptionPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Real-world adoption</p>
        <h1 class="h1">The canonical path from evaluation to real product work.</h1>
        <p class="lead">FastScript 3.0.1 is the first real-world adoption line. Use this flow to start a new <code class="ic">.fs</code> app or migrate an existing JS/TS codebase without guessing what is proven, partial, planned, or blocked.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Stable public line</p>
          <p class="docs-card-copy"><code class="ic">3.0.1</code> is the active public line. The compatibility-governance system is the internal 4.0 discipline model, but support claims for shipping work are governed publicly through the current support matrix.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Source of truth</p>
          <p class="docs-card-copy">Before you promise a framework shape, syntax lane, or runtime pattern, check <a href="/docs/support">/docs/support</a>. That matrix is the contract for what FastScript currently proves.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Bug policy</p>
          <p class="docs-card-copy">If valid JS/TS fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug. Report it through the compatibility lane so it becomes a governed matrix row plus proof work.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Full-stack scope</p>
          <p class="docs-card-copy">Use FastScript for frontend pages, backend APIs, middleware, jobs, workers, and deploy adapters in one runtime boundary. The matrix tells you which patterns are already proven for real-world work.</p>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Path A</p>
          <h2 class="h2">Start a new app directly in <code class="ic">.fs</code>.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Recommended baseline</p>
            <p class="docs-card-copy">For the first real product path, start from the Team Dashboard SaaS reference app. It keeps the stable template id <code class="ic">startup-mvp</code> but gives you the strongest greenfield baseline in the repo today.</p>
            <a class="docs-card-link" href="/docs/team-dashboard-saas">Open baseline guide &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">1. Create the app</p>
            <p class="docs-card-copy"><code class="ic">fastscript create my-app</code> gives you pages, API routes, middleware, migrations, and styling primitives as a working full-stack baseline.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">2. Build in one runtime</p>
            <p class="docs-card-copy">Keep pages, APIs, middleware, and shared helpers in the same app boundary. Write ordinary TS/JS in <code class="ic">.fs</code>; FastScript-specific sugar is optional.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">3. Run the shipping gate</p>
            <p class="docs-card-copy">Use <code class="ic">npm run qa:all</code> before release. That keeps format, lint, typecheck, validate, tests, smoke, benchmarks, interop, and proof publication aligned.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">4. Deploy</p>
            <p class="docs-card-copy">Generate the target adapter you need and ship through Node, Vercel, or Cloudflare without re-architecting your source around a second stack.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Path B</p>
          <h2 class="h2">Migrate an existing JS/TS codebase incrementally.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">1. Start with a dry run</p>
            <p class="docs-card-copy">Run <code class="ic">npm run migrate -- app --dry-run</code> first. Inspect rename-only conversion, import rewrites, diff preview, validation, and manifest output before changing tracked source.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">2. Cross-check the matrix</p>
            <p class="docs-card-copy">Before migrating a route family or framework pattern, verify the lane in the support matrix. Prove the patterns you depend on instead of assuming every external shape is already covered.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">3. Keep CSS and packages</p>
            <p class="docs-card-copy">FastScript preserves CSS, assets, and npm packages. Migrate page-by-page or route-by-route instead of redesigning your whole product architecture.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">4. Roll back safely</p>
            <p class="docs-card-copy">If a conversion loses trust, use the manifest plus <code class="ic">npm run migrate:rollback</code> to revert the latest conversion cleanly and treat the gap as governed follow-up work.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">First-project program</p>
          <h2 class="h2">Use one greenfield app and one migration as the proving ground.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">Greenfield app</p>
            <p class="story-cell-copy">Choose one full-stack app that uses pages, APIs, middleware, storage or DB, and one deployment target. The goal is to prove that the normal FastScript developer loop is enough for real delivery.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Migration app</p>
            <p class="story-cell-copy">Choose one existing TS/JS codebase and migrate one representative slice into <code class="ic">.fs</code>. Keep a log of every matrix lane used and every compatibility edge case encountered.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Required evidence</p>
            <p class="story-cell-copy">For both apps, require setup instructions, build/dev/deploy success, support-matrix cross-checks, and explicit capture of any missing compatibility as product work.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">No silent exceptions</p>
            <p class="story-cell-copy">If a feature is missing, do not treat it as tribal knowledge. Either the matrix already covers it, or the gap becomes a compatibility issue plus proof expansion work.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Use these next</p>
          <h2 class="h2">Everything stays anchored to governed support.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Team Dashboard SaaS baseline</p>
            <p class="docs-card-copy">Use the official product-shaped reference app when you want the first serious greenfield FastScript starting point instead of a thinner starter.</p>
            <a class="docs-card-link" href="/docs/team-dashboard-saas">Open reference app guide &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Open support matrix</p>
            <p class="docs-card-copy">See what is currently proven, partial, planned, or blocked.</p>
            <a class="docs-card-link" href="/docs/support">Open support matrix &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Open interop + migration</p>
            <p class="docs-card-copy">Use the compatibility-first migration path and keep npm ecosystem interoperability visible while you move into <code class="ic">.fs</code>.</p>
            <a class="docs-card-link" href="/docs/interop">Open interop guide &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Report a compatibility gap</p>
            <p class="docs-card-copy">If real code fails, treat it as product work and use the public compatibility lane.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Open compatibility lane &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
