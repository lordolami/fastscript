import {getModel} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    model: getModel(ctx.db, ctx.params.id)
  };
}
export default function PlatformModelDetail({model}) {
  if (!model) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Model not found</h1><p class="not-found-copy">This model is not available.</p></div>`;
  }
  return `
    <header class="sec-header"><p class="kicker">Model</p><h1 class="h1">${model.name}</h1><p class="lead">${model.benchmarkSummary}</p></header>
    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Lineage</p><p class="story-cell-copy">${model.lineage}</p></div>
      <div class="story-cell"><p class="story-cell-title">Safety</p><p class="story-cell-copy">${model.safetyProfile}</p></div>
      <div class="story-cell"><p class="story-cell-title">Latency</p><p class="story-cell-copy">${model.latencyProfile}</p></div>
      <div class="story-cell"><p class="story-cell-title">Cost</p><p class="story-cell-copy">${model.costProfile}</p></div>
    </div>
    <section class="docs-syntax"><header class="sec-header-sm"><p class="kicker">Versions</p><h2 class="h2">Promotion-ready lineage</h2></header><div class="docs-card-grid">${model.versions.map(version => `<div class="docs-card"><p class="kicker">${Math.round(Number(version.readiness?.score || version.readinessScore || 0) * 100)}% readiness</p><p class="docs-card-title">${version.version}</p><p class="docs-card-copy">${version.checkpoints.length} checkpoints - ${version.evalRuns.length} eval runs</p></div>`).join("")}</div></section>
    <section class="docs-syntax"><header class="sec-header-sm"><p class="kicker">Deployments</p><h2 class="h2">Rollout history</h2></header><div class="docs-card-grid">${model.deployments.map(deployment => `<div class="docs-card"><p class="kicker">${deployment.environment}</p><p class="docs-card-title">${deployment.status}</p><p class="docs-card-copy">Rollout ${deployment.rollout}</p></div>`).join("")}</div></section>
  `;
}
