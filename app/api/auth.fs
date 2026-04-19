import {ensureUserRecord} from "../lib/billing.mjs";
export const schemas = {
  POST: {
    userId: "string?",
    name: "string?",
    email: "string?"
  }
};
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  const user = ensureUserRecord(ctx.db, body.userId || body.email || body.name ? body : {
    userId: "u_1"
  });
  ctx.auth.login(user);
  return ctx.helpers.json({
    ok: true,
    user
  });
}
export async function DELETE(ctx) {
  ctx.auth.logout();
  return ctx.helpers.json({
    ok: true
  });
}
