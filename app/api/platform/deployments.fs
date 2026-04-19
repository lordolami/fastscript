import {createDeployment, listDeployments, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    modelVersionId: "string",
    environment: "string?",
    status: "string?",
    rollout: "string?",
    fallbackModelVersionId: "string?",
    rollbackNotes: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listDeployments(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    deployment: createDeployment(ctx.db, body)
  });
}
