import {listModels} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    models: listModels(ctx.db)
  };
}
export default function PlatformModels({models}) {
  return `
    <header class="sec-header"><p class="kicker">Models</p><h1 class="h1">Model registry and readiness gates</h1><p class="lead">Models, versions, eval summaries, and deployment promotion now live in the same proof-aware platform.</p></header>
    <div class="docs-card-grid">${models.map(model => `<div class="docs-card"><p class="kicker">${model.modalityMetadata}</p><p class="docs-card-title">${model.name}</p><p class="docs-card-copy">${model.benchmarkSummary}</p><a class="docs-card-link" href="/platform/models/${model.id}">Open model &#8594;</a></div>`).join("")}</div>
  `;
}
