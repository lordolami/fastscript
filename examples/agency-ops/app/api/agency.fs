import { bootstrapAgency, listAgencyData, requireAgencyForUser } from "../lib/agency.fs";

export const schemas = {
  POST: {
    agencyName: "string",
    specialty: "string?",
    timezone: "string?",
    contactEmail: "string?"
  }
};

export async function GET(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return ctx.helpers.json({
    ok: true,
    agency,
    snapshot: listAgencyData(ctx.db, agency.id)
  });
}

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const body = await ctx.input.validateBody(schemas.POST);
  const agency = bootstrapAgency(ctx.db, user, body.agencyName || user.name);
  if (body.specialty || body.timezone || body.contactEmail) {
    ctx.db.collection("agencies").set(agency.id, {
      ...agency,
      specialty: body.specialty || agency.specialty,
      timezone: body.timezone || agency.timezone,
      contactEmail: body.contactEmail || agency.contactEmail
    });
  }
  return ctx.helpers.json({
    ok: true,
    agency: ctx.db.collection("agencies").get(agency.id)
  });
}
