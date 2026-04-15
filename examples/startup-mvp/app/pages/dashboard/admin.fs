import { listWorkspaceData, requireWorkspaceForUser, summarizeAdmin } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return {
    workspace,
    ...listWorkspaceData(ctx.db, workspace.id),
    admin: summarizeAdmin(ctx.db)
  };
}

export default function AdminPage({ admin, notificationJobs }) {
  const jobs = (notificationJobs || []).map((job) => `
    <div class="list-card">
      <Heading size="md">${job.kind}</Heading>
      <div class="inline-actions">
        <span class="status-pill">${job.status}</span>
        <span class="meta-pill">${job.createdAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Admin / support</Text>
        <Heading size="3xl">Review operational state and queue follow-up jobs.</Heading>
      </Stack>

      <div class="metric-grid">
        <div class="metric-card"><Text tone="muted" size="sm">Workspaces</Text><Heading size="2xl">${admin.totals.workspaces}</Heading></div>
        <div class="metric-card"><Text tone="muted" size="sm">Members</Text><Heading size="2xl">${admin.totals.members}</Heading></div>
        <div class="metric-card"><Text tone="muted" size="sm">Invoices</Text><Heading size="2xl">${admin.totals.invoices}</Heading></div>
        <div class="metric-card"><Text tone="muted" size="sm">Queued jobs</Text><Heading size="2xl">${admin.totals.queuedJobs}</Heading></div>
      </div>

      <Card pad="5" radius="lg" surface="card" shadow="soft">
        <div class="inline-actions">
          <button class="btn-inline" type="button" data-admin-notify>Queue support follow-up</button>
          <span class="mini-note" data-admin-msg>Use this path to exercise admin review and notification replay behavior.</span>
        </div>
      </Card>

      <Stack gap="3">
        <Heading size="xl">Recent jobs</Heading>
        <div class="list-stack">${jobs || `<div class="empty-state">No job rows yet.</div>`}</div>
      </Stack>
    </Stack>
  `;
}

export function hydrate({ root }) {
  const button = root.querySelector("[data-admin-notify]");
  const msg = root.querySelector("[data-admin-msg]");
  if (!button) return;
  button.addEventListener("click", async () => {
    msg.textContent = "Queueing support follow-up...";
    const res = await fetch("/api/notifications/retry", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify({ kind: "support-follow-up" })
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      msg.textContent = json.reason || "Could not queue support follow-up";
      return;
    }
    location.reload();
  });
}
