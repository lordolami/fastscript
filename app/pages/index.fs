export default function Home() {
  return `
    <section class="hero">
      <div class="shell hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge-dot" aria-hidden="true"></span>
            v3.0 &mdash; <a href="/changelog" class="hero-badge-link">See what&rsquo;s new</a>
          </div>

          <h1 class="hero-title">
            The universal JS/TS<br>
            <span class="hero-title-muted">runtime container.</span>
          </h1>

          <p class="hero-desc">
            Write normal <code class="ic">js</code>, <code class="ic">ts</code>, <code class="ic">jsx</code>, or <code class="ic">tsx</code> in <code class="ic">.fs</code>,
            keep full package compatibility, compile to optimized JavaScript, and ship frontend, backend, jobs, and APIs through one runtime pipeline.
            FastScript-specific syntax is optional. The current proof pack shows 2.71KB first-load gzip, 702.98ms builds, 17/17 interop passing, and governed ecosystem proof across Next-style, React, Node, Vue, and npm package patterns.
            The main language/runtime stays proprietary and source-available so the platform can compound into the next FastScript AI products.
          </p>

          <div class="install-row">
            <span class="install-row-prefix">$</span>
            <span class="install-row-cmd" id="install-cmd">npm install -g fastscript</span>
            <button class="copy-btn" data-copy="npm install -g fastscript" aria-label="Copy install command">
              &#9112; Copy
            </button>
          </div>

          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="/learn">Get Started</a>
            <a class="btn btn-secondary btn-lg" href="/why-fastscript">Why FastScript</a>
          </div>
        </div>

        <div class="hero-right" aria-hidden="true">
          <div class="hero-scene" data-home-3d>
            <div class="hero-scene-glow hero-scene-glow-a" data-depth="-16"></div>
            <div class="hero-scene-glow hero-scene-glow-b" data-depth="-10"></div>
            <div class="hero-depth-plane hero-depth-plane-grid" data-depth="-22"></div>
            <div class="hero-depth-plane hero-depth-plane-rings" data-depth="-12"></div>

            <div class="hero-proof-orbit hero-proof-orbit-a" data-depth="14">
              <span class="hero-proof-kicker">Proof</span>
              <span class="hero-proof-value">2.71KB</span>
              <span class="hero-proof-copy">First-load gzip</span>
            </div>

            <div class="hero-proof-orbit hero-proof-orbit-b" data-depth="18">
              <span class="hero-proof-kicker">Interop</span>
              <span class="hero-proof-value">17/17</span>
              <span class="hero-proof-copy">Contract passing</span>
            </div>

            <div class="hero-proof-orbit hero-proof-orbit-c" data-depth="20">
              <span class="hero-proof-kicker">Build</span>
              <span class="hero-proof-value">702.98ms</span>
              <span class="hero-proof-copy">Proof-backed loop</span>
            </div>

            <div class="hero-visual hero-visual-main" data-depth="28" data-tilt-card>
              <div class="hero-visual-reflection"></div>
              <div class="terminal-bar">
                <span class="terminal-dot-r"></span>
                <span class="terminal-dot-y"></span>
                <span class="terminal-dot-g"></span>
                <span class="terminal-title">fastscript deploy --target cloudflare</span>
              </div>
              <div class="terminal-body">
                <span class="t-prompt">$ </span><span class="t-cmd">fastscript create my-app</span><br>
                <span class="t-out">&nbsp; &#10003; scaffolded in 0.4s</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cmd">npm run qa:all</span><br>
                <span class="t-out">&nbsp; &#10003; lint &middot; types &middot; tests &middot; bench</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cmd">fastscript deploy --target cloudflare</span><br>
                <span class="t-success">&nbsp; &#10003; ready &rarr; workers.dev (~19ms)</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cursor"></span>
              </div>
            </div>

            <div class="hero-side-stack" data-depth="22">
              <div class="hero-stack-card hero-stack-card-primary">
                <span class="hero-stack-label">Runtime</span>
                <strong class="hero-stack-title">Frontend + backend + jobs</strong>
                <span class="hero-stack-copy">One runtime pipeline. No split-brain stack.</span>
              </div>
              <div class="hero-stack-card hero-stack-card-secondary">
                <span class="hero-stack-label">Targets</span>
                <strong class="hero-stack-title">Node / Vercel / Workers</strong>
                <span class="hero-stack-copy">Generate hardened adapters from one codebase.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shell">
        <div class="social-strip">
          <div class="social-item">
            <span aria-hidden="true">&#11088;</span>
            <span class="social-item-n">GitHub</span>
            <span>developer momentum</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128230;</span>
            <span class="social-item-n">CLI</span>
            <span>npm-first install</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128101;</span>
            <span class="social-item-n">Contributors</span>
            <span>community-led</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128204;</span>
            <span class="social-item-n">v3.0</span>
            <span>current public line</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128275;</span>
            <span class="social-item-n">Protected</span>
            <span>source-available, AI-training restricted</span>
          </div>
        </div>
      </div>

      <div class="shell">
        <div class="hero-stats" role="list">
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">2.71<span class="hero-stat-n-sub">KB</span></span>
            <span class="hero-stat-l">First-load gzip</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">&lt;1<span class="hero-stat-n-sub">s</span></span>
            <span class="hero-stat-l">Build time</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">17<span class="hero-stat-n-sub">/17</span></span>
            <span class="hero-stat-l">Interop tests</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">3</span>
            <span class="hero-stat-l">Deploy targets</span>
          </div>
        </div>
      </div>
    </section>

    <div class="ticker-strip" aria-hidden="true">
      <div class="ticker-track">
        <span class="ticker-item">FastScript</span>
        <span class="ticker-item">Universal JS/TS container</span>
        <span class="ticker-item">Node &middot; Vercel &middot; Cloudflare</span>
        <span class="ticker-item">No stack lock-in</span>
        <span class="ticker-item">17/17 interop</span>
        <span class="ticker-item">2.71KB first-load gzip</span>
        <span class="ticker-item">Proof-backed speed</span>
        <span class="ticker-item">FastScript</span>
        <span class="ticker-item">Universal JS/TS container</span>
        <span class="ticker-item">Node &middot; Vercel &middot; Cloudflare</span>
        <span class="ticker-item">No stack lock-in</span>
        <span class="ticker-item">17/17 interop</span>
        <span class="ticker-item">2.71KB first-load gzip</span>
        <span class="ticker-item">Proof-backed speed</span>
      </div>
    </div>

    <section class="home-how">
      <header class="sec-header reveal">
        <p class="kicker">How it works</p>
        <h2 class="h2">Three steps from idea to production.</h2>
        <p class="lead">Use FastScript as one frontend + backend runtime, keep normal TS/JS authoring habits, and ship through one toolchain instead of managing a parallel stack.</p>
      </header>
      <div class="how-grid reveal-children">
        <div class="how-cell">
          <p class="how-num">01 &mdash; Write</p>
          <p class="how-title">Author in .fs</p>
          <p class="how-copy">Write normal JS, TS, JSX, or TSX directly in <code class="ic">.fs</code>. FastScript-specific forms like <code class="ic">fn</code>, <code class="ic">state</code>, and <code class="ic">~</code> remain optional sugar.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 &mdash; Verify</p>
          <p class="how-title">Run the QA gate</p>
          <p class="how-copy"><code class="ic">npm run qa:all</code> runs format check, lint, typecheck, full test suite, smoke test, benchmarks, interop report, and proof publish in one command. All must pass before you ship.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 &mdash; Deploy</p>
          <p class="how-title">Ship to your target</p>
          <p class="how-copy"><code class="ic">fastscript deploy --target cloudflare</code> (or <code class="ic">node</code>, <code class="ic">vercel</code>) generates a hardened adapter and deploys. No per-platform config. One codebase, three outputs.</p>
        </div>
      </div>
      <div class="action-row">
        <a class="btn btn-ghost btn-lg" href="/why-fastscript">See the developer story</a>
      </div>
    </section>

    <section class="home-split reveal">
      <div class="split-section">
        <div class="split-cell">
          <p class="kicker">Developer experience</p>
          <h2 class="h2 split-h2">Write once.<br>Ship anywhere.</h2>
          <p class="body-copy split-copy">One runtime-native container. One proof-backed toolchain. No frontend/backend split brain, no adapter sprawl, no extra authored language tax. FastScript compiles <code class="ic">.fs</code> to hardened JS and generates deploy adapters per target.</p>
          <div class="terminal">
            <div class="terminal-bar">
              <span class="terminal-dot-r"></span><span class="terminal-dot-y"></span><span class="terminal-dot-g"></span>
              <span class="terminal-title">terminal</span>
            </div>
            <div class="terminal-body">
              <span class="t-prompt">$ </span><span class="t-cmd">fastscript create my-app</span><br>
              <span class="t-out">&nbsp; &#10003; scaffolded 16 routes, 5 API handlers</span><br>
              <span class="t-prompt">$ </span><span class="t-cmd">fastscript deploy --target vercel</span><br>
              <span class="t-success">&nbsp; &#10003; ready &rarr; production (~19ms startup)</span><br>
              <span class="t-prompt">$ </span><span class="t-cursor"></span>
            </div>
          </div>
        </div>
        <div class="split-cell">
          <p class="kicker">Language syntax</p>
          <h2 class="h2 split-h2">Familiar syntax.<br>New power.</h2>
          <p class="body-copy split-copy"><code class="ic">.fs</code> is a universal JS/TS container for the FastScript runtime. Use standard JS/TS authoring directly, then opt into FastScript sugar only when you want it. Full npm ecosystem compatibility stays intact.</p>
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">app/pages/product/[slug].fs</span>
              <span class="code-block-lang">.fs</span>
            </div>
            <div class="code-block-body"><span class="code-kw">type</span> Product = { name: <span class="code-kw">string</span> }

<span class="code-kw">export</span> <span class="code-kw">async</span> <span class="code-kw">function</span> <span class="code-fn">load</span>(ctx): <span class="code-kw">Promise</span>&lt;{ product: Product }&gt; {
  <span class="code-kw">const</span> product = <span class="code-kw">await</span> ctx.db.get(
    <span class="code-str">"products"</span>, ctx.params.slug
  )
  <span class="code-kw">return</span> { product }
}

<span class="code-kw">export</span> <span class="code-kw">default</span> <span class="code-kw">function</span> <span class="code-fn">Page</span>({ product }: { product: Product }) {
  <span class="code-kw">return</span> <span class="code-str">\`&lt;h1&gt;\${product.name}&lt;/h1&gt;\`</span>
}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-features">
      <header class="sec-header reveal">
        <p class="kicker">Platform capabilities</p>
        <h2 class="h2">Everything you need. Nothing you don&rsquo;t.</h2>
      </header>
      <div class="feature-grid reveal-children">
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#9889;</div>
          <p class="feature-title">File-based routing</p>
          <p class="feature-copy">Priority-scored dynamic routing with typed params, catch-all segments, layouts, and parallel route slots.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128274;</div>
          <p class="feature-title">Auth + sessions</p>
          <p class="feature-copy">Session manager, cookie policies, OAuth providers, rotation, and audit log built into every request context.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128451;</div>
          <p class="feature-title">DB + storage</p>
          <p class="feature-copy">File-based or Postgres driver, S3-compatible storage, tenant scoping, and migration runner via <code class="ic">ctx.db</code>.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128260;</div>
          <p class="feature-title">Job queue + workers</p>
          <p class="feature-copy">Distributed job queue with dead-letter replay, scheduler, retention sweep, and webhook delivery included.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128640;</div>
          <p class="feature-title">SSR + ISR + Streaming</p>
          <p class="feature-copy">Server-side render, incremental static regen with cache tags, and streaming response switchable per route.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#129169;</div>
          <p class="feature-title">Plugin hooks</p>
          <p class="feature-copy">Build start/end, request start/end hooks. Composable middleware pipeline with security headers and rate limiting.</p>
        </div>
      </div>
    </section>

    <section class="home-story reveal">
      <header class="sec-header">
        <p class="kicker">Brand story</p>
        <h2 class="h2">Why FastScript exists.</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell">
          <p class="story-cell-title">The problem</p>
          <p class="story-cell-copy">Modern JavaScript stacks force teams to stitch together separate frontend, backend, worker, and deployment stories. The result is slower builds, heavier payloads, and too much time spent reconciling tools instead of shipping product.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">The insight</p>
          <p class="story-cell-copy">The better move is not another framework shell or stranger DSL. It is keeping normal JS/TS authoring, putting it in one runtime-native container, and letting the compiler, runtime, and toolchain create the speed advantage.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">The approach</p>
          <p class="story-cell-copy">Compile-first and proof-backed: every <code class="ic">.fs</code> file goes through strict validation, parity checks, benchmarks, and proof-pack publishing before release. The speed story is earned by the toolchain, not by demanding a new coding identity.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">The promise</p>
          <p class="story-cell-copy">FastScript v3 treats valid JS/TS in <code class="ic">.fs</code> as first-class source. If valid JS/TS fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug. You keep your code style, keep the npm ecosystem, and get a governed support matrix that shows which framework and module patterns are already proven.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">The moat</p>
          <p class="story-cell-copy">FastScript keeps the main language/runtime proprietary and source-available. The public repo is open for adoption and evaluation, but not for training competing AI coding systems or cloning the platform moat that powers the next generation of FastScript tooling.</p>
        </div>
      </div>
    </section>

    <section class="home-bento">
      <header class="sec-header reveal">
        <p class="kicker">Proof by numbers</p>
        <h2 class="h2">Built to ship. Measured to prove it.</h2>
      </header>
      <div class="bento reveal">
        <div class="bento-cell bento-quarter">
          <p class="bento-label">Client runtime</p>
          <p class="bento-num">2.71<span class="bento-num-sub">KB</span></p>
          <p class="bento-copy">Current proof-backed first-load JS gzip. React-style baseline is 142KB.</p>
        </div>
        <div class="bento-cell bento-quarter">
          <p class="bento-label">Build time</p>
          <p class="bento-num">&lt;1<span class="bento-num-sub">s</span></p>
          <p class="bento-copy">Warm build for this full website project.</p>
        </div>
        <div class="bento-cell bento-quarter">
          <p class="bento-label">Interop matrix</p>
          <p class="bento-num">17<span class="bento-num-sub">/17</span></p>
          <p class="bento-copy">ESM, CJS, framework, and package combinations passing.</p>
        </div>
        <div class="bento-cell bento-quarter">
          <p class="bento-label">Cloudflare startup</p>
          <p class="bento-num">~19<span class="bento-num-sub">ms</span></p>
          <p class="bento-copy">Cold start on Cloudflare Workers.</p>
        </div>
        <div class="bento-cell bento-half bento-bt">
          <p class="bento-label">Quality gate</p>
          <p class="bento-title-lg">One command. Full proof.</p>
          <p class="bento-copy">npm run qa:all runs format check, lint, typecheck, docs index, full test suite, smoke dev + start, benchmarks, interop report, proof publish, and backup verification in sequence.</p>
        </div>
        <div class="bento-cell bento-half bento-bt">
          <p class="bento-label">Deploy adapters</p>
          <p class="bento-title-lg">Write once, generate three adapters.</p>
          <p class="bento-copy">Node, Vercel, and Cloudflare Workers outputs from one codebase. No per-platform logic branches.</p>
          <div class="tag-row">
            <span class="tag">Node.js</span>
            <span class="tag">Vercel</span>
            <span class="tag">Cloudflare Workers</span>
          </div>
        </div>
      </div>
    </section>

    <section class="home-ai reveal">
      <header class="sec-header">
        <p class="kicker">AI-generated code</p>
        <h2 class="h2">Built for the AI coding era.</h2>
      </header>
      <div class="split-section">
        <div class="split-cell">
          <p class="body-copy split-copy">AI code generators produce volume. FastScript provides the verification layer. The compiler&rsquo;s strict diagnostic pass catches hallucination patterns &mdash; undefined references, type mismatches, unreachable code, bad import shapes &mdash; before they hit production.</p>
          <p class="body-copy split-copy">The same language/runtime foundation also powers what comes next: a FastScript AI coding assistant optimized for accuracy, deciphering speed, and full-stack context. The protected core exists so that advantage compounds instead of leaking out into generic tooling.</p>
          <div class="tag-row">
            <span class="tag">Strict diagnostics</span>
            <span class="tag">Compile-time proof</span>
            <span class="tag">Zero runtime surprises</span>
          </div>
        </div>
        <div class="split-cell">
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">fs-diagnostics output</span>
              <span class="code-block-lang">AI mode</span>
            </div>
            <div class="code-block-body"><span class="t-out">Checking app/pages/products.fs...</span>
<span class="t-success">  &#10003; imports resolved (3/3)</span>
<span class="t-success">  &#10003; fn signatures validated</span>
<span class="t-success">  &#10003; ctx.db calls type-safe</span>
<span class="t-success">  &#10003; no unreachable returns</span>
<span class="t-success">  &#10003; auth guards in place</span>
<span class="t-out"></span>
<span class="t-success">All checks passed. Safe to deploy.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-compare reveal">
      <header class="sec-header">
        <p class="kicker">Why FastScript</p>
        <h2 class="h2">Less stack, more product.</h2>
      </header>
      <div class="compare-table compare-table-4">
        <div class="compare-header">
          <div class="compare-col-head">Feature</div>
          <div class="compare-col-head is-ours">FastScript</div>
          <div class="compare-col-head">Next.js</div>
          <div class="compare-col-head">Remix</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Universal JS/TS container</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> <code class="ic">.fs</code> first-class</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> separate app shell</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> separate app shell</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Client runtime size</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> 2.71 KB gzip</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> 89 KB+</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> ~40 KB+</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Build speed</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> &lt;1s warm</div>
          <div class="compare-cell"><span class="partial">~</span> 5&ndash;18s</div>
          <div class="compare-cell"><span class="partial">~</span> 3&ndash;10s</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Auth + session built-in</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Included</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Bring your own</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Bring your own</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Job queue + workers</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Included</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> External service</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> External service</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Multi-target deploy</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Node/Vercel/CF</div>
          <div class="compare-cell"><span class="partial">~</span> Vercel-first</div>
          <div class="compare-cell"><span class="partial">~</span> Adapter plugins</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">AI reliability mode</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Built-in</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Not available</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Not available</div>
        </div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Build once in .fs. Ship anywhere.</h2>
        <p class="cta-copy">FastScript keeps the JavaScript ecosystem while cutting stack sprawl, payload weight, and build drag. Use <code class="ic">.fs</code> as your source of truth, keep package compatibility, and build on the same protected runtime foundation that powers the next FastScript AI products.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/learn">Start in 15 minutes</a>
          <a class="btn btn-secondary btn-lg" href="/why-fastscript">Why developers choose FastScript</a>
          <a class="btn btn-secondary btn-lg" href="/examples">Browse examples</a>
          <a class="btn btn-ghost btn-lg" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub &rarr;</a>
        </div>
      </div>
    </section>
  `;
}
