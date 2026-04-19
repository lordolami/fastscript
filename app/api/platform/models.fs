import {createModel, listModels, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    slug: "string",
    name: "string",
    lineage: "string?",
    benchmarkSummary: "string?",
    safetyProfile: "string?",
    latencyProfile: "string?",
    costProfile: "string?",
    modalityMetadata: "string?",
    workspaceId: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listModels(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    model: createModel(ctx.db, body)
  });
}
