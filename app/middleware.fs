import {ensureBillingSeed, resolvePaymentGate} from "./lib/billing.mjs";
function wantsJson(ctx) {
  return String(ctx.pathname || "").startsWith("/api/");
}
export async function middleware(ctx, next) {
  ensureBillingSeed(ctx.db);
  const gate = resolvePaymentGate(ctx.db, ctx.user, ctx.pathname, ctx.req?.method || "GET");
  if (gate.allowed) return next();
  if (wantsJson(ctx)) {
    const status = gate.entitlement?.state === "expired" || gate.policy.level === "paid" ? 402 : 401;
    return ctx.helpers.json({
      ok: false,
      gate
    }, status);
  }
  if (String(ctx.pathname || "").startsWith("/private") && !ctx.user) {
    return ctx.helpers.redirect("/buy");
  }
  if (gate.redirectTo) return ctx.helpers.redirect(gate.redirectTo);
  return next();
}
