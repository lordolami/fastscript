import {listDeployments} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    deployments: listDeployments(ctx.db)
  };
}
export default function PlatformDeployments({deployments}) {
  return `
    <header class="sec-header"><p class="kicker">Deployments</p><h1 class="h1">Deployment history and rollback posture</h1><p class="lead">Deployments are now readiness-gated by proof, evals, and rollback metadata.</p></header>
    <div class="docs-card-grid">${deployments.map(deployment => `<div class="docs-card"><p class="kicker">${deployment.environment}</p><p class="docs-card-title">${deployment.id}</p><p class="docs-card-copy">${deployment.status} - ${deployment.rollout}</p></div>`).join("")}</div>
  `;
}
