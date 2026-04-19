import {listCommandHistory} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    commands: listCommandHistory(ctx.db)
  };
}
export default function PlatformCommands({commands}) {
  return `
    <header class="sec-header"><p class="kicker">Commands</p><h1 class="h1">Grounded command history</h1><p class="lead">Commands answer from stored datasets, evals, models, and readiness objects instead of detached summaries.</p></header>
    <div class="docs-card-grid">${commands.map(entry => `<div class="docs-card"><p class="kicker">${entry.createdAt}</p><p class="docs-card-title">${entry.headline}</p><p class="docs-card-copy">${(entry.items || []).join(" - ")}</p></div>`).join("")}</div>
  `;
}
