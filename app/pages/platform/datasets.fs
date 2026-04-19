import {listDatasets} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    datasets: listDatasets(ctx.db)
  };
}
export default function PlatformDatasets({datasets}) {
  return `
    <header class="sec-header">
      <p class="kicker">Datasets</p>
      <h1 class="h1">Dataset registry and lineage</h1>
      <p class="lead">Datasets are now first-class platform objects with versions, transforms, quality reports, and navigable provenance.</p>
    </header>
    <div class="docs-card-grid">
      ${datasets.map(dataset => `<div class="docs-card"><p class="kicker">${dataset.status}</p><p class="docs-card-title">${dataset.name}</p><p class="docs-card-copy">${dataset.description}</p><p class="learn-path-note">Quality: ${Math.round(Number(dataset.quality?.score || 0) * 100)}%</p><a class="docs-card-link" href="/platform/datasets/${dataset.id}">Open dataset &#8594;</a></div>`).join("")}
    </div>
  `;
}
