import {getDatasetLineage, getReadinessAssessment, getProofPack} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const lineage = getDatasetLineage(ctx.db, ctx.params.id);
  if (!lineage) return null;
  return {
    lineage,
    readiness: getReadinessAssessment(ctx.db, "dataset", ctx.params.id),
    proof: getProofPack(ctx.db, "dataset", ctx.params.id)
  };
}
export default function PlatformDatasetDetail({lineage, readiness, proof}) {
  if (!lineage) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Dataset not found</h1><p class="not-found-copy">This dataset is not available.</p></div>`;
  }
  return `
    <header class="sec-header">
      <p class="kicker">${lineage.dataset.status}</p>
      <h1 class="h1">${lineage.dataset.name}</h1>
      <p class="lead">${lineage.dataset.description}</p>
    </header>
    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Readiness</p><p class="story-cell-copy">${Math.round(Number(readiness.score || 0) * 100)}% - ${readiness.summary}</p></div>
      <div class="story-cell"><p class="story-cell-title">Latest version</p><p class="story-cell-copy">${lineage.latestVersion?.version || "n/a"} with ${lineage.latestVersion?.rowCount || 0} rows</p></div>
      <div class="story-cell"><p class="story-cell-title">Quality score</p><p class="story-cell-copy">${Math.round(Number(lineage.quality?.score || 0) * 100)}%</p></div>
      <div class="story-cell"><p class="story-cell-title">Workspace</p><p class="story-cell-copy">${lineage.dataset.workspaceId}</p></div>
    </div>
    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Sources</p><h2 class="h2">Upstream inputs</h2></header>
      <div class="docs-card-grid">${lineage.sources.map(source => `<div class="docs-card"><p class="kicker">${source.kind}</p><p class="docs-card-title">${source.label}</p><p class="docs-card-copy">${source.syncStatus} - ${source.lastSyncedAt}</p><a class="docs-card-link" href="${source.uri}">Open source &#8594;</a></div>`).join("")}</div>
    </section>
    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Transforms</p><h2 class="h2">Processing history</h2></header>
      <div class="docs-card-grid">${lineage.transforms.map(entry => `<div class="docs-card"><p class="kicker">${entry.status}</p><p class="docs-card-title">${entry.kind}</p><p class="docs-card-copy">${entry.configSummary}</p></div>`).join("")}</div>
    </section>
    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Proof</p><h2 class="h2">${proof.title}</h2></header>
      <div class="story-grid">${proof.sections.map(section => `<div class="story-cell"><p class="story-cell-copy">${section}</p></div>`).join("")}</div>
    </section>
  `;
}
