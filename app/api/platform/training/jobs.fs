import {createTrainingJob, listTrainingJobs, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    type: "string",
    name: "string",
    experimentId: "string?",
    datasetIds: "array?",
    runtimeTarget: "string?",
    environmentSnapshot: "string?",
    queueStatus: "string?",
    retries: "number?",
    resumeCheckpointId: "string?",
    budgetSummary: "string?",
    workspaceId: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listTrainingJobs(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    job: createTrainingJob(ctx.db, body)
  });
}
