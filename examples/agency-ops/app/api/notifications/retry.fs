import { queueNotificationJob, requireAgencyForUser } from "../../lib/agency.fs";

export const schemas = {
  POST: {
    kind: "string"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const job = queueNotificationJob(ctx.db, agency.id, body.kind, { requestedBy: user.id });
  ctx.queue.enqueue("send-notification", {
    agencyId: agency.id,
    kind: body.kind,
    jobId: job.id
  });
  return ctx.helpers.json({ ok: true, job });
}
