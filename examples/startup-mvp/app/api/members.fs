import { inviteMemberRecord, requireWorkspaceForUser } from "../lib/saas.fs";

export const schemas = {
  POST: {
    email: "string",
    role: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const membership = inviteMemberRecord(ctx.db, workspace.id, user, body);
  ctx.queue.enqueue("send-notification", {
    workspaceId: workspace.id,
    kind: "member-invite",
    email: membership.email,
    role: membership.role,
    jobId: membership.id
  });
  return ctx.helpers.json({ ok: true, membership });
}
