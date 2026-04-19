import {createWorkspace, listWorkspaces, getWorkspaceSnapshot, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export const schemas = {
  POST: {
    slug: "string",
    name: "string",
    role: "string?",
    summary: "string?"
  }
};
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listWorkspaces(ctx.db).map(workspace => getWorkspaceSnapshot(ctx.db, workspace.id))
  });
}
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    workspace: createWorkspace(ctx.db, body)
  });
}
