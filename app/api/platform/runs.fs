import {createRun, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    experimentId: "string",
    name: "string",
    status: "string?",
    seed: "string?",
    runtimeVersion: "string?",
    codeVersion: "string?",
    environmentSnapshot: "string?",
    hardwareProfile: "string?",
    notes: "string?"
  }
};
export async function POST(ctx) {
  ensurePlatformSeed(ctx.db);
  const body = await ctx.input.validateBody(schemas.POST);
  const run = createRun(ctx.db, body);
  if (!run) {
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
    run
  });
}
