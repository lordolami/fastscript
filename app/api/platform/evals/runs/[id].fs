import {getEvalRun, listEvalResults, getReadinessAssessment, ensurePlatformSeed} from "../../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const evalRun = getEvalRun(ctx.db, ctx.params.id);
  if (!evalRun) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Eval run not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    evalRun,
    results: listEvalResults(ctx.db, evalRun.id),
    readiness: getReadinessAssessment(ctx.db, "eval", evalRun.id)
  });
}
