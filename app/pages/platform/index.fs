import {resolveEntitlementState} from "../../lib/billing.mjs";
import {getPlatformOverview} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    overview: getPlatformOverview(ctx.db),
    entitlement: resolveEntitlementState(ctx.db, ctx.user)
  };
}
export default function PlatformHome({overview, entitlement}) {
  const path = ["Dataset", "Training job", "Run", "Eval", "Proof", "Model", "Deployment"].map((label, index) => `
    <div class="docs-card">
      <p class="kicker">Step ${index + 1}</p>
      <p class="docs-card-title">${label}</p>
      <p class="docs-card-copy">${index === 0 ? "Start with lineage and quality." : index === 6 ? "Ship only after readiness is visible." : "Stay inside one connected workflow."}</p>
    </div>
  `).join("");
  const workflow = [["Datasets", "Inspect quality, versions, and lineage before you trust a workload.", "/platform/datasets"], ["Training jobs", "Link datasets to queue state, checkpoints, and budget context.", "/platform/training"], ["Runs", "Track reproducibility, metrics, and artifact history in one place.", "/platform/experiments"], ["Eval and proof", "See whether the model actually improved and why the team believes it.", "/platform/evals"], ["Models", "Turn run and eval history into promotion-ready model records.", "/platform/models"], ["Deployments", "Gate rollout with readiness, incidents, and rollback context.", "/platform/deployments"]].map(([title, copy, href]) => `
    <div class="docs-card">
      <p class="docs-card-title">${title}</p>
      <p class="docs-card-copy">${copy}</p>
      <a class="docs-card-link" href="${entitlement.allowed ? href : `/buy?next=${encodeURIComponent(href)}`}">${entitlement.allowed ? "Open" : "Unlock"} &#8594;</a>
    </div>
  `).join("");
  const future = overview.futureLayers.map(layer => `
    <div class="docs-card">
      <p class="docs-card-title">${layer.title}</p>
      <p class="docs-card-copy">${layer.copy}</p>
      <div class="tag-row">${layer.entities.map(entry => `<span class="tag">${entry}</span>`).join("")}</div>
    </div>
  `).join("");
  return `
    <header class="sec-header">
      <p class="kicker">FastScript platform</p>
      <h1 class="h1">A guided buyer demo for the full operator workflow.</h1>
      <p class="lead">FastScript keeps the workflow from dataset to deployment inside one runtime-owned platform. This public overview shows the shape. The real operator console is gated behind a paid plan, while this page stays public so buyers and YC can see exactly what we built.</p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="${entitlement.allowed ? "/platform/datasets" : "/buy?next=%2Fplatform%2Fdatasets"}">${entitlement.allowed ? "Open the console" : "Buy FastScript"}</a>
        <a class="btn btn-secondary btn-lg" href="/pricing">See pricing</a>
      </div>
      <p class="learn-path-note">Current access state: ${entitlement.state}. ${entitlement.message}</p>
    </header>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Demo path</p>
        <h2 class="h2">This is the exact product story investors and buyers should see first.</h2>
      </header>
      <div class="docs-card-grid">${path}</div>
    </section>

    <div class="docs-card-grid">
      <div class="docs-card"><p class="kicker">Datasets</p><p class="h3">${overview.datasets}</p><p class="docs-card-copy">Registry, versions, transforms, and quality reports.</p></div>
      <div class="docs-card"><p class="kicker">Training jobs</p><p class="h3">${overview.trainingJobs}</p><p class="docs-card-copy">Job orchestration linked back to datasets and checkpoints.</p></div>
      <div class="docs-card"><p class="kicker">Models</p><p class="h3">${overview.models}</p><p class="docs-card-copy">Registry, versions, readiness gates, and deployment history.</p></div>
      <div class="docs-card"><p class="kicker">Mean eval score</p><p class="h3">${Math.round(Number(overview.meanEvalScore || 0) * 100)}%</p><p class="docs-card-copy">Current proof signal across the platform.</p></div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Workflow</p>
        <h2 class="h2">This is the path YC and customers should understand in under two minutes.</h2>
      </header>
      <div class="docs-card-grid">${workflow}</div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Universe map</p>
        <h2 class="h2">Every layer still belongs to one platform.</h2>
      </header>
      <div class="docs-card-grid">${future}</div>
    </section>
  `;
}
