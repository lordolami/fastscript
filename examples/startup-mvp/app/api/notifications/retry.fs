import { queueNotificationJob, requireWorkspaceForUser } from "../../lib/saas.fs";

export const schemas = {
  POST: {
    kind: "string"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const job = queueNotificationJob(ctx.db, workspace.id, body.kind, { requestedBy: user.id });
  ctx.queue.enqueue("send-notification", {
    workspaceId: workspace.id,
    kind: body.kind,
    jobId: job.id
  });
  return ctx.helpers.json({ ok: true, job });
}
