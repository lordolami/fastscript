export default function AgencyOpsGuidePage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Strict-TypeScript proving-ground app</p>
        <h1 class="h1">Agency Ops SaaS</h1>
        <p class="lead">Agency Ops is the public developer guide for the strict-TypeScript <code class="ic">.fs</code> app built from the stable <code class="ic">startup-mvp</code> baseline. It exists to prove that the only visible FastScript difference can be the filename while pages, APIs, jobs, middleware, and deployment still live in one runtime boundary.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">What it is</p>
          <p class="docs-card-copy">A small-agency client-ops product with clients, engagements, team, billing, settings, and ops follow-up flows. It is documented publicly, but it does not replace the official <code class="ic">startup-mvp</code> starter contract.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Why it exists</p>
          <p class="docs-card-copy">To show developers a product-shaped FastScript app written in strict ordinary TypeScript inside <code class="ic">.fs</code> files, without FastScript-only syntax or UI primitives.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Who should use it</p>
          <p class="docs-card-copy">Use Agency Ops when you want a greenfield client-ops SaaS, an internal service-delivery dashboard, a retainers-and-billing workflow app, or a compact admin product with notifications and invoice trails.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">When to choose it</p>
          <p class="docs-card-copy">Choose this guide when you want a stricter TS-only proving-ground app. Choose <a href="/docs/team-dashboard-saas">Team Dashboard SaaS</a> when you want the official public starter baseline.</p>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Use it perfectly</p>
          <h2 class="h2">How developers should work from this app.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">1. Fork the app</p>
            <p class="docs-card-copy">Copy <code class="ic">examples/agency-ops</code> into your product workspace and keep the architecture intact: <code class="ic">app/pages</code>, <code class="ic">app/api</code>, <code class="ic">app/jobs</code>, <code class="ic">app/db</code>, and middleware.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">2. Rename the domain</p>
            <p class="docs-card-copy">Replace agency/client language with your own product domain, but keep the runtime boundary unified. The point is to preserve one full-stack app, not split the codebase back into multiple frameworks.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">3. Stay inside the matrix</p>
            <p class="docs-card-copy">Before you promise a framework shape or runtime behavior, check <a href="/docs/support">/docs/support</a>. Extend only inside proven lanes or treat the gap as compatibility work.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">4. Run the proof path</p>
            <p class="docs-card-copy">Use <code class="ic">npm run test:agency-ops</code>, <code class="ic">npm run validate</code>, and then your full QA gate before shipping. That keeps the TS-only proving-ground story honest.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">What parts do what</p>
          <h2 class="h2">Developer map of the app boundary.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">Pages</p>
            <p class="story-cell-copy">UI routes and server-rendered product screens live in <code class="ic">app/pages</code>: marketing, sign-in, dashboard, clients, team, billing, settings, and ops.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">APIs</p>
            <p class="story-cell-copy">Mutations and workflow actions live in <code class="ic">app/api</code>: session bootstrap, agency snapshot, client create/list, team invite, settings update, billing checkout, and notification replay.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Jobs</p>
            <p class="story-cell-copy">Async receipts and follow-up work live in <code class="ic">app/jobs</code>. This is where billing and notification side effects stay inside the same product runtime.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">DB + middleware</p>
            <p class="story-cell-copy">Seed data and collection-backed state live in <code class="ic">app/db</code>, while auth/session guardrails live in middleware. That gives you one product boundary from seed to request to async job.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Use cases</p>
          <h2 class="h2">Best fits for this proving-ground app.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Client-ops SaaS</p>
            <p class="docs-card-copy">Agencies, consultancies, and service teams that need clients, retainers, follow-up work, team roles, and billing visibility in one app.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Internal delivery dashboard</p>
            <p class="docs-card-copy">A compact operations panel for team workload, service handoffs, invoice visibility, and notification-triggered follow-up.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Retainers + notifications product</p>
            <p class="docs-card-copy">A product where recurring value, invoices, queued reminders, and role-based ops views matter more than a huge CRM surface.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">TS-only adoption demo</p>
            <p class="docs-card-copy">The cleanest current demo for showing developers that ordinary TypeScript can live in <code class="ic">.fs</code> without changing the app architecture.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Performance evidence</p>
          <h2 class="h2">Deadly-speed claims need app-specific proof.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Build-speed proof</p>
            <p class="docs-card-copy">Agency Ops is measured as its own benchmark corpus. The latest proof shows an <code class="ic">895.79ms</code> cold build and a <code class="ic">1065.45ms</code> warm-build p95 trimmed result for <code class="ic">examples/agency-ops</code>.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Runtime proof</p>
            <p class="docs-card-copy">Representative production-start timings are currently <code class="ic">6.43ms</code> for <code class="ic">/</code>, <code class="ic">37.35ms</code> for <code class="ic">/dashboard</code>, <code class="ic">10.52ms</code> for <code class="ic">/dashboard/clients</code>, and <code class="ic">22.41ms</code> for <code class="ic">/api/session</code>.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">How to read it</p>
            <p class="docs-card-copy">Use the proof pack and benchmark artifacts as the source of truth. If the app-specific numbers regress, do not keep making stronger speed claims until the proof is rerun.</p>
            <a class="docs-card-link" href="/benchmarks">Open benchmarks &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Compatibility rule</p>
            <p class="docs-card-copy">If a valid JS/TS pattern used here fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug. Log it through the compatibility lane instead of patching around it locally.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Open compatibility lane &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
