import {listSyntheticDatasetJobs} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    jobs: listSyntheticDatasetJobs(ctx.db)
  };
}
export default function PlatformSyntheticData({jobs}) {
  return `
    <header class="sec-header"><p class="kicker">Synthetic data</p><h1 class="h1">Synthetic dataset jobs</h1><p class="lead">Synthetic jobs stay connected to recipes, datasets, and proof outcomes.</p></header>
    <div class="docs-card-grid">${jobs.map(job => `<div class="docs-card"><p class="kicker">${job.status}</p><p class="docs-card-title">${job.id}</p><p class="docs-card-copy">${job.notes}</p></div>`).join("")}</div>
  `;
}
