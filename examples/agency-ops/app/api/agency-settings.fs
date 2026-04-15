import { createActivity, requireAgencyForUser, updateAgencySettings } from "../lib/agency.fs";

export const schemas = {
  POST: {
    name: "string?",
    specialty: "string?",
    timezone: "string?",
    contactEmail: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const updated = updateAgencySettings(ctx.db, agency.id, body);
  createActivity(ctx.db, agency.id, "agency.updated", `Updated agency settings for ${updated.name}`, user.id);
  return ctx.helpers.json({ ok: true, agency: updated });
}
