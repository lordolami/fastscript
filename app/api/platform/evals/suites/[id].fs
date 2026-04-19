import {getEvalSuite, listEvalRunsBySuite, ensurePlatformSeed} from "../../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const suite = getEvalSuite(ctx.db, ctx.params.id);
  if (!suite) {
    return {
      status: 404,
      json: {
        ok: false,
        reason: "Eval suite not found"
      }
    };
  }
  return ctx.helpers.json({
    ok: true,
    suite,
    evalRuns: listEvalRunsBySuite(ctx.db, suite.id)
  });
}
