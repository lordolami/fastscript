import { createClientRecord, requireAgencyForUser } from "../lib/agency.fs";

export const schemas = {
  POST: {
    name: "string",
    engagement: "string?",
    status: "string?",
    monthlyRetainer: "int?",
    nextStep: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const client = createClientRecord(ctx.db, agency.id, user.id, body);
  return ctx.helpers.json({ ok: true, client });
}
