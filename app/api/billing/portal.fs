import {createPortalSession, ensureBillingSeed} from "../../lib/billing.mjs";
export const schemas = {
  POST: {
    action: "string?",
    planId: "string?"
  }
};
export async function POST(ctx) {
  ensureBillingSeed(ctx.db);
  const user = ctx.user;
  if (!user?.id) return ctx.helpers.json({
    ok: false,
    error: "auth-required"
  }, 401);
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json({
    ok: true,
    ...createPortalSession(ctx.db, {
      user,
      action: body.action || "open",
      planId: body.planId || "team"
    })
  });
}
