export default function RoadmapPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Roadmap</p>
        <h1 class="h1">Build the universe from one permanent platform outward.</h1>
        <p class="lead">FastScript is not shipping a scattered ecosystem story. The roadmap is one platform growing in layers from a permanent console that already exists.</p>
      </header>
      <div class="docs-card-grid">
        <div class="docs-card"><p class="kicker">Shipped now</p><p class="docs-card-title">Datasets, training, experiments, evals, proof, and operations</p><p class="docs-card-copy">Permanent platform console inside the main product surface.</p></div>
        <div class="docs-card"><p class="kicker">Current focus</p><p class="docs-card-title">Hardening and release discipline</p><p class="docs-card-copy">Proof publication, package quality, deploy validation, and release operations now reinforce the full platform surface.</p></div>
        <div class="docs-card"><p class="kicker">Platform depth</p><p class="docs-card-title">Richer orchestration and specialization</p><p class="docs-card-copy">Training, checkpoints, adapters, recipes, and post-training flows will keep getting denser without leaving the core platform contract.</p></div>
        <div class="docs-card"><p class="kicker">Operating layer</p><p class="docs-card-title">Registry, governance, operations</p><p class="docs-card-copy">Model registry, deployment, workspace controls, cost visibility, incidents, and grounded commands continue to mature in place.</p></div>
      </div>
    </section>
  `;
}
