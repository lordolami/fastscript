import { queueInvoiceReminder, requireAgencyForUser } from "../../lib/agency.fs";

export const schemas = {
  POST: {
    invoiceId: "string",
    action: "string?"
  }
};

export async function POST(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const body = await ctx.input.validateBody(schemas.POST);
  const result = queueInvoiceReminder(ctx.db, agency.id, user, body);
  ctx.queue.enqueue("send-notification", {
    agencyId: agency.id,
    kind: "invoice-reminder",
    invoiceId: result.invoice.id,
    jobId: result.job.id,
    action: body.action || "queue"
  });
  return ctx.helpers.json({ ok: true, invoice: result.invoice, job: result.job });
}
