import {listTrainingJobs} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    jobs: listTrainingJobs(ctx.db)
  };
}
export default function PlatformTraining({jobs}) {
  return `
    <header class="sec-header">
      <p class="kicker">Training</p>
      <h1 class="h1">Training jobs and checkpoints</h1>
      <p class="lead">Training orchestration now lives in the same platform loop as datasets, runs, evals, and deployments.</p>
    </header>
    <div class="docs-card-grid">
      ${jobs.map(job => `<div class="docs-card"><p class="kicker">${job.type}</p><p class="docs-card-title">${job.name}</p><p class="docs-card-copy">${job.queueStatus} - ${job.runtimeTarget}</p><a class="docs-card-link" href="/platform/training/${job.id}">Open job &#8594;</a></div>`).join("")}
    </div>
  `;
}
