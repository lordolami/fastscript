import { createProjectRecord, requireWorkspaceForUser } from "../lib/saas.fs";

export const schemas = {
  POST: {
    name: "string",
    client: "string?",
    status: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const project = createProjectRecord(ctx.db, workspace.id, user.id, body);
  return ctx.helpers.json({ ok: true, project });
}
