import {getPricingPlans, getPublicPricingNarrative, getSellableWebsiteNarrative, renderPlanPrice, resolveEntitlementState} from "../lib/billing.mjs";
export async function load(ctx) {
  return {
    narrative: getPublicPricingNarrative(),
    plans: getPricingPlans(),
    sellable: getSellableWebsiteNarrative(),
    entitlement: resolveEntitlementState(ctx.db, ctx.user)
  };
}
export default function PricingPage({narrative, plans, sellable, entitlement}) {
  const cards = plans.map(plan => `
    <article class="docs-card">
      <p class="kicker">${plan.name}</p>
      <p class="h2">${renderPlanPrice(plan)}</p>
      <p class="docs-card-copy">${plan.audience}</p>
      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">Seats</p><p class="story-cell-copy">${plan.seats || "Custom"}</p></div>
        <div class="story-cell"><p class="story-cell-title">Datasets</p><p class="story-cell-copy">${plan.usageCaps.datasets}</p></div>
        <div class="story-cell"><p class="story-cell-title">Training jobs</p><p class="story-cell-copy">${plan.usageCaps.trainingJobs}</p></div>
        <div class="story-cell"><p class="story-cell-title">Eval runs</p><p class="story-cell-copy">${plan.usageCaps.evalRuns}</p></div>
      </div>
      <ul class="prose-list">${plan.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
      <a class="btn btn-primary btn-lg" href="${plan.id === "enterprise" ? "/enterprise" : `/buy?plan=${plan.id}`}">${plan.id === "enterprise" ? "Talk to sales" : `Buy ${plan.name}`}</a>
    </article>
  `).join("");
  const ycFlow = sellable.ycFlow.map(item => `<div class="story-cell"><p class="story-cell-title">${item.title}</p><p class="story-cell-copy">${item.copy}</p></div>`).join("");
  const buyerValue = sellable.buyerValue.map(item => `<li>${item}</li>`).join("");
  return `
    <header class="sec-header">
      <p class="kicker">${narrative.kicker}</p>
      <h1 class="h1">${narrative.title}</h1>
      <p class="lead">${narrative.copy}</p>
      <p class="learn-path-note">Current access state: ${entitlement.state}. ${entitlement.message}</p>
    </header>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Plans</p>
        <h2 class="h2">Pay for the operator system, not a dashboard skin.</h2>
      </header>
      <div class="docs-card-grid">${cards}</div>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">Why startups pay</p>
        <h2 class="h2">This is what the subscription buys.</h2>
      </header>
      <ul class="prose-list">${buyerValue}</ul>
    </section>

    <section class="docs-syntax">
      <header class="sec-header-sm">
        <p class="kicker">YC readable</p>
        <h2 class="h2">The business model in one screen.</h2>
      </header>
      <div class="story-grid">${ycFlow}</div>
    </section>
  `;
}
