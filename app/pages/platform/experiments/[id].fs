import {getExperiment, listRunsForExperiment, listEvalSuites, getReadinessAssessment, getProofPack} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const experiment = getExperiment(ctx.db, ctx.params.id);
  if (!experiment) return null;
  const suiteMap = new Map(listEvalSuites(ctx.db).map(suite => [suite.id, suite]));
  return {
    experiment,
    runs: listRunsForExperiment(ctx.db, experiment.id),
    suites: experiment.evalSuiteIds.map(id => suiteMap.get(id)).filter(Boolean),
    readiness: getReadinessAssessment(ctx.db, "experiment", experiment.id),
    proof: getProofPack(ctx.db, "experiment", experiment.id)
  };
}
export default function PlatformExperimentDetail({experiment, runs, suites, readiness, proof}) {
  if (!experiment) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Experiment not found</h1><p class="not-found-copy">This experiment is not available.</p></div>`;
  }
  return `
    <header class="sec-header">
      <p class="kicker">${experiment.status}</p>
      <h1 class="h1">${experiment.name}</h1>
      <p class="lead">${experiment.objective}</p>
    </header>

    <div class="story-grid">
      <div class="story-cell"><p class="story-cell-title">Owner</p><p class="story-cell-copy">${experiment.owner}</p></div>
      <div class="story-cell"><p class="story-cell-title">Datasets</p><p class="story-cell-copy">${(experiment.datasets || []).map(entry => entry.name).join(", ")}</p></div>
      <div class="story-cell"><p class="story-cell-title">Readiness</p><p class="story-cell-copy">${Math.round(Number(readiness.score || 0) * 100)}% - ${readiness.summary}</p></div>
      <div class="story-cell"><p class="story-cell-title">Notes</p><p class="story-cell-copy">${experiment.notes}</p></div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Datasets</p><h2 class="h2">Upstream lineage</h2></header>
      <div class="docs-card-grid">
        ${(experiment.datasets || []).map(dataset => `<div class="docs-card"><p class="docs-card-title">${dataset.name}</p><p class="docs-card-copy">Quality ${Math.round(Number(dataset.quality?.score || 0) * 100)}%</p><a class="docs-card-link" href="/platform/datasets/${dataset.id}">Open dataset &#8594;</a></div>`).join("")}
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Runs</p><h2 class="h2">Tracked execution history</h2></header>
      <div class="docs-card-grid">
        ${runs.map(run => `<div class="docs-card"><p class="kicker">${run.status}</p><p class="docs-card-title">${run.name}</p><p class="docs-card-copy">${run.runtimeVersion} - ${run.environmentSnapshot}</p><a class="docs-card-link" href="/platform/runs/${run.id}">Inspect run &#8594;</a></div>`).join("")}
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Eval suites</p><h2 class="h2">Linked proof lanes</h2></header>
      <div class="docs-card-grid">
        ${suites.map(suite => `<div class="docs-card"><p class="docs-card-title">${suite.name}</p><p class="docs-card-copy">${suite.description}</p><a class="docs-card-link" href="/platform/evals/${suite.id}">Open suite &#8594;</a></div>`).join("")}
      </div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Proof</p><h2 class="h2">${proof.title}</h2></header>
      <div class="story-grid">${proof.sections.map(section => `<div class="story-cell"><p class="story-cell-copy">${section}</p></div>`).join("")}</div>
      <a class="btn btn-secondary btn-lg" href="/platform/proof/experiment/${experiment.id}">Open proof page</a>
    </section>
  `;
}
