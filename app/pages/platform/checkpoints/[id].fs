import {getCheckpoint} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    checkpoint: getCheckpoint(ctx.db, ctx.params.id)
  };
}
export default function PlatformCheckpointDetail({checkpoint}) {
  if (!checkpoint) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Checkpoint not found</h1><p class="not-found-copy">This checkpoint is not available.</p></div>`;
  }
  return `
    <header class="sec-header"><p class="kicker">Checkpoint</p><h1 class="h1">${checkpoint.id}</h1><p class="lead">Resume and lineage data for platform training orchestration.</p></header>
    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Training job</p><p class="story-cell-copy">${checkpoint.trainingJob?.name || "n/a"}</p></div>
      <div class="story-cell"><p class="story-cell-title">Model version</p><p class="story-cell-copy">${checkpoint.modelVersion?.version || "n/a"}</p></div>
      <div class="story-cell"><p class="story-cell-title">Step</p><p class="story-cell-copy">${checkpoint.step}</p></div>
      <div class="story-cell"><p class="story-cell-title">Storage</p><p class="story-cell-copy">${checkpoint.storageUri}</p></div>
    </div>
  `;
}
