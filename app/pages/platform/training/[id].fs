import {getTrainingJob} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    job: getTrainingJob(ctx.db, ctx.params.id)
  };
}
export default function PlatformTrainingDetail({job}) {
  if (!job) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Training job not found</h1><p class="not-found-copy">This training job is not available.</p></div>`;
  }
  return `
    <header class="sec-header">
      <p class="kicker">${job.type}</p>
      <h1 class="h1">${job.name}</h1>
      <p class="lead">Queue status, datasets, checkpoints, and experiment linkage stay in one inspectable training surface.</p>
    </header>
    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Status</p><p class="story-cell-copy">${job.status} - ${job.queueStatus}</p></div>
      <div class="story-cell"><p class="story-cell-title">Runtime</p><p class="story-cell-copy">${job.runtimeTarget}</p></div>
      <div class="story-cell"><p class="story-cell-title">Budget</p><p class="story-cell-copy">${job.budgetSummary}</p></div>
      <div class="story-cell"><p class="story-cell-title">Experiment</p><p class="story-cell-copy">${job.experiment?.name || "n/a"}</p></div>
    </div>
    <section class="docs-syntax"><header class="sec-header-sm"><p class="kicker">Datasets</p><h2 class="h2">Training inputs</h2></header><div class="docs-card-grid">${job.datasets.map(dataset => `<div class="docs-card"><p class="docs-card-title">${dataset.name}</p><a class="docs-card-link" href="/platform/datasets/${dataset.id}">Open dataset &#8594;</a></div>`).join("")}</div></section>
    <section class="docs-syntax"><header class="sec-header-sm"><p class="kicker">Checkpoints</p><h2 class="h2">Resume and lineage</h2></header><div class="docs-card-grid">${job.checkpoints.map(checkpoint => `<div class="docs-card"><p class="kicker">${checkpoint.status}</p><p class="docs-card-title">Step ${checkpoint.step}</p><a class="docs-card-link" href="/platform/checkpoints/${checkpoint.id}">Open checkpoint &#8594;</a></div>`).join("")}</div></section>
  `;
}
