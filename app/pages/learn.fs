const STEPS = [{
  n: "01",
  title: "Install FastScript",
  copy: "Clone the repo, install dependencies, and optionally link the CLI globally from your local checkout. Works on Node 20+.",
  cmd: "git clone https://github.com/lordolami/fastscript.git\ncd fastscript\nnpm install\nnpm link"
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
  copy: "Build route loaders, API handlers, queue workers, storage workflows, and UI primitives in .fs. Everything shares one context object.",
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
  href: "/docs/v2",
  cta: "Read v2.0 spec"
}, {
  title: "Styling primitives",
  copy: "Use Box, Stack, Row, Heading, Text, Button, and token-backed semantic props instead of raw CSS trivia.",
  href: "/docs/primitives",
  cta: "Open primitive guide"
}, {
  title: "Interop expansion",
  copy: "Bring existing npm packages and ecosystem APIs while keeping .fs as your app source of truth.",
  href: "/docs/interop",
  cta: "View interop guide"
}, {
  title: "Production adapters",
  copy: "Generate hardened Node, Vercel, and Cloudflare outputs with default cache, security, and routing policies.",
  href: "/docs/latest",
  cta: "Open deploy guide"
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
        <p class="lead">Shortest path to production with hard QA gates enabled from day one.</p>
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

    <div class="cta-block">
      <h2 class="cta-title">Ready to ship?</h2>
      <p class="cta-copy">Everything you need is in the language runtime. No parallel stack maze, no plugin hunting, no configuration sprawl.</p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="/docs">Open the docs</a>
        <a class="btn btn-ghost btn-lg" href="/examples">Browse examples</a>
      </div>
    </div>
  `;
}
