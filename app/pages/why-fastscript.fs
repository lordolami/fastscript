export default function WhyFastScriptPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">For developers</p>
        <h1 class="h1">Why developers choose FastScript.</h1>
        <p class="lead">FastScript gives teams one runtime-native source container for frontend, backend, middleware, jobs, and APIs without asking them to abandon normal JavaScript or TypeScript habits, and it has now proven real full-stack app capability through governed product evidence.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Write normal TS in <code class="ic">.fs</code></p>
          <p class="docs-card-copy">Use standard JS, TS, JSX, and TSX directly in <code class="ic">.fs</code>. FastScript-specific syntax remains optional sugar, not a rewrite requirement.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Frontend + backend in one runtime</p>
          <p class="docs-card-copy">Build pages, API routes, middleware, loaders, jobs, auth, storage, and billing flows in one full-stack runtime instead of wiring together parallel tools.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Keep your ecosystem</p>
          <p class="docs-card-copy">Bring npm packages, mixed JS modules, CommonJS/ESM interop, and existing utility code while you migrate route by route.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Proof-backed speed</p>
          <p class="docs-card-copy">Current public proof shows 2.71KB first-load JS gzip, 702.98ms builds, 17/17 interop passing, and governed ecosystem coverage across Next-style, React, Node, Vue, and npm package patterns. The speed story comes from the runtime and toolchain, not from forcing new coding habits.</p>
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
            <p class="story-cell-copy">Developers write ordinary TS/JS in <code class="ic">.fs</code>, run <code class="ic">fastscript dev</code>, and ship through one quality gate instead of coordinating framework, compiler, router, and deployment glue separately.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Full-stack surface</p>
            <p class="story-cell-copy">The same project can hold UI routes, backend APIs, middleware, state and storage workflows, workers, and deploy adapters. FastScript is not just a template layer; it is the runtime, framework, and language container together.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">What is now proven</p>
            <p class="story-cell-copy">FastScript now proves product-shaped full-stack apps, authenticated dashboard mutations, queue-backed jobs, billing workflows, deploy adapter generation, custom-host runtime handoff, and ordinary TypeScript authoring inside <code class="ic">.fs</code> with rename-only adoption.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Migration path</p>
            <p class="story-cell-copy">Existing codebases can move in incrementally. Keep current TS/JS modules, convert route-by-route, preview diffs first, and rollback safely if a conversion does not meet trust requirements.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Compatibility promise</p>
            <p class="story-cell-copy">If valid JS/TS fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug. The product contract is to evolve with JavaScript and TypeScript, not to make developers fight a separate language identity.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Bring existing code</p>
          <h2 class="h2">Migrate without a rewrite cliff.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Start with dry runs</p>
            <p class="docs-card-copy">Run <code class="ic">npm run migrate -- app --dry-run</code> to inspect rename-only conversion, import rewrites, manifest output, validation, and diff previews before anything changes.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Keep CSS and libraries</p>
            <p class="docs-card-copy">FastScript conversion preserves styles, assets, and existing npm dependencies. You move source files into <code class="ic">.fs</code> without redesigning your app or replacing your whole stack.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Convert frontend + backend together</p>
            <p class="docs-card-copy">Move a page component, its API route, and any shared helper into the same runtime boundary, then keep shipping through the same deploy targets you already use.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Rollback is built in</p>
            <p class="docs-card-copy">Use the conversion manifest, diff preview, and <code class="ic">npm run migrate:rollback</code> if you need to revert the latest conversion cleanly.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Why it is better</p>
          <h2 class="h2">Less stack sprawl. More shipping speed.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">One container, one pipeline</p>
            <p class="docs-card-copy">FastScript removes the overhead of stitching together framework conventions, TS config, router rules, build glue, and deployment adapters as separate systems.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Lighter output</p>
            <p class="docs-card-copy">Current proof-backed reference build ships with a 2.71KB first-load JS gzip budget, which keeps the runtime lean while preserving full-stack features.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Faster feedback loop</p>
            <p class="docs-card-copy">Current build proof reports 702.98ms builds, and the same toolchain also runs diagnostics, interop checks, benchmark discipline, and regression guards.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Safer in the AI era</p>
            <p class="docs-card-copy">Stricter diagnostics, parity proofs, and one quality gate make FastScript a better place to verify generated code instead of hoping stacked tools agree after the fact.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Compatibility lane</p>
          <h2 class="h2">Request missing syntax or framework edge cases.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Report compatibility gaps</p>
            <p class="docs-card-copy">Use the dedicated compatibility issue flow when valid JS/TS, framework usage, or migration cases do not work in <code class="ic">.fs</code>.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Open compatibility issue &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">What to include</p>
            <p class="docs-card-copy">Share the original source snippet, expected behavior, framework/runtime context, reproduction steps, and whether the issue appears during parse, build, typecheck, or deploy.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Discuss edge cases</p>
            <p class="docs-card-copy">Use GitHub Discussions for early migration blockers, adoption questions, or ecosystem edge cases that need design discussion before implementation.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Open discussions &#8594;</a>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">What comes next</p>
          <h2 class="h2">The next developer wave.</h2>
        </header>
        <div class="story-grid">
          <div class="story-cell">
            <p class="story-cell-title">AI coding assistant</p>
            <p class="story-cell-copy">FastScript is building a coding assistant on top of the main language/runtime, with emphasis on stronger accuracy, faster codebase deciphering, and full-stack execution discipline.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">Broader compatibility matrix</p>
            <p class="story-cell-copy">The v3 contract expands by adding more JS/TS syntax cases, framework patterns, route shapes, shared modules, and runtime surfaces as permanent proof-backed compatibility lanes published in the support matrix.</p>
          </div>
          <div class="story-cell">
            <p class="story-cell-title">More targets</p>
            <p class="story-cell-copy">Mobile, desktop, edge improvements, and shared-library output all continue the same goal: one runtime-native container across more development surfaces.</p>
          </div>
        </div>
      </section>
    </section>
  `;
}
