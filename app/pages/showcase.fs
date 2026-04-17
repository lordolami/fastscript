export default function Showcase() {
  return `
    <section class="showcase-page">
      <header class="sec-header">
        <p class="kicker">Showcase</p>
        <h1 class="h1">Proof apps and production-shaped references.</h1>
        <p class="lead">FastScript v4 shows its platform story through visible product shapes: a greenfield SaaS baseline, an operations proving ground, the public website itself, and smaller platform patterns that demonstrate the full-stack contract in practice.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Team Dashboard SaaS</p>
          <p class="docs-card-copy">The canonical greenfield reference app proving auth, teams, billing, notifications, admin, tests, and deploy flow.</p>
          <a class="docs-card-link" href="/docs/team-dashboard-saas">Open SaaS proof &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Agency Ops</p>
          <p class="docs-card-copy">The canonical operational proving-ground app showing ordinary TypeScript inside <code class="ic">.fs</code> with jobs, billing reminders, and Cloudflare-ready deployment.</p>
          <a class="docs-card-link" href="/docs/agency-ops">Open ops proof &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">FastScript website</p>
          <p class="docs-card-copy">The site you are viewing proves routing, docs search, SSR, learning surfaces, blog routes, and release storytelling on FastScript itself.</p>
          <a class="docs-card-link" href="/docs">Open docs &#8594;</a>
        </div>
      </div>
    </section>
  `;
}
