import { listWorkspaceData, requireWorkspaceForUser } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return {
    user,
    ...listWorkspaceData(ctx.db, workspace.id)
  };
}

export default function DashboardOverview({ user, workspace, metrics, activities, subscription }) {
  const activityItems = (activities || []).slice(0, 5).map((item) => `
    <div class="event-card">
      <Text tone="muted" size="sm">${item.type}</Text>
      <Heading size="md">${item.message}</Heading>
      <Text tone="muted">${item.createdAt}</Text>
    </div>
  `).join("");

  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Workspace overview</Text>
        <Heading size="3xl">${workspace.name}</Heading>
        <Text tone="muted" size="lg">${user.name}, this workspace is using the ${subscription?.planName || "Starter"} plan and tracking active delivery, billing, and team activity inside one FastScript runtime.</Text>
      </Stack>

      <div class="metric-grid">
        <div class="metric-card">
          <Text tone="muted" size="sm">Active projects</Text>
          <Heading size="2xl">${metrics.activeProjects}</Heading>
        </div>
        <div class="metric-card">
          <Text tone="muted" size="sm">Team members</Text>
          <Heading size="2xl">${metrics.members}</Heading>
        </div>
        <div class="metric-card">
          <Text tone="muted" size="sm">Monthly revenue</Text>
          <Heading size="2xl">$${metrics.monthlyRevenue}</Heading>
        </div>
        <div class="metric-card">
          <Text tone="muted" size="sm">Queued jobs</Text>
          <Heading size="2xl">${metrics.queuedJobs}</Heading>
        </div>
      </div>

      <div class="info-grid">
        <div class="list-card">
          <Heading size="lg">Primary flows</Heading>
          <div class="detail-list">
            <div><div class="detail-label">Projects</div><div class="detail-value">Create and manage work items</div></div>
            <div><div class="detail-label">Team</div><div class="detail-value">Invite and track members</div></div>
            <div><div class="detail-label">Billing</div><div class="detail-value">Upgrade plans and issue invoices</div></div>
            <div><div class="detail-label">Admin</div><div class="detail-value">Review jobs and support state</div></div>
          </div>
        </div>
        <div class="list-card">
          <Heading size="lg">Workspace settings</Heading>
          <div class="detail-list">
            <div><div class="detail-label">Industry</div><div class="detail-value">${workspace.industry}</div></div>
            <div><div class="detail-label">Timezone</div><div class="detail-value">${workspace.timezone}</div></div>
            <div><div class="detail-label">Notification email</div><div class="detail-value">${workspace.notificationEmail}</div></div>
          </div>
        </div>
      </div>

      <Stack gap="3">
        <Heading size="xl">Recent activity</Heading>
        <div class="event-feed">${activityItems || `<div class="empty-state">No activity yet.</div>`}</div>
      </Stack>
    </Stack>
  `;
}
