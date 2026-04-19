import {getProofPack, getReadinessAssessment, ensurePlatformSeed} from "../../../../lib/platform-alpha.mjs";
export async function GET(ctx) {
  ensurePlatformSeed(ctx.db);
  const {subjectType, subjectId} = ctx.params;
  const proof = getProofPack(ctx.db, subjectType, subjectId);
  return ctx.helpers.json({
    ok: true,
    proof,
    readiness: getReadinessAssessment(ctx.db, subjectType, subjectId)
  });
}
