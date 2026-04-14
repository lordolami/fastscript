const STEPS = [{
  title: "Install FastScript",
  copy: "Install the compiler globally once, then use the same CLI for app creation, validation, and deploy adapters.",
  code: "npm install -g fastscript-lang"
}, {
  title: "Create a project",
  copy: "Bootstrap with pages, APIs, migrations, middleware, and docs routing pre-wired.",
  code: "fastscript create my-startup"
}, {
  title: "Run local development",
  copy: "Start the dev runtime with route hydration, diagnostics overlay, and middleware execution.",
  code: "cd my-startup\nfastscript dev"
}, {
  title: "Add product logic",
  copy: "Build route loaders, API handlers, queue workers, and storage workflows using one .fs language.",
  code: "app/pages/*.fs\napp/api/*.fs\napp/jobs/*.fs"
}, {
  title: "Quality gate + deploy",
  copy: "Run one command for full health checks, then generate your target platform adapter.",
  code: "npm run qa:all\nfastscript deploy --target cloudflare"
}];
export default function LearnPage() {
  const timeline = STEPS.map(step => `
    <article class="timeline-step">
      <span class="timeline-dot"></span>
      <div class="timeline-content">
        <h3 class="timeline-title">${step.title}</h3>
        <p class="timeline-copy">${step.copy}</p>
        <pre class="timeline-code">${step.code}</pre>
      </div>
    </article>
  `).join("");
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Quickstart</p>
        <h1 class="section-title">From zero to live deployment in one FastScript flow.</h1>
        <p class="section-copy">This path is tuned for startup shipping speed: shortest route to production, with hard quality gates enabled from day one.</p>
      </header>

      <div class="timeline">${timeline}</div>
    </section>

    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Next steps</p>
        <h2 class="section-title">After quickstart, deepen the stack.</h2>
      </header>
      <div class="docs-grid">
        <article class="docs-card">
          <h3 class="docs-title">Route + loader contracts</h3>
          <p class="docs-copy">Use inferred route param and loader data types to remove runtime guesswork.</p>
          <a class="docs-arrow" href="/docs/v1.1">Read routing deep dive -></a>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Interop expansion</h3>
          <p class="docs-copy">Bring existing npm packages and framework APIs while keeping .fs as your app source.</p>
          <a class="docs-arrow" href="/benchmarks">View interop matrix -></a>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Production adapters</h3>
          <p class="docs-copy">Generate Vercel, Cloudflare, or Node outputs with hardened defaults and caching behavior.</p>
          <a class="docs-arrow" href="/docs/latest">Open deploy guide -></a>
        </article>
      </div>
    </section>
  `;
}
