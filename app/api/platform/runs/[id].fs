import {getRun, listRunMetrics, listRunArtifacts, listEvalRunsByRun, getReadinessAssessment, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const run = getRun(ctx.db, ctx.params.id);
  if (!run) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Run not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    run,
    metrics: listRunMetrics(ctx.db, run.id),
    artifacts: listRunArtifacts(ctx.db, run.id),
    evalRuns: listEvalRunsByRun(ctx.db, run.id),
    readiness: getReadinessAssessment(ctx.db, "run", run.id)
  });
}
