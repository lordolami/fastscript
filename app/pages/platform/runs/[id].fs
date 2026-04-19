import {getRun, listRunMetrics, listRunArtifacts, listEvalRunsByRun, getReadinessAssessment} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const run = getRun(ctx.db, ctx.params.id);
  if (!run) return null;
  const evalRuns = listEvalRunsByRun(ctx.db, run.id);
  return {
    run,
    metrics: listRunMetrics(ctx.db, run.id),
    artifacts: listRunArtifacts(ctx.db, run.id),
    evalRuns,
    readiness: getReadinessAssessment(ctx.db, "run", run.id)
  };
}
export default function PlatformRunDetail({run, metrics, artifacts, evalRuns, readiness}) {
  if (!run) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Run not found</h1><p class="not-found-copy">This run is not available.</p></div>`;
  }
  return `
    <header class="sec-header">
      <p class="kicker">${run.status}</p>
      <h1 class="h1">${run.name}</h1>
      <p class="lead">Reproducibility, metrics, artifacts, and evaluation results live together because FastScript is building one AI-system workflow substrate, not another loose tool chain.</p>
    </header>

    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Runtime version</p><p class="story-cell-copy">${run.runtimeVersion}</p></div>
      <div class="story-cell"><p class="story-cell-title">Code version</p><p class="story-cell-copy">${run.codeVersion}</p></div>
      <div class="story-cell"><p class="story-cell-title">Environment</p><p class="story-cell-copy">${run.environmentSnapshot} - ${run.hardwareProfile}</p></div>
      <div class="story-cell"><p class="story-cell-title">Readiness</p><p class="story-cell-copy">${Math.round(Number(readiness.score || 0) * 100)}% - ${readiness.summary}</p></div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Training provenance</p><h2 class="h2">Job and checkpoint loop</h2></header>
      <div class="docs-card-grid">
        <div class="docs-card"><p class="docs-card-title">${run.trainingJob?.name || "No training job linked"}</p><p class="docs-card-copy">${run.trainingJob?.type || "n/a"} - ${run.trainingJob?.queueStatus || "n/a"}</p>${run.trainingJob ? `<a class="docs-card-link" href="/platform/training/${run.trainingJob.id}">Open job &#8594;</a>` : ""}</div>
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Metrics</p><h2 class="h2">Measured run output</h2></header>
      <div class="docs-card-grid">
        ${metrics.map(metric => `<div class="docs-card"><p class="kicker">${metric.kind}</p><p class="docs-card-title">${metric.name}</p><p class="docs-card-copy">${metric.value} at step ${metric.step}</p></div>`).join("")}
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Artifacts</p><h2 class="h2">Linked proof outputs</h2></header>
      <div class="docs-card-grid">
        ${artifacts.map(artifact => `<div class="docs-card"><p class="kicker">${artifact.kind}</p><p class="docs-card-title">${artifact.label}</p><a class="docs-card-link" href="${artifact.uri}">Open artifact &#8594;</a></div>`).join("")}
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Eval outcomes</p><h2 class="h2">Proof tied to runs</h2></header>
      <div class="docs-card-grid">
        ${evalRuns.map(entry => `<div class="docs-card"><p class="kicker">${entry.status}</p><p class="docs-card-title">${Math.round(Number(entry.summaryScore || 0) * 100)}% summary score</p><a class="docs-card-link" href="/api/platform/evals/runs/${entry.id}">Inspect eval JSON &#8594;</a></div>`).join("")}
      </div>
    </section>
  `;
}
