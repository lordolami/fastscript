import {getDatasetLineage, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const lineage = getDatasetLineage(ctx.db, ctx.params.id);
  if (!lineage) return {
    status: 404,
    json: {
      ok: false,
      reason: "Dataset not found"
    }
  };
  return ctx.helpers.json({
    ok: true,
    lineage
  });
}
