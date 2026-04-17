export default function Home() {
  return `
    <section class="hero">
      <div class="shell hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge-dot" aria-hidden="true"></span>
            v4.0.1 - <a href="/changelog" class="hero-badge-link">complete TypeScript platform release</a>
          </div>

          <h1 class="hero-title">
            Complete full-stack<br>
            <span class="hero-title-muted">TypeScript platform.</span>
          </h1>

          <p class="hero-desc">
            Write ordinary <code class="ic">js</code>, <code class="ic">ts</code>, <code class="ic">jsx</code>, and <code class="ic">tsx</code> in <code class="ic">.fs</code>, then ship pages, APIs, middleware, jobs, migrations, and deploy adapters through one calm FastScript pipeline.
          </p>

          <div class="install-row">
            <span class="install-row-prefix">$</span>
            <span class="install-row-cmd" id="install-cmd">npm install -g fastscript</span>
            <button class="copy-btn" data-copy="npm install -g fastscript" aria-label="Copy install command">
              &#9112; Copy
            </button>
          </div>

          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="/learn">Start learning</a>
            <a class="btn btn-secondary btn-lg" href="/docs/latest">Read the v4 docs</a>
          </div>
        </div>

        <div class="hero-right" aria-hidden="true">
          <div class="hero-scene" data-home-3d>
            <div class="hero-scene-glow hero-scene-glow-a" data-depth="-16"></div>
            <div class="hero-scene-glow hero-scene-glow-b" data-depth="-10"></div>
            <div class="hero-depth-plane hero-depth-plane-grid" data-depth="-22"></div>
            <div class="hero-depth-plane hero-depth-plane-rings" data-depth="-12"></div>

            <div class="hero-proof-orbit hero-proof-orbit-a" data-depth="14">
              <span class="hero-proof-kicker">Proof apps</span>
              <span class="hero-proof-value">2</span>
              <span class="hero-proof-copy">Canonical references</span>
            </div>

            <div class="hero-proof-orbit hero-proof-orbit-b" data-depth="18">
              <span class="hero-proof-kicker">Interop</span>
              <span class="hero-proof-value">17/17</span>
              <span class="hero-proof-copy">Contract passing</span>
            </div>

            <div class="hero-proof-orbit hero-proof-orbit-c" data-depth="20">
              <span class="hero-proof-kicker">Build</span>
              <span class="hero-proof-value">&lt;1s</span>
              <span class="hero-proof-copy">Proof-backed loop</span>
            </div>

            <div class="hero-visual hero-visual-main" data-depth="28" data-tilt-card>
              <div class="hero-visual-reflection"></div>
              <div class="terminal-bar">
                <span class="terminal-dot-r"></span>
                <span class="terminal-dot-y"></span>
                <span class="terminal-dot-g"></span>
                <span class="terminal-title">fastscript qa + deploy</span>
              </div>
              <div class="terminal-body">
                <span class="t-prompt">$ </span><span class="t-cmd">fastscript create startup-mvp --template startup-mvp</span><br>
                <span class="t-out">&nbsp; &#10003; greenfield SaaS proof app scaffolded</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cmd">npm run qa:all</span><br>
                <span class="t-out">&nbsp; &#10003; format · lint · types · tests · proof</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cmd">fastscript deploy --target cloudflare</span><br>
                <span class="t-success">&nbsp; &#10003; complete platform output ready</span><br>
                <br>
                <span class="t-prompt">$ </span><span class="t-cursor"></span>
              </div>
            </div>

            <div class="hero-side-stack" data-depth="22">
              <div class="hero-stack-card hero-stack-card-primary">
                <span class="hero-stack-label">Platform</span>
                <strong class="hero-stack-title">Auth, data, jobs, deploy</strong>
                <span class="hero-stack-copy">One runtime. One product path.</span>
              </div>
              <div class="hero-stack-card hero-stack-card-secondary">
                <span class="hero-stack-label">Language</span>
                <strong class="hero-stack-title">Ordinary TS in .fs</strong>
                <span class="hero-stack-copy">Structured enough for machines, familiar enough for teams.</span>
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
            <span>source-available platform</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128230;</span>
            <span class="social-item-n">npm</span>
            <span>global CLI install</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#127891;</span>
            <span class="social-item-n">Learn</span>
            <span>browser-first school</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128204;</span>
            <span class="social-item-n">v4.0</span>
            <span>current stable line</span>
          </div>
          <div class="social-item">
            <span aria-hidden="true">&#128274;</span>
            <span class="social-item-n">Protected</span>
            <span>structured language/runtime moat</span>
          </div>
        </div>
      </div>

      <div class="shell">
        <div class="hero-stats" role="list">
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">2</span>
            <span class="hero-stat-l">Canonical proof apps</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">17<span class="hero-stat-n-sub">/17</span></span>
            <span class="hero-stat-l">Interop tests</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">3</span>
            <span class="hero-stat-l">Deploy targets</span>
          </div>
          <div class="hero-stat" role="listitem">
            <span class="hero-stat-n">1</span>
            <span class="hero-stat-l">Quality gate to ship</span>
          </div>
        </div>
      </div>
    </section>

    <div class="ticker-strip" aria-hidden="true">
      <div class="ticker-track">
        <span class="ticker-item">FastScript v4</span>
        <span class="ticker-item">Complete TypeScript platform</span>
        <span class="ticker-item">Auth · data · jobs · deploy</span>
        <span class="ticker-item">Ordinary TS in .fs</span>
        <span class="ticker-item">Structured runtime for machine reasoning</span>
        <span class="ticker-item">/learn as proof surface</span>
        <span class="ticker-item">FastScript v4</span>
        <span class="ticker-item">Complete TypeScript platform</span>
        <span class="ticker-item">Auth · data · jobs · deploy</span>
        <span class="ticker-item">Ordinary TS in .fs</span>
        <span class="ticker-item">Structured runtime for machine reasoning</span>
        <span class="ticker-item">/learn as proof surface</span>
      </div>
    </div>

    <section class="home-how">
      <header class="sec-header reveal">
        <p class="kicker">What v4 means</p>
        <h2 class="h2">One platform instead of a stack pile.</h2>
        <p class="lead">FastScript now presents one calm full-stack TypeScript path: create, validate, migrate, test, and deploy through the same runtime boundary instead of stitching together framework, queue, auth, data, and adapter layers by hand.</p>
      </header>
      <div class="how-grid reveal-children">
        <div class="how-cell">
          <p class="how-num">01 - Author</p>
          <p class="how-title">Keep normal TS habits</p>
          <p class="how-copy">Use regular JS, TS, JSX, and TSX in <code class="ic">.fs</code>. FastScript sugar stays optional, while the platform keeps pages, APIs, jobs, middleware, migrations, and seeds inside one source system.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 - Verify</p>
          <p class="how-title">Run the proof loop</p>
          <p class="how-copy"><code class="ic">npm run qa:all</code> combines format check, lint, typecheck, validation, tests, docs, proofs, smoke checks, and release-ready artifacts into one shipping gate.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 - Ship</p>
          <p class="how-title">Deploy from one codebase</p>
          <p class="how-copy">Generate hardened output for Node, Vercel, or Cloudflare from the same project. Deployment stays part of the platform contract, not a last-minute integration scramble.</p>
        </div>
      </div>
    </section>

    <section class="home-features">
      <header class="sec-header reveal">
        <p class="kicker">Completeness pillars</p>
        <h2 class="h2">Batteries included for real product teams.</h2>
      </header>
      <div class="feature-grid reveal-children">
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128274;</div>
          <p class="feature-title">Auth and identity</p>
          <p class="feature-copy">Sessions, guards, rotation, OAuth providers, account flows, and protected route patterns already live inside the runtime.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128101;</div>
          <p class="feature-title">Teams and permissions</p>
          <p class="feature-copy">Workspace-aware product shapes, role-aware access, and policy-style control surfaces are exercised through the reference apps.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128451;</div>
          <p class="feature-title">Data lifecycle</p>
          <p class="feature-copy">Migrations, seeds, rollbacks, storage helpers, and environment-aware validation keep data changes in the same platform loop.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128260;</div>
          <p class="feature-title">Jobs and schedules</p>
          <p class="feature-copy">Queues, workers, retries, dead-letter replay, and scheduler support make background work a first-party capability.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128231;</div>
          <p class="feature-title">Notifications and billing</p>
          <p class="feature-copy">Transactional flows, receipt jobs, webhook handling, and product billing patterns are proven in the SaaS and ops references.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon" aria-hidden="true">&#128640;</div>
          <p class="feature-title">Deploy and observability</p>
          <p class="feature-copy">Build outputs, diagnostics, health-minded deploy adapters, tracing, and release-proof artifacts stay aligned from development to production.</p>
        </div>
      </div>
    </section>

    <section class="home-split reveal">
      <div class="split-section">
        <div class="split-cell">
          <p class="kicker">Proof surfaces</p>
          <h2 class="h2 split-h2">Learn the platform.<br>Then inspect the evidence.</h2>
          <p class="body-copy split-copy">The public proof set is intentionally visible. <a href="/learn">/learn</a> teaches the system in browser-first lessons, while the docs and reference apps show how FastScript behaves in real product shapes instead of only toy examples.</p>
          <div class="cta-actions">
            <a class="btn btn-primary btn-lg" href="/learn">Open /learn</a>
            <a class="btn btn-secondary btn-lg" href="/docs/team-dashboard-saas">Greenfield SaaS proof</a>
            <a class="btn btn-ghost btn-lg" href="/docs/agency-ops">Ops proof app</a>
          </div>
        </div>
        <div class="split-cell">
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">app/pages/project/[id].fs</span>
              <span class="code-block-lang">.fs</span>
            </div>
            <div class="code-block-body"><span class="code-kw">export</span> <span class="code-kw">async</span> <span class="code-kw">function</span> <span class="code-fn">load</span>(ctx) {
  <span class="code-kw">await</span> ctx.auth.requireUser()
  <span class="code-kw">const</span> project = <span class="code-kw">await</span> ctx.db.get(<span class="code-str">"projects"</span>, ctx.params.id)
  <span class="code-kw">return</span> { project }
}

<span class="code-kw">export</span> <span class="code-kw">default</span> <span class="code-kw">function</span> <span class="code-fn">Page</span>({ project }) {
  <span class="code-kw">return</span> <span class="code-str">\`&lt;h1&gt;\${project.name}&lt;/h1&gt;\`</span>
}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-story reveal">
      <header class="sec-header">
        <p class="kicker">Why FastScript</p>
        <h2 class="h2">TypeScript needed a calmer full-stack answer.</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell">
          <p class="story-cell-title">What teams want</p>
          <p class="story-cell-copy">One system for frontend, backend, jobs, deploy, and validation that does not require a maze of framework glue before product work can start.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">What FastScript changed</p>
          <p class="story-cell-copy">FastScript keeps ordinary authored TS in <code class="ic">.fs</code>, then puts compiler, runtime, framework, and deploy discipline behind that familiar surface.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">Why the language layer matters</p>
          <p class="story-cell-copy">FastScript still owns its own structured language and runtime surface, which means the platform can evolve for machine reasoning, validation, and model training without asking developers to stop writing normal TypeScript.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">What v4 ratifies</p>
          <p class="story-cell-copy">This release treats FastScript as the complete TypeScript platform line: auth, roles, migrations, seeds, jobs, notifications, proof apps, docs, and deploy surfaces all align under one public contract.</p>
        </div>
      </div>
    </section>

    <section class="home-bento">
      <header class="sec-header reveal">
        <p class="kicker">Reference evidence</p>
        <h2 class="h2">Two proof apps. One platform contract.</h2>
      </header>
      <div class="bento reveal">
        <div class="bento-cell bento-half bento-bt">
          <p class="bento-label">Greenfield SaaS reference</p>
          <p class="bento-title-lg">Team Dashboard SaaS</p>
          <p class="bento-copy">Proves public pages, auth, workspaces, roles, billing, notifications, admin, jobs, migrations, and Cloudflare-ready deployment in one greenfield product shape.</p>
          <div class="tag-row">
            <span class="tag">startup-mvp</span>
            <span class="tag">greenfield proof</span>
          </div>
        </div>
        <div class="bento-cell bento-half bento-bt">
          <p class="bento-label">Operational reference</p>
          <p class="bento-title-lg">Agency Ops</p>
          <p class="bento-copy">Proves ordinary TypeScript inside <code class="ic">.fs</code> while shipping authenticated dashboards, billing reminders, jobs, and runtime-safe deploy flow.</p>
          <div class="tag-row">
            <span class="tag">agency-ops</span>
            <span class="tag">ops proof</span>
          </div>
        </div>
      </div>
    </section>

    <section class="home-compare reveal">
      <header class="sec-header">
        <p class="kicker">Platform stance</p>
        <h2 class="h2">FastScript is not just another wrapper.</h2>
      </header>
      <div class="compare-table compare-table-4">
        <div class="compare-header">
          <div class="compare-col-head">Question</div>
          <div class="compare-col-head is-ours">FastScript</div>
          <div class="compare-col-head">Framework stack</div>
          <div class="compare-col-head">Generic AI tooling</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Ordinary TS authoring</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Yes, in <code class="ic">.fs</code></div>
          <div class="compare-cell"><span class="check">&#10003;</span> Usually</div>
          <div class="compare-cell"><span class="partial">~</span> Depends on output</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Owns the runtime path</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Compiler + runtime + deploy</div>
          <div class="compare-cell"><span class="partial">~</span> Framework only</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> No</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Validation as product contract</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> First-class proof loop</div>
          <div class="compare-cell"><span class="partial">~</span> Partial</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Usually downstream</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Machine-reasoning substrate</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Structured language/runtime</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Human ecosystem only</div>
          <div class="compare-cell"><span class="cross">&ndash;</span> Human ecosystem only</div>
        </div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Build serious products with one TypeScript platform.</h2>
        <p class="cta-copy">FastScript v4 turns the public contract into something simpler and stronger: ordinary TS in <code class="ic">.fs</code>, one runtime-native product pipeline, visible proof apps, and a structured platform that can keep getting better for both humans and machines.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/learn">Open /learn</a>
          <a class="btn btn-secondary btn-lg" href="/docs">Browse docs</a>
          <a class="btn btn-secondary btn-lg" href="/examples">Explore examples</a>
          <a class="btn btn-ghost btn-lg" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub &rarr;</a>
        </div>
      </div>
    </section>
  `;
}
