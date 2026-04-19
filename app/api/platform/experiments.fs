import {createExperiment, listExperiments, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    slug: "string",
    name: "string",
    objective: "string",
    owner: "string?",
    status: "string?",
    notes: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listExperiments(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  const experiment = createExperiment(ctx.db, body);
  return ctx.helpers.json({
    ok: true,
    experiment
  });
}
