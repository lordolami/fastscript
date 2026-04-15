import { assignWorkItem, createWorkItemRecord, listAgencyData, requireAgencyForUser } from "../lib/agency.fs";

export const schemas = {
  POST: {
    title: "string",
    clientName: "string?",
    lane: "string?",
    priority: "string?",
    dueLabel: "string?",
    assigneeMembershipId: "string?"
  },
  PATCH: {
    workItemId: "string",
    assigneeMembershipId: "string?"
  }
};

export async function GET(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const snapshot = listAgencyData(ctx.db, agency.id);
  return ctx.helpers.json({
    ok: true,
    workItems: snapshot.workItems,
    workload: snapshot.workload,
    memberships: snapshot.memberships
  });
}

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const body = await ctx.input.validateBody(schemas.POST);
  const { agency } = requireAgencyForUser(ctx.db, user);
  const workItem = createWorkItemRecord(ctx.db, agency.id, user.id, {
    title: body.title,
    clientName: body.clientName || agency.name,
    lane: body.lane || "delivery",
    priority: body.priority || "medium",
    dueLabel: body.dueLabel || "Due this week",
    assigneeMembershipId: body.assigneeMembershipId || ""
  });
  return ctx.helpers.json({ ok: true, workItem });
}

export async function PATCH(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const body = await ctx.input.validateBody(schemas.PATCH);
  const { agency } = requireAgencyForUser(ctx.db, user);
  const workItem = assignWorkItem(ctx.db, agency.id, user, body);
  return ctx.helpers.json({ ok: true, workItem });
}
