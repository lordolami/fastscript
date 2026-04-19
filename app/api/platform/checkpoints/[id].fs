import {getCheckpoint, ensurePlatformSeed} from "../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const checkpoint = getCheckpoint(ctx.db, ctx.params.id);
  if (!checkpoint) return {
    status: 404,
    json: {
      ok: false,
      reason: "Checkpoint not found"
    }
  };
  return ctx.helpers.json({
    ok: true,
    checkpoint
  });
}
