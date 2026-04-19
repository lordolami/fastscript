import {createCheckoutSession, ensureBillingSeed, getPricingPlans} from "../../lib/billing.mjs";
export const schemas = {
  POST: {
    planId: "string?",
    mode: "string?",
    nextPath: "string?"
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
  const planId = body.planId || "team";
  const supported = new Set(getPricingPlans().map(plan => plan.id));
  if (!supported.has(planId)) {
    return ctx.helpers.json({
      ok: false,
      error: "unknown-plan"
    }, 400);
  }
  const checkout = createCheckoutSession(ctx.db, {
    user,
    planId,
    mode: body.mode || "paid",
    nextPath: body.nextPath || "/platform"
  });
  return ctx.helpers.json({
    ok: true,
    ...checkout
  });
}
