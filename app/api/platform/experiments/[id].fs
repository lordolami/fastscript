import {getExperiment, listRunsForExperiment, getReadinessAssessment, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const experiment = getExperiment(ctx.db, ctx.params.id);
  if (!experiment) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Experiment not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    experiment,
    runs: listRunsForExperiment(ctx.db, experiment.id),
    readiness: getReadinessAssessment(ctx.db, "experiment", experiment.id)
  });
}
