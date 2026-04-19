import {ensureBillingSeed, getBillingAccount, getPricingPlans, resolveEntitlementState} from "../../lib/billing.mjs";
export async function GET(ctx) {
  ensureBillingSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    plans: getPricingPlans(),
    entitlement: resolveEntitlementState(ctx.db, ctx.user),
    account: ctx.user?.id ? getBillingAccount(ctx.db, ctx.user.id) : null
  });
}
