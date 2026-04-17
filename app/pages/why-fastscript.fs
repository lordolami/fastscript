export default function WhyFastScriptPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">For developers</p>
        <h1 class="h1">Why developers choose FastScript v4.1.</h1>
        <p class="lead">FastScript v4.1 gives teams one runtime-native source surface for frontend, backend, middleware, jobs, data flows, security readiness, and deploy output without asking them to abandon ordinary JavaScript or TypeScript habits.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Write normal TS in <code class="ic">.fs</code></p>
          <p class="docs-card-copy">Use standard JS, TS, JSX, and TSX directly in <code class="ic">.fs</code>. FastScript-specific syntax remains optional sugar, not a rewrite requirement.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">One full-stack runtime</p>
          <p class="docs-card-copy">Build pages, APIs, middleware, loaders, jobs, auth, storage, migrations, and billing flows in one platform instead of wiring together parallel tools.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Keep your ecosystem</p>
          <p class="docs-card-copy">Bring npm packages, mixed JS modules, CommonJS and ESM interop, and existing utility code while you migrate route by route.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Proof-backed release discipline</p>
          <p class="docs-card-copy">The public story stays tied to measured proof: interop coverage, support matrix generation, release gates, reference apps, and build artifacts.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Integrated trust model</p>
          <p class="docs-card-copy">FastScript now makes runtime scopes, secure policy files, secret-exposure checks, and security-readiness reporting part of the platform itself instead of external cleanup work.</p>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">How it works</p>
          <h2 class="h2">Use FastScript without giving up your workflow.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">Day-to-day authoring</p>
            <p class="story-cell-copy">Developers write ordinary TS and JS in <code class="ic">.fs</code>, run <code class="ic">fastscript dev</code>, and ship through one quality gate instead of coordinating separate framework, router, queue, and deployment layers.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Complete platform surface</p>
            <p class="story-cell-copy">The same project can hold UI routes, backend APIs, middleware, state and storage workflows, workers, migrations, seeds, and deploy adapters. FastScript is language surface, framework, runtime, and toolchain together.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">What is now proven</p>
            <p class="story-cell-copy">FastScript proves product-shaped full-stack apps, authenticated dashboard mutations, queue-backed jobs, billing workflows, deploy adapter generation, custom-host runtime handoff, and ordinary TypeScript authoring inside <code class="ic">.fs</code>.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Migration path</p>
            <p class="story-cell-copy">Existing codebases can move in incrementally. Keep current TS and JS modules, convert route by route, preview diffs first, and rollback safely if a conversion does not meet trust requirements.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Compatibility promise</p>
            <p class="story-cell-copy">If valid JS or TS fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug. The platform contract is to evolve with TypeScript teams, not to make them fight a separate language identity.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Machine reasoning advantage</p>
          <h2 class="h2">FastScript is familiar for humans and structured for machines.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Ordinary authoring stays intact</p>
            <p class="docs-card-copy">FastScript does not ask teams to stop writing TypeScript. That is the human-facing contract.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Runtime stays owned</p>
            <p class="docs-card-copy">FastScript still owns its language and runtime layer, which lets the platform stay simpler for validation, compiler control, and future model-training loops.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Validation is built in</p>
            <p class="docs-card-copy">The same structured surface that keeps the runtime coherent also helps diagnostics, release proof, and machine-readable repair workflows stay first-class.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Security dimension</p>
          <h2 class="h2">FastScript is not a stack pile held together by hope.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">Stack-sprawl security is fragile</p>
            <p class="story-cell-copy">When auth, deploy, middleware, webhook handling, and runtime boundaries all live in different systems, security becomes coordination debt instead of a platform property.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">FastScript keeps the boundaries owned</p>
            <p class="story-cell-copy">Runtime scopes, explicit permissions policy, CSRF/session protections, and security-readiness validation now live inside the same system that builds and deploys the app.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Validator-backed trust beats obscurity</p>
            <p class="story-cell-copy">FastScript is safer because dangerous mistakes become visible earlier, not because the platform hopes attackers are confused by hidden conventions.</p>
          </div>
        </div>
      </section>
    </section>
  `;
}
