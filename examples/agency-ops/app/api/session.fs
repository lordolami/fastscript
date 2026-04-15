import { bootstrapAgency } from "../lib/agency.fs";

export const schemas = {
  POST: {
    name: "string",
    email: "string",
    agencyName: "string?"
  }
};

function userIdForEmail(email) {
  return `user_${String(email || "guest").toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  const user = {
    id: userIdForEmail(body.email),
    name: body.name,
    email: body.email
  };
  ctx.auth.login(user);
  const agency = bootstrapAgency(ctx.db, user, body.agencyName);
  return ctx.helpers.json({ ok: true, user, agency });
}

export async function DELETE(ctx) {
  ctx.auth.logout();
  return ctx.helpers.json({ ok: true });
}
