import {listDatasetVersions, ensurePlatformSeed} from "../../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  return ctx.helpers.json({
    ok: true,
    items: listDatasetVersions(ctx.db, ctx.params.id)
  });
}
