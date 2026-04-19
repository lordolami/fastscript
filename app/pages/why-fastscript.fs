export default function WhyFastScriptPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Why FastScript</p>
        <h1 class="h1">AI-system infrastructure needs an owned runtime.</h1>
        <p class="lead">FastScript matters because it already owns the hard full-stack boundaries: compilation, runtime rules, pages, APIs, jobs, validation, security posture, and deploy output. That ownership is what makes the AI-substrate thesis credible.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card"><p class="docs-card-title">Structured runtime advantage</p><p class="docs-card-copy">FastScript keeps the execution contract legible to machines and teams. That matters when experiments, proof, and release discipline all need to stay grounded in one place.</p></div>
        <div class="docs-card"><p class="docs-card-title">Validation advantage</p><p class="docs-card-copy">Security posture, boundaries, and readiness checks are not left for cleanup after the feature is done. The runtime carries them with the build.</p></div>
        <div class="docs-card"><p class="docs-card-title">AI workflow relevance</p><p class="docs-card-copy">Experiments, evals, proof packs, and future training surfaces work better when the substrate already owns versioned execution and product delivery.</p></div>
        <div class="docs-card"><p class="docs-card-title">Business value</p><p class="docs-card-copy">One substrate means less glue code, better reproducibility, and stronger proof when teams need to explain what changed and why it is safe to ship.</p></div>
      </div>

      <section class="docs-syntax">
        <header class="sec-header-sm"><p class="kicker">FastScript thesis</p><h2 class="h2">Full-stack TypeScript is the proof, not the ceiling.</h2></header>
        <div class="story-grid">
          <div class="story-cell"><p class="story-cell-title">What we lead with</p><p class="story-cell-copy">FastScript is the structured substrate for AI-system workflows.</p></div>
          <div class="story-cell"><p class="story-cell-title">What proves it</p><p class="story-cell-copy">The platform already compiles and ships real pages, APIs, auth, jobs, data flows, and deploy outputs through one runtime contract.</p></div>
          <div class="story-cell"><p class="story-cell-title">What ships now</p><p class="story-cell-copy">A public proof site, a builders course, a pricing path, and a gated operator console covering datasets, training, experiments, eval suites, proof packs, models, deployments, and operations.</p></div>
          <div class="story-cell"><p class="story-cell-title">Why this is defensible</p><p class="story-cell-copy">Runtime ownership, workflow memory, readiness gates, and deployment history turn FastScript into system-of-record infrastructure instead of another thin tool.</p></div>
        </div>
      </section>
    </section>
  `;
}
