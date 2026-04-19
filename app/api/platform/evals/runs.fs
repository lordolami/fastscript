import {createEvalRun, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    suiteId: "string",
    runId: "string",
    status: "string?",
    summaryScore: "number?"
  }
};
export async function POST(ctx) {
  ensurePlatformSeed(ctx.db);
  const body = await ctx.input.validateBody(schemas.POST);
  const evalRun = createEvalRun(ctx.db, body);
  if (!evalRun) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Suite or run not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    evalRun
  });
}
