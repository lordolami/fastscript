import {listEvalSuites, listEvalRunsBySuite} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const suites = listEvalSuites(ctx.db).map(suite => ({
    ...suite,
    runCount: listEvalRunsBySuite(ctx.db, suite.id).length
  }));
  return {
    suites
  };
}
export default function PlatformEvals({suites}) {
  return `
    <header class="sec-header">
      <p class="kicker">Eval suites</p>
      <h1 class="h1">Evaluation and proof lanes</h1>
      <p class="lead">Evaluation is the trust layer of the FastScript universe. These suites keep proof, regressions, and readiness grounded across the full platform.</p>
    </header>
    <div class="docs-card-grid">
      ${suites.map(suite => `<div class="docs-card"><p class="kicker">${suite.category}</p><p class="docs-card-title">${suite.name}</p><p class="docs-card-copy">${suite.description}</p><p class="learn-path-note">${suite.scenarioCount} scenarios - ${suite.runCount} recorded runs</p><a class="docs-card-link" href="/platform/evals/${suite.id}">Open suite &#8594;</a></div>`).join("")}
    </div>
  `;
}
