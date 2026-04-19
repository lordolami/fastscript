import {compareRuns, listExperiments, listRunsForExperiment, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export const schemas = {
  GET: {
    left: "string?",
    right: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const query = ctx.input.validateQuery(schemas.GET);
  let leftId = query.left || "";
  let rightId = query.right || "";
  if (!leftId || !rightId) {
    const experiment = listExperiments(ctx.db)[0];
    const runs = experiment ? listRunsForExperiment(ctx.db, experiment.id) : [];
    leftId = leftId || runs[0]?.id || "";
    rightId = rightId || runs[1]?.id || runs[0]?.id || "";
  }
  const comparison = compareRuns(ctx.db, leftId, rightId);
  if (!comparison) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Comparison targets not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    comparison
  });
}
