import { requireWorkspaceForUser, upgradePlan } from "../../lib/saas.fs";

export const schemas = {
  POST: {
    planId: "string"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const result = upgradePlan(ctx.db, workspace.id, user, body.planId);
  ctx.queue.enqueue("send-receipt", {
    workspaceId: workspace.id,
    invoiceId: result.invoice.id,
    planId: result.plan.id
  });
  ctx.queue.enqueue("send-notification", {
    workspaceId: workspace.id,
    kind: "billing-upgrade",
    planId: result.plan.id,
    invoiceId: result.invoice.id
  });
  return ctx.helpers.json({
    ok: true,
    plan: result.plan,
    subscription: result.subscription,
    invoice: result.invoice
  });
}
