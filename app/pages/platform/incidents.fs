import {listIncidentRecords} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    incidents: listIncidentRecords(ctx.db)
  };
}
export default function PlatformIncidents({incidents}) {
  return `
    <header class="sec-header"><p class="kicker">Incidents</p><h1 class="h1">Incident monitoring</h1><p class="lead">Live regressions and rollout issues remain visible next to proof and deployment state.</p></header>
    <div class="docs-card-grid">${incidents.map(incident => `<div class="docs-card"><p class="kicker">${incident.severity}</p><p class="docs-card-title">${incident.summary}</p><p class="docs-card-copy">${incident.status}</p></div>`).join("")}</div>
  `;
}
