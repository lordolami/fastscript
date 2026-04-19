import {getModel, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const model = getModel(ctx.db, ctx.params.id);
  if (!model) return {
    status: 404,
    json: {
      ok: false,
      reason: "Model not found"
    }
  };
  return ctx.helpers.json({
    ok: true,
    model
  });
}
