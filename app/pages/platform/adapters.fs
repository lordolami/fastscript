import {listAdapterRecords} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    adapters: listAdapterRecords(ctx.db)
  };
}
export default function PlatformAdapters({adapters}) {
  return `
    <header class="sec-header"><p class="kicker">Adapters</p><h1 class="h1">Adapter registry</h1><p class="lead">Adapters are tracked as first-class platform objects with recipe and model lineage.</p></header>
    <div class="docs-card-grid">${adapters.map(adapter => `<div class="docs-card"><p class="kicker">${adapter.kind}</p><p class="docs-card-title">${adapter.id}</p><p class="docs-card-copy">${adapter.status} - ${adapter.createdAt}</p></div>`).join("")}</div>
  `;
}
