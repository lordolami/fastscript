import {listAuditEvents} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    events: listAuditEvents(ctx.db)
  };
}
export default function PlatformAudit({events}) {
  return `
    <header class="sec-header"><p class="kicker">Audit</p><h1 class="h1">Audit trail</h1><p class="lead">Operational and proof-sensitive actions are recorded in a platform-visible audit stream.</p></header>
    <div class="docs-card-grid">${events.map(event => `<div class="docs-card"><p class="kicker">${event.action}</p><p class="docs-card-title">${event.actor}</p><p class="docs-card-copy">${event.subjectType} ${event.subjectId}</p></div>`).join("")}</div>
  `;
}
