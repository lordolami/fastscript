import { bootstrapWorkspace, listWorkspaceData, requireWorkspaceForUser } from "../lib/saas.fs";

export const schemas = {
  POST: {
    workspaceName: "string",
    industry: "string?",
    timezone: "string?",
    notificationEmail: "string?"
  }
};

export async function GET(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return ctx.helpers.json({
    ok: true,
    workspace,
    snapshot: listWorkspaceData(ctx.db, workspace.id)
  });
}

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const body = await ctx.input.validateBody(schemas.POST);
  const workspace = bootstrapWorkspace(ctx.db, user, body.workspaceName || user.name);
  if (body.industry || body.timezone || body.notificationEmail) {
    ctx.db.collection("workspaces").set(workspace.id, {
      ...workspace,
      industry: body.industry || workspace.industry,
      timezone: body.timezone || workspace.timezone,
      notificationEmail: body.notificationEmail || workspace.notificationEmail
    });
  }
  return ctx.helpers.json({
    ok: true,
    workspace: ctx.db.collection("workspaces").get(workspace.id)
  });
}
