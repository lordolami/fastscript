export default function Home() {
  return `
    <section class="hero">
      <div class="shell hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge-dot" aria-hidden="true"></span>
            public demo, paid product - <a href="/platform" class="hero-badge-link">see the workflow</a>
          </div>

          <h1 class="hero-title">
            The operator system for<br>
            <span class="hero-title-muted">AI startups shipping models.</span>
          </h1>

          <p class="hero-desc">
            FastScript gives startups one system for datasets, training jobs, experiments, evals, proof, model promotion, and deployments instead of a pile of scripts, dashboards, and internal glue.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="/buy">Buy FastScript</a>
            <a class="btn btn-secondary btn-lg" href="/platform">See live demo</a>
          </div>
          <p class="learn-path-note">Team $299/mo. Growth $999/mo. Enterprise by contact.</p>
        </div>

        <div class="hero-right" aria-hidden="true">
          <div class="hero-scene" data-home-3d>
            <div class="hero-visual hero-visual-main" data-depth="28" data-tilt-card>
              <div class="hero-visual-reflection"></div>
              <div class="terminal-bar">
                <span class="terminal-dot-r"></span>
                <span class="terminal-dot-y"></span>
                <span class="terminal-dot-g"></span>
                <span class="terminal-title">fastscript operator flow</span>
              </div>
              <div class="terminal-body">
                <span class="t-prompt">$ </span><span class="t-cmd">dataset -&gt; training -&gt; run</span><br>
                <span class="t-out">&nbsp; &#10003; lineage and provenance stay visible</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cmd">run -&gt; eval -&gt; proof</span><br>
                <span class="t-out">&nbsp; &#10003; promotion is grounded in readiness</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cmd">model -&gt; deployment</span><br>
                <span class="t-success">&nbsp; &#10003; one workflow instead of stack sprawl</span><br><br>
                <span class="t-prompt">$ </span><span class="t-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shell">
        <div class="hero-stats" role="list">
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">$299</span><span class="hero-stat-l">Team plan</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">Live</span><span class="hero-stat-l">Public workflow demo</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">1</span><span class="hero-stat-l">Public demo, paid console</span></div>
          <div class="hero-stat" role="listitem"><span class="hero-stat-n">7</span><span class="hero-stat-l">Workflow steps from data to deploy</span></div>
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
        <p class="kicker">Why teams buy it</p>
        <h2 class="h2">This is what FastScript replaces.</h2>
      </header>
      <div class="docs-card-grid reveal-children">
        <div class="docs-card"><p class="docs-card-title">Engineering time</p><p class="docs-card-copy">Stop stitching datasets, training jobs, evals, proof, deployments, and team memory together from separate tools.</p></div>
        <div class="docs-card"><p class="docs-card-title">Fewer mistakes</p><p class="docs-card-copy">Readiness gates, lineage, and proof packs reduce bad promotions, missing provenance, and ungrounded deployment calls.</p></div>
        <div class="docs-card"><p class="docs-card-title">Faster releases</p><p class="docs-card-copy">Move from data to deployment in one operator system instead of rebuilding your internal platform while trying to ship a product.</p></div>
        <div class="docs-card"><p class="docs-card-title">Real buyer path</p><p class="docs-card-copy">Public thesis, public proof, and a paid product boundary that turns serious teams into real customers instead of tourists.</p><a class="docs-card-link" href="/pricing">Open pricing &#8594;</a></div>
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Who it is for</p>
        <h2 class="h2">Built for model-backed startups, not tourists.</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">Video model startup</p><p class="story-cell-copy">Track datasets, training jobs, eval regressions, proof, and deployment readiness in one system.</p></div>
        <div class="story-cell"><p class="story-cell-title">Coding agent startup</p><p class="story-cell-copy">Keep repo-task datasets, runs, evals, and deployment gates grounded in workflow memory.</p></div>
        <div class="story-cell"><p class="story-cell-title">Voice model startup</p><p class="story-cell-copy">Tie checkpoints, quality loops, proof, and release decisions into one operator surface.</p></div>
        <div class="story-cell"><p class="story-cell-title">YC demo path</p><p class="story-cell-copy">Open the public platform overview, follow the workflow chain, and see exactly where the paid operator console takes over.</p></div>
      </div>
    </section>

    <section class="cta-band">
      <div class="cta-shell">
        <p class="kicker">FastScript</p>
        <h2 class="cta-title">Start with the thesis. Buy the operator system when you are ready to run it.</h2>
        <p class="cta-copy">Inspect the public workflow demo, understand the proof, then buy the real console when your team needs the full operator surface.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/buy">Buy FastScript</a>
          <a class="btn btn-secondary btn-lg" href="/platform">Inspect the platform</a>
        </div>
      </div>
    </section>
  `;
}
