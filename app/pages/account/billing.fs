import {getBillingAccount, getPricingPlans, resolveEntitlementState} from "../../lib/billing.mjs";
export async function load(ctx) {
  return {
    plans: getPricingPlans(),
    entitlement: resolveEntitlementState(ctx.db, ctx.user),
    account: ctx.user?.id ? getBillingAccount(ctx.db, ctx.user.id) : null
  };
}
export default function BillingAccountPage({plans, entitlement, account}) {
  const plansHtml = plans.filter(plan => plan.id !== "enterprise").map(plan => `
    <div class="docs-card">
      <p class="kicker">${plan.name}</p>
      <p class="h3">${plan.priceLabel}</p>
      <p class="docs-card-copy">${plan.audience}</p>
      <button type="button" class="btn btn-secondary btn-lg" data-billing-action="upgrade" data-plan-id="${plan.id}">${account?.planId === plan.id ? "Current plan" : `Switch to ${plan.name}`}</button>
    </div>
  `).join("");
  return `
    <header class="sec-header">
      <p class="kicker">Billing account</p>
      <h1 class="h1">Manage FastScript access.</h1>
      <p class="lead">Manage paid access without leaving the product. Paddle is the billing boundary; this repo uses a verified local/mock mode until production credentials are configured.</p>
    </header>

    <div class="docs-card-grid">
      <div class="docs-card">
        <p class="docs-card-title">Current state</p>
        <p class="h3">${entitlement.state}</p>
        <p class="docs-card-copy">${entitlement.message}</p>
        <p class="learn-path-note">Plan: ${account?.plan?.name || "None"}</p>
        <div class="cta-actions">
          <button type="button" class="btn btn-primary btn-lg" data-billing-action="open">Open billing portal</button>
          <button type="button" class="btn btn-ghost btn-lg" data-billing-action="cancel">Cancel access</button>
          <button type="button" class="btn btn-ghost btn-lg" data-billing-action="reactivate">Reactivate</button>
        </div>
        <p class="learn-path-note" data-billing-note>Billing actions update the local entitlement model immediately.</p>
      </div>
      <div class="docs-card">
        <p class="docs-card-title">Usage snapshot</p>
        <ul class="prose-list">
          <li>Datasets: ${account?.usageSnapshot?.datasets ?? 0}</li>
          <li>Training jobs: ${account?.usageSnapshot?.trainingJobs ?? 0}</li>
          <li>Eval runs: ${account?.usageSnapshot?.evalRuns ?? 0}</li>
          <li>Deployments: ${account?.usageSnapshot?.modelDeployments ?? 0}</li>
        </ul>
      </div>
    </div>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Upgrade path</p>
        <h2 class="h2">Choose the plan that matches your model team.</h2>
      </header>
      <div class="docs-card-grid">${plansHtml}<div class="docs-card"><p class="kicker">Enterprise</p><p class="h3">Custom</p><p class="docs-card-copy">Private environments, custom governance, and direct founder support.</p><a class="btn btn-secondary btn-lg" href="/enterprise">Talk to sales</a></div></div>
    </section>
  `;
}
export function hydrate({root}) {
  const note = root.querySelector("[data-billing-note]");
  root.querySelectorAll("[data-billing-action]").forEach(button => {
    button.addEventListener("click", async () => {
      const action = button.getAttribute("data-billing-action") || "open";
      const planId = button.getAttribute("data-plan-id") || "team";
      if (note) note.textContent = "Updating billing state...";
      try {
        const res = await fetch("/api/billing/portal", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            action,
            planId
          })
        });
        const payload = await res.json();
        if (!res.ok || !payload.ok) throw new Error("billing");
        if (note) note.textContent = payload.message || "Billing updated.";
        window.setTimeout(() => window.location.reload(), 600);
      } catch (_) {
        if (note) note.textContent = "Billing update failed. Try again.";
      }
    });
  });
}
