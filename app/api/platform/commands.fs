import {executeCommand, listCommandHistory, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    query: "string",
    workspaceId: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listCommandHistory(ctx.db)
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    ...executeCommand(ctx.db, body)
  });
}
