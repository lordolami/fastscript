import { inviteMemberRecord, requireAgencyForUser } from "../lib/agency.fs";

export const schemas = {
  POST: {
    email: "string",
    name: "string?",
    role: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const membership = inviteMemberRecord(ctx.db, agency.id, user, body);
  ctx.queue.enqueue("send-notification", {
    agencyId: agency.id,
    kind: "team-invite",
    email: membership.email,
    role: membership.role,
    jobId: membership.id
  });
  return ctx.helpers.json({ ok: true, membership });
}
