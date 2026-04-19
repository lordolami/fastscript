import {listWorkspaces, getWorkspaceSnapshot} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  const workspaces = listWorkspaces(ctx.db).map(workspace => getWorkspaceSnapshot(ctx.db, workspace.id));
  return {
    workspaces
  };
}
export default function PlatformWorkspaces({workspaces}) {
  return `
    <header class="sec-header"><p class="kicker">Workspaces</p><h1 class="h1">Workspace and organization scope</h1><p class="lead">Datasets, experiments, models, audit, incidents, and costs are now grouped into real workspace snapshots.</p></header>
    <div class="docs-card-grid">${workspaces.map(entry => `<div class="docs-card"><p class="kicker">${entry.workspace.role}</p><p class="docs-card-title">${entry.workspace.name}</p><p class="docs-card-copy">${entry.workspace.summary}</p><p class="learn-path-note">${entry.members.length} members - ${entry.datasets.length} datasets - ${entry.models.length} models</p></div>`).join("")}</div>
  `;
}
