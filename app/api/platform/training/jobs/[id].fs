import {getTrainingJob, ensurePlatformSeed} from "../../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const job = getTrainingJob(ctx.db, ctx.params.id);
  if (!job) return {
    status: 404,
    json: {
      ok: false,
      reason: "Training job not found"
    }
  };
  return ctx.helpers.json({
    ok: true,
    job
  });
}
