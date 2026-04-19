import {listCostRecords} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    costs: listCostRecords(ctx.db)
  };
}
export default function PlatformCosts({costs}) {
  return `
    <header class="sec-header"><p class="kicker">Costs</p><h1 class="h1">Platform cost records</h1><p class="lead">Training and proof spend stays attached to workspace and workload context.</p></header>
    <div class="docs-card-grid">${costs.map(cost => `<div class="docs-card"><p class="kicker">${cost.category}</p><p class="docs-card-title">$${cost.amountUsd}</p><p class="docs-card-copy">${cost.periodLabel}</p></div>`).join("")}</div>
  `;
}
