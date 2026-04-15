import { createActivity, requireWorkspaceForUser, updateWorkspaceSettings } from "../lib/saas.fs";

export const schemas = {
  POST: {
    name: "string?",
    industry: "string?",
    timezone: "string?",
    notificationEmail: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const updated = updateWorkspaceSettings(ctx.db, workspace.id, body);
  createActivity(ctx.db, workspace.id, "workspace.updated", `Updated workspace settings for ${updated.name}`, user.id);
  return ctx.helpers.json({ ok: true, workspace: updated });
}
