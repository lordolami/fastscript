import {listExperiments, getReadinessAssessment} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const experiments = listExperiments(ctx.db).map(experiment => ({
    ...experiment,
    readiness: getReadinessAssessment(ctx.db, "experiment", experiment.id)
  }));
  return {
    experiments
  };
}
export default function PlatformExperiments({experiments}) {
  const cards = experiments.map(experiment => `
    <div class="docs-card">
      <p class="kicker">${experiment.status}</p>
      <p class="docs-card-title">${experiment.name}</p>
      <p class="docs-card-copy">${experiment.objective}</p>
      <p class="learn-path-note">Runs: ${experiment.runCount} - Readiness: ${Math.round(Number(experiment.readiness.score || 0) * 100)}%</p>
      <a class="docs-card-link" href="/platform/experiments/${experiment.id}">Open experiment &#8594;</a>
    </div>
  `).join("");
  return `
    <header class="sec-header">
      <p class="kicker">Experiments</p>
      <h1 class="h1">Experiment center</h1>
      <p class="lead">Experiments now tie objectives, datasets, training jobs, runs, eval suites, and proof together inside the permanent FastScript platform.</p>
    </header>
    <div class="docs-card-grid">${cards}</div>
  `;
}
