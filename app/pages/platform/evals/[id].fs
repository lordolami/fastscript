import {getEvalSuite, listEvalRunsBySuite, getEvalRun, listEvalResults} from "../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const suite = getEvalSuite(ctx.db, ctx.params.id);
  if (!suite) return null;
  const evalRuns = listEvalRunsBySuite(ctx.db, suite.id).map(entry => ({
    ...entry,
    results: listEvalResults(ctx.db, entry.id)
  }));
  return {
    suite,
    evalRuns
  };
}
export default function PlatformEvalDetail({suite, evalRuns}) {
  if (!suite) {
    return `<div class="not-found"><p class="not-found-code">404</p><h1 class="not-found-title">Eval suite not found</h1><p class="not-found-copy">This eval suite is not available.</p></div>`;
  }
  return `
    <header class="sec-header">
      <p class="kicker">${suite.category}</p>
      <h1 class="h1">${suite.name}</h1>
      <p class="lead">${suite.description}</p>
    </header>

    <div class="docs-card-grid">
      ${evalRuns.map(evalRun => `<div class="docs-card"><p class="kicker">${evalRun.status}</p><p class="docs-card-title">${Math.round(Number(evalRun.summaryScore || 0) * 100)}% summary score</p><p class="docs-card-copy">${evalRun.results.map(result => `${result.scenario}: ${Math.round(Number(result.score || 0) * 100)}%`).join(" • ")}</p></div>`).join("")}
    </div>
  `;
}
