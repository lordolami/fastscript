export default function DocsLatest() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Docs latest</p>
        <h1 class="h1">Current docs track: FastScript v4.0</h1>
        <p class="lead">This is the canonical entrypoint for the v4.0 platform contract: FastScript as the complete TypeScript full-stack platform, with ordinary TS in <code class="ic">.fs</code>, first-party validation, visible proof apps, governed support evidence, and a structured language/runtime layer that stays better aligned for machine reasoning and model-training workflows.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">FastScript school</p>
          <p class="docs-card-copy">/learn is now a major proof surface: start from zero or jump into product migration and full-stack adoption through browser-first lessons.</p>
          <a class="docs-card-link" href="/learn">Open /learn &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Platform overview</p>
          <p class="docs-card-copy">Read the v4 line as a full platform contract: pages, APIs, auth, data, jobs, proof discipline, and deploy outputs aligned under one FastScript runtime.</p>
          <a class="docs-card-link" href="/docs">Open docs overview &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Greenfield SaaS proof</p>
          <p class="docs-card-copy">The Team Dashboard SaaS reference app proves auth, teams, billing, notifications, admin, tests, and deployment in one greenfield product shape.</p>
          <a class="docs-card-link" href="/docs/team-dashboard-saas">Open SaaS proof &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Agency Ops proof</p>
          <p class="docs-card-copy">The operations reference app proves ordinary TypeScript in .fs while shipping authenticated dashboards, billing reminders, jobs, and runtime-safe deploy flow.</p>
          <a class="docs-card-link" href="/docs/agency-ops">Open ops proof &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Support matrix</p>
          <p class="docs-card-copy">Open the governed registry for proven, partial, planned, and blocked coverage across ecosystem, runtime, and tooling surfaces.</p>
          <a class="docs-card-link" href="/docs/support">Open support matrix &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Docs search</p>
          <p class="docs-card-copy">Search generated references, proof artifacts, support notes, release surfaces, and API documentation from one FastScript-native endpoint.</p>
          <a class="docs-card-link" href="/docs/search">Search docs &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">What v4 proves</p>
          <h2 class="h2">FastScript is now presented as a complete platform.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Ordinary TS in <code class="ic">.fs</code></p>
            <p class="docs-card-copy">Authored TS and JS stay familiar. The platform value comes from the runtime, validation, deploy, and product scaffolding around that code, not from forcing a different coding identity.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Proof-backed platform pillars</p>
            <p class="docs-card-copy">Auth, roles, migrations, seeds, jobs, notifications, admin patterns, tests, observability, and deploy flow are all exercised through FastScript's docs, proof apps, and release gates.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Structured runtime moat</p>
            <p class="docs-card-copy">FastScript still owns its own language and runtime surface, which is part of why the platform can be more controlled for validation, machine reasoning, and future model-training workflows than a generic ecosystem-only stack.</p>
          </div>
        </div>
      </section>
    </section>
  `;
}
