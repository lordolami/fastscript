import {listAuditEvents, ensurePlatformSeed} from "../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listAuditEvents(ctx.db)
  });
}
