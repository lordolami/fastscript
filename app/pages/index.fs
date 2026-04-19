export default function Home() {
  return `
    <section class="hero">
      <div class="shell hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge-dot" aria-hidden="true"></span>
            stable platform - <a href="/platform" class="hero-badge-link">full universe console</a>
          </div>

          <h1 class="hero-title">
            Structured substrate for<br>
            <span class="hero-title-muted">AI-system workflows.</span>
          </h1>

          <p class="hero-desc">
            FastScript is the structured substrate for AI-system workflows, with datasets, training, evals, proof, deployments, and product delivery living in one runtime-owned platform.
          </p>

          <div class="install-row">
            <span class="install-row-prefix">$</span>
            <span class="install-row-cmd" id="install-cmd">npm install -g fastscript</span>
            <button class="copy-btn" data-copy="npm install -g fastscript" aria-label="Copy install command">&#9112; Copy</button>
          </div>

          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="/platform">Open the platform</a>
            <a class="btn btn-secondary btn-lg" href="/learn">Start the builders course</a>
          </div>
        </div>

        <div class="hero-right" aria-hidden="true">
          <div class="hero-scene" data-home-3d>
            <div class="hero-visual hero-visual-main" data-depth="28" data-tilt-card>
              <div class="hero-visual-reflection"></div>
              <div class="terminal-bar">
                <span class="terminal-dot-r"></span>
                <span class="terminal-dot-y"></span>
                <span class="terminal-dot-g"></span>
                <span class="terminal-title">fastscript platform</span>
              </div>
              <div class="terminal-body">
                <span class="t-prompt">$ </span><span class="t-cmd">fastscript build</span><br>
                <span class="t-out">&nbsp; &#10003; pages, APIs, jobs, and proof surfaces compiled</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cmd">open /platform</span><br>
                <span class="t-out">&nbsp; &#10003; datasets, training, evals, models, and proof visible</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cmd">open /learn</span><br>
                <span class="t-success">&nbsp; &#10003; builder-grade curriculum aligned to repo truth</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shell">
        <div class="hero-stats" role="list">
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">1</span><span class="hero-stat-l">Permanent platform console</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">2</span><span class="hero-stat-l">Seeded datasets with lineage</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">10</span><span class="hero-stat-l">Universe layers implemented</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">1</span><span class="hero-stat-l">Runtime contract underneath everything</span></div>
        </div>
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Why now</p>
        <h2 class="h2">The AI stack is still too brittle.</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">Fragmented tooling</p><p class="story-cell-copy">Teams still glue datasets, runs, evals, proof, deploy logic, and product surfaces together from unrelated systems.</p></div>
        <div class="story-cell"><p class="story-cell-title">Weak proof discipline</p><p class="story-cell-copy">It is too easy to claim model progress without a durable trail of evidence, readiness summaries, or reproducible run metadata.</p></div>
        <div class="story-cell"><p class="story-cell-title">Stack-pile cost</p><p class="story-cell-copy">When routes, APIs, jobs, security posture, and deploy rules live outside the core runtime, every AI product becomes integration debt.</p></div>
        <div class="story-cell"><p class="story-cell-title">FastScript answer</p><p class="story-cell-copy">Own the runtime. Own the validation. Own the proof surface. Build outward from one substrate instead of choreographing a tool chain.</p></div>
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">What ships now</p>
        <h2 class="h2">A complete platform, not a vague future story.</h2>
      </header>
      <div class="docs-card-grid reveal-children">
        <div class="docs-card"><p class="docs-card-title">Platform console</p><p class="docs-card-copy">Datasets, runs, training jobs, eval suites, proof packs, models, deployments, workspaces, and grounded commands live under <code class="ic">/platform</code>.</p><a class="docs-card-link" href="/platform">Open platform &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Builders course</p><p class="docs-card-copy">The course now follows the full platform: data, training, proof, deployments, governance, and grounded command workflows.</p><a class="docs-card-link" href="/learn">Open builders course &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Reference apps</p><p class="docs-card-copy">The public SaaS and ops applications stay as reference proof surfaces showing FastScript already owns product delivery end to end.</p><a class="docs-card-link" href="/showcase">See proof surfaces &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Docs and benchmarks</p><p class="docs-card-copy">The docs, support matrix, and proof pack now back the same launch story instead of presenting parallel product identities.</p><a class="docs-card-link" href="/benchmarks">Read the proof story &#8594;</a></div>
      </div>
    </section>

    <section class="cta-band">
      <div class="cta-shell">
        <p class="kicker">FastScript</p>
        <h2 class="cta-title">Build on the substrate, not on a pile of disconnected tools.</h2>
        <p class="cta-copy">Build on the full platform now: inspect the console, follow the builders course, and ship on the same runtime that carries proof and deployment discipline.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/platform">Inspect the platform</a>
          <a class="btn btn-secondary btn-lg" href="/docs/latest">Read the current contract</a>
        </div>
      </div>
    </section>
  `;
}
