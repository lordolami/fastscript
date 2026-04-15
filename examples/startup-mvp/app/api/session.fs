import { bootstrapWorkspace } from "../lib/saas.fs";

export const schemas = {
  POST: {
    name: "string",
    email: "string",
    workspaceName: "string?"
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
  const workspace = bootstrapWorkspace(ctx.db, user, body.workspaceName);
  return ctx.helpers.json({
    ok: true,
    user,
    workspace
  });
}

export async function DELETE(ctx) {
  ctx.auth.logout();
  return ctx.helpers.json({ ok: true });
}
