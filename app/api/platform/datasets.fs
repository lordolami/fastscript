import {createDataset, listDatasets, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    slug: "string",
    name: "string",
    description: "string",
    kind: "string?",
    owner: "string?",
    status: "string?",
    workspaceId: "string?",
    version: "string?",
    sourceCount: "number?",
    rowCount: "number?",
    notes: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listDatasets(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    dataset: createDataset(ctx.db, body)
  });
}
