import {applyBillingWebhook, ensureBillingSeed} from "../../lib/billing.mjs";
export const schemas = {
  POST: {
    userId: "string",
    state: "string?",
    trialState: "string?",
    subscriptionStatus: "string?"
  }
};
export async function POST(ctx) {
  ensureBillingSeed(ctx.db);
  const body = await ctx.input.validateBody(schemas.POST);
  return ctx.helpers.json(applyBillingWebhook(ctx.db, body));
}
