import {getPlatformOverview, getPlatformAlphaNarrative} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    overview: getPlatformOverview(ctx.db),
    narrative: getPlatformAlphaNarrative()
  };
}
export default function PlatformHome({overview, narrative}) {
  const future = overview.futureLayers.map(layer => `
    <div class="docs-card">
      <p class="docs-card-title">${layer.title}</p>
      <p class="docs-card-copy">${layer.copy}</p>
      <div class="tag-row">${layer.entities.map(entry => `<span class="tag">${entry}</span>`).join("")}</div>
    </div>
  `).join("");
  return `
    <header class="sec-header">
      <p class="kicker">FastScript platform</p>
      <h1 class="h1">${narrative.title}</h1>
      <p class="lead">${narrative.copy}</p>
    </header>

    <div class="docs-card-grid">
      <div class="docs-card"><p class="kicker">Datasets</p><p class="h3">${overview.datasets}</p><p class="docs-card-copy">Registry, versions, transforms, quality reports, and lineage.</p></div>
      <div class="docs-card"><p class="kicker">Training jobs</p><p class="h3">${overview.trainingJobs}</p><p class="docs-card-copy">Training and eval orchestration linked back to datasets and checkpoints.</p></div>
      <div class="docs-card"><p class="kicker">Models</p><p class="h3">${overview.models}</p><p class="docs-card-copy">Registry, versions, readiness gates, and deployment history.</p></div>
      <div class="docs-card"><p class="kicker">Mean eval score</p><p class="h3">${Math.round(Number(overview.meanEvalScore || 0) * 100)}%</p><p class="docs-card-copy">Current cross-platform proof signal.</p></div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Shipped now</p>
        <h2 class="h2">One operating surface</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">Datasets</p><p class="story-cell-copy">Quality, provenance, and transforms stay visible next to the workloads that depend on them.</p></div>
        <div class="story-cell"><p class="story-cell-title">Experiments and runs</p><p class="story-cell-copy">Reproducibility metadata, metrics, artifacts, and eval history stay in one inspectable loop.</p></div>
        <div class="story-cell"><p class="story-cell-title">Models and deployments</p><p class="story-cell-copy">Promotion decisions are grounded in readiness, not intuition.</p></div>
        <div class="story-cell"><p class="story-cell-title">Workspaces and ops</p><p class="story-cell-copy">Audit, incidents, costs, and commands keep the platform usable by real teams.</p></div>
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Universe map</p>
        <h2 class="h2">Platform layers now connected</h2>
      </header>
      <div class="docs-card-grid">${future}</div>
    </section>
  `;
}
