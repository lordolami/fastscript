import { createWorkItemRecord, requireAgencyForUser } from "../lib/agency.fs";

export const schemas = {
  POST: {
    title: "string",
    clientName: "string?",
    lane: "string?",
    priority: "string?",
    dueLabel: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const body = await ctx.input.validateBody(schemas.POST);
  const { agency } = requireAgencyForUser(ctx.db, user);
  const workItem = createWorkItemRecord(ctx.db, agency.id, user.id, {
    title: body.title,
    clientName: body.clientName || agency.name,
    lane: body.lane || "delivery",
    priority: body.priority || "medium",
    dueLabel: body.dueLabel || "Due this week"
  });
  return ctx.helpers.json({ ok: true, workItem });
}

