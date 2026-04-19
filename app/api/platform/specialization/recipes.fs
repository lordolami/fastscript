import {createSpecializationRecipe, listSpecializationRecipes, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    name: "string",
    status: "string?",
    sourceDatasetVersionId: "string?",
    sourceModelVersionId: "string?",
    linkedEvalSuiteIds: "array?",
    proofStatus: "string?",
    notes: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listSpecializationRecipes(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    recipe: createSpecializationRecipe(ctx.db, body)
  });
}
