import {getProofPack, getReadinessAssessment} from "../../../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const subjectType = ctx.params.subjectType;
  const subjectId = ctx.params.subjectId;
  return {
    subjectType,
    subjectId,
    proof: getProofPack(ctx.db, subjectType, subjectId),
    readiness: getReadinessAssessment(ctx.db, subjectType, subjectId)
  };
}
export default function PlatformProofPage({subjectType, subjectId, proof, readiness}) {
  return `
    <header class="sec-header">
      <p class="kicker">Proof pack</p>
      <h1 class="h1">${proof.title}</h1>
      <p class="lead">${readiness.summary}</p>
    </header>

    <div class="docs-card-grid">
      <div class="docs-card">
        <p class="kicker">Readiness</p>
        <p class="docs-card-title">${Math.round(Number(readiness.score || 0) * 100)}%</p>
        <p class="docs-card-copy">${readiness.risks.join(" ")}</p>
      </div>
      <div class="docs-card">
        <p class="kicker">Artifacts</p>
        <p class="docs-card-title">${proof.artifactRefs.length}</p>
        <p class="docs-card-copy">Proof artifacts linked to ${subjectType} ${subjectId}.</p>
      </div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm"><p class="kicker">Sections</p><h2 class="h2">Generated proof narrative</h2></header>
      <div class="story-grid">${proof.sections.map(section => `<div class="story-cell"><p class="story-cell-copy">${section}</p></div>`).join("")}</div>
    </section>
  `;
}
