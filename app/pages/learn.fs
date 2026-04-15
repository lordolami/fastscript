const STEPS = [{
  n: "01",
  title: "Install FastScript",
  copy: "Install the public CLI directly from npm. For core development on FastScript itself, the repo workflow still works too. Node 20+.",
  cmd: "npm install -g fastscript\nfastscript --help"
}, {
  n: "02",
  title: "Create a project",
  copy: "Bootstrap with pages, APIs, DB migrations, middleware, and the new styling primitives already wired.",
  cmd: "fastscript create my-startup"
}, {
  n: "03",
  title: "Run local development",
  copy: "Start the dev runtime with HMR, route hydration, diagnostics overlay, and middleware execution.",
  cmd: "cd my-startup\nfastscript dev"
}, {
  n: "04",
  title: "Add product logic",
  copy: "Build route loaders, API handlers, queue workers, storage workflows, and UI primitives in .fs. FastScript works as both frontend and backend in one runtime, with one context model.",
  cmd: "app/pages/*.fs\napp/api/*.fs\napp/db/migrations/*.fs\n<Stack> <Row> <Text> <Button>"
}, {
  n: "05",
  title: "Quality gate + deploy",
  copy: "One command runs the full health check - lint, typecheck, tests, smoke, benchmarks. Then generate a deploy adapter.",
  cmd: "npm run qa:all\nfastscript deploy --target cloudflare"
}];
const NEXT = [{
  title: "Route + loader contracts",
  copy: "Use inferred route param and loader data types to remove runtime guesswork on every page.",
  href: "/docs/v3",
  cta: "Read v3 docs"
}, {
  title: "Styling primitives",
  copy: "Use Box, Stack, Row, Heading, Text, Button, and token-backed semantic props instead of raw CSS trivia.",
  href: "/docs/primitives",
  cta: "Open primitive guide"
}, {
  title: "Interop expansion",
  copy: "Bring existing npm packages and ecosystem APIs while keeping .fs as your app source of truth and the support matrix as your proof-backed compatibility guide.",
  href: "/docs/interop",
  cta: "View interop guide"
}, {
  title: "Production adapters",
  copy: "Generate hardened Node, Vercel, and Cloudflare outputs with default cache, security, and routing policies.",
  href: "/docs/latest",
  cta: "Open deploy guide"
}, {
  title: "Real-world adoption",
  copy: "Use the canonical production path for greenfield apps and incremental TS/JS migration, with the support matrix as the contract before you promise a runtime or framework shape.",
  href: "/docs/adoption",
  cta: "Open adoption flow"
}, {
  title: "Why FastScript",
  copy: "Get the full developer story: why FastScript is better, how migration works, how to ship TS in .fs, and how to request missing edge cases.",
  href: "/why-fastscript",
  cta: "Read adoption guide"
}];
export default function LearnPage() {
  const steps = STEPS.map(s => `
    <div class="step">
      <div class="step-num">${s.n}</div>
      <div class="step-body">
        <p class="step-title">${s.title}</p>
        <p class="step-copy">${s.copy}</p>
        <code class="step-cmd">${s.cmd}</code>
      </div>
    </div>
  `).join("");
  const next = NEXT.map(n => `
    <div class="docs-card">
      <p class="docs-card-title">${n.title}</p>
      <p class="docs-card-copy">${n.copy}</p>
      <a class="docs-card-link" href="${n.href}">${n.cta} &#8594;</a>
    </div>
  `).join("");
  return `
    <section class="learn-page">
      <header class="sec-header">
        <p class="kicker">Quickstart</p>
        <h1 class="h1">From zero to live deployment in one flow.</h1>
        <p class="lead">Shortest path to production with normal JS/TS-in-.fs authoring, hard QA gates, proof-backed speed, and a governed compatibility matrix from day one.</p>
      </header>

      <div class="steps">${steps}</div>
    </section>

    <hr class="section-divider">

    <section class="learn-next">
      <header class="sec-header-sm">
        <p class="kicker">Next steps</p>
        <h2 class="h2">After quickstart, deepen the stack.</h2>
      </header>

      <div class="docs-card-grid">${next}</div>
    </section>

    <hr class="section-divider">

    <section class="learn-next">
      <header class="sec-header-sm">
        <p class="kicker">Bring existing code</p>
        <h2 class="h2">Move existing TS/JS into FastScript safely.</h2>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Preview conversion first</p>
          <p class="docs-card-copy">Use <code class="ic">npm run migrate -- app --dry-run</code> to inspect rename-only conversion, diff preview, validation, and manifest output before changing source files.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Keep frontend + backend together</p>
          <p class="docs-card-copy">Move existing pages, API routes, middleware, and shared helpers into <code class="ic">.fs</code> incrementally while preserving the same app boundary.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Keep your libraries</p>
          <p class="docs-card-copy">Preserve npm packages, CSS, assets, and ecosystem code while you migrate route-by-route instead of rewriting your stack around the runtime.</p>
        </div>
      </div>
    </section>

    <hr class="section-divider">

    <div class="cta-block">
      <h2 class="cta-title">Ready to ship?</h2>
      <p class="cta-copy">Everything you need is in the runtime and toolchain. Keep familiar JS/TS habits, get a faster pipeline, avoid the parallel stack maze, and use the compatibility lane if your migration hits a real edge case.</p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="/docs">Open the docs</a>
        <a class="btn btn-secondary btn-lg" href="/docs/adoption">Real-world adoption</a>
        <a class="btn btn-ghost btn-lg" href="/examples">Browse examples</a>
      </div>
    </div>
  `;
}
