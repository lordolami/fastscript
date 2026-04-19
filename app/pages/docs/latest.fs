export default function DocsLatestPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Current line</p>
        <h1 class="h1">FastScript is launching as AI-system workflow infrastructure.</h1>
        <p class="lead">The current public contract is simple: FastScript is the structured substrate for AI-system workflows, and the complete full-stack TypeScript platform proves that the runtime already owns real delivery surfaces instead of outsourcing them to a stack pile.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card"><p class="docs-card-title">Primary story</p><p class="docs-card-copy">FastScript is the substrate for experiments, evaluation, proof, validation, and future training-adjacent workflows.</p></div>
        <div class="docs-card"><p class="docs-card-title">Secondary proof</p><p class="docs-card-copy">Pages, APIs, jobs, data flows, auth, security posture, and deploy outputs already compile and ship through one runtime.</p></div>
        <div class="docs-card"><p class="docs-card-title">Platform surface</p><p class="docs-card-copy">Datasets, training, evals, proof, models, deployments, workspaces, and commands now live under <code class="ic">/platform</code>.</p><a class="docs-card-link" href="/platform">Inspect the platform &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Builders course</p><p class="docs-card-copy">/learn now teaches builders and operators across the full platform, not just syntax or the first wedge.</p><a class="docs-card-link" href="/learn">Open /learn &#8594;</a></div>
      </div>
    </section>
  `;
}
