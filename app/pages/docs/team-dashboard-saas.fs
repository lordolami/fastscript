export default function TeamDashboardSaasDocsPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Reference app baseline</p>
        <h1 class="h1">Team Dashboard SaaS</h1>
        <p class="lead">This is the first official FastScript greenfield product baseline. It ships through the stable <code class="ic">startup-mvp</code> template id, but the public product story is a team dashboard SaaS with real pages, APIs, auth, billing, jobs, DB state, and deployment flow.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Stable template id</p>
          <p class="docs-card-copy">Keep using <code class="ic">fastscript create startup-mvp --template startup-mvp</code>. The CLI surface stays stable while the public reference app is positioned as the Team Dashboard SaaS baseline.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">What it proves</p>
          <p class="docs-card-copy">One FastScript app boundary can hold public marketing, authenticated dashboard routes, API mutations, queue-backed jobs, DB state, and deploy-adapter generation without splitting into a second stack.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Governed by support</p>
          <p class="docs-card-copy">This app does not create a new contract. It consumes the existing <a href="/docs/support">support matrix</a> and turns proven lanes into a real product-shaped baseline.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Use it when</p>
          <p class="docs-card-copy">Choose this baseline when you want a real SaaS footprint: marketing pages, sign-in, workspace bootstrap, team/project CRUD, billing, admin/support visibility, and Cloudflare-first deployment.</p>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Surface</p>
          <h2 class="h2">What is inside the baseline.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">Pages</p>
            <p class="story-cell-copy">Public marketing, sign-in, workspace overview, projects, team, billing, settings, and admin/support routes live in <code class="ic">app/pages</code>.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">APIs</p>
            <p class="story-cell-copy">Session, workspace, projects, members, settings, billing checkout, and notification replay all live inside one FastScript API surface.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Jobs</p>
            <p class="story-cell-copy">Receipt and notification jobs prove queue-backed follow-up work without leaving the same runtime contract.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Domain model</p>
            <p class="story-cell-copy">Workspace, membership, project, subscription, invoice, activity, and notification job records keep the MVP product-real while still compact enough to learn from.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Start here</p>
          <h2 class="h2">Use this as the first greenfield product path.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">1. Create it</p>
            <p class="docs-card-copy"><code class="ic">fastscript create startup-mvp --template startup-mvp</code> gives you the exact reference app shape used in the governed smoke suite.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">2. Check matrix coverage</p>
            <p class="docs-card-copy">Before adding framework-specific behavior or promising a runtime shape, cross-check <a href="/docs/support">/docs/support</a> so your product scope stays inside proven lanes.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">3. Run proof locally</p>
            <p class="docs-card-copy">Use <code class="ic">npm run test:startup-mvp-saas</code> plus the normal validation gate to prove the baseline still builds, authenticates, mutates state, and deploys cleanly.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">4. Treat gaps as product work</p>
            <p class="docs-card-copy">If your real feature path exposes a valid JS/TS or runtime gap, do not patch around it silently. Open the compatibility lane and feed it back into the governed matrix.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Key routes and proof</p>
          <h2 class="h2">The baseline is already exercised end to end.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Reference routes</p>
            <p class="docs-card-copy"><code class="ic">/</code>, <code class="ic">/sign-in</code>, <code class="ic">/dashboard</code>, <code class="ic">/dashboard/projects</code>, <code class="ic">/dashboard/team</code>, <code class="ic">/dashboard/billing</code>, <code class="ic">/dashboard/settings</code>, and <code class="ic">/dashboard/admin</code>.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Reference APIs</p>
            <p class="docs-card-copy"><code class="ic">/api/session</code>, <code class="ic">/api/workspaces</code>, <code class="ic">/api/projects</code>, <code class="ic">/api/members</code>, <code class="ic">/api/workspace-settings</code>, <code class="ic">/api/billing/checkout</code>, and <code class="ic">/api/notifications/retry</code>.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Dedicated proof</p>
            <p class="docs-card-copy">The app now has a dedicated smoke suite that proves build, Cloudflare adapter generation, session bootstrap, CSRF-safe mutations, rolling session behavior, and dashboard/admin flows.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Use these next</p>
          <h2 class="h2">Keep the baseline tied to governed support.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Learn this in the school</p>
            <p class="docs-card-copy">Use the school when you want the baseline explained step by step before you fork it into a real product.</p>
            <a class="docs-card-link" href="/learn/beginner/what-is-code">Begin with web basics &#8594;</a>
            <a class="docs-card-link" href="/learn/fullstack/pages-routes-and-loaders">Study the full-stack flow &#8594;</a>
            <a class="docs-card-link" href="/learn/shipping/build-validate-and-start">Study shipping discipline &#8594;</a>
            <a class="docs-card-link" href="/learn/mastery/capstone-product-architecture">Use the mastery capstone path &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Open adoption flow</p>
            <p class="docs-card-copy">See how this baseline fits into the broader greenfield and migration program.</p>
            <a class="docs-card-link" href="/docs/adoption">Open adoption guide &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Open support matrix</p>
            <p class="docs-card-copy">Use the matrix before expanding the baseline into additional framework/runtime territory.</p>
            <a class="docs-card-link" href="/docs/support">Open support matrix &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Browse the template source</p>
            <p class="docs-card-copy">Use the template source directly when you want to extend the baseline for your own product work.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/tree/master/examples/startup-mvp" target="_blank" rel="noreferrer">Open template source &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
