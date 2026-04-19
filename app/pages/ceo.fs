export default function CEOPage() {
  return `
    <section class="docs-syntax">
      <header class="sec-header">
        <p class="kicker">From the CEO</p>
        <h1 class="h1">Why I built FastScript under constraint.</h1>
        <p class="lead">I did not build FastScript because the world needed another framework landing page. I built it because the way serious software and AI systems are assembled today is too fragmented, too brittle, and too easy to lose control of.</p>
      </header>

      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">The problem</p><p class="story-cell-copy">AI startups still glue datasets, runs, evals, proof, deploy logic, and product delivery together from too many tools. The result is speed loss, mistakes, and weak operational memory.</p></div>
        <div class="story-cell"><p class="story-cell-title">The constraint</p><p class="story-cell-copy">FastScript was built under real pressure and limited leverage. That forced discipline. Every layer had to justify itself. Every surface had to prove its place in the system.</p></div>
        <div class="story-cell"><p class="story-cell-title">The decision</p><p class="story-cell-copy">Instead of building one more app on top of a stack pile, I kept going deeper until the runtime, proof loop, operator console, and product workflow belonged to one owned contract.</p></div>
        <div class="story-cell"><p class="story-cell-title">The belief</p><p class="story-cell-copy">If AI becomes a real operating layer for software companies, then the winning systems will not just generate outputs. They will own workflow memory, readiness gates, deployment decisions, and the path from data to release.</p></div>
      </div>

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Why now</p>
          <h2 class="h2">Startups need more than good model demos.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card"><p class="docs-card-title">What startups actually need</p><p class="docs-card-copy">A system where they can track datasets, training jobs, runs, evals, proof, model promotion, and deployments without building their own internal platform forever.</p></div>
          <div class="docs-card"><p class="docs-card-title">Why FastScript</p><p class="docs-card-copy">FastScript owns the runtime, validation, APIs, jobs, proof, and deploy posture. That makes it a stronger foundation than a collection of disconnected tools.</p></div>
          <div class="docs-card"><p class="docs-card-title">What I�m building</p><p class="docs-card-copy">A startup product that companies can buy because it saves time, reduces expensive mistakes, and helps teams ship better model-backed products faster.</p></div>
        </div>
      </section>
    </section>
  `;
}
