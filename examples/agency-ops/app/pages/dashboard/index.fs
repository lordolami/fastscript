import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return { user, ...listAgencyData(ctx.db, agency.id) };
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function DashboardOverview({ user, agency, metrics, activities, subscription, workload }) {
  const activityItems = (activities || []).slice(0, 5).map((item) => `
    <div class="event-card">
      <div class="detail-label">${item.type}</div>
      <h3>${item.message}</h3>
      <p>${item.createdAt}</p>
    </div>
  `).join("");
  const workloadItems = (workload || []).slice(0, 3).map((item) => `
    <div class="list-card">
      <h3>${item.name}</h3>
      <div class="inline-actions">
        <span class="status-pill">${item.role}</span>
        <span class="meta-pill">${item.assignedCount} assigned</span>
        <span class="meta-pill">${item.atRiskCount} at risk</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Agency overview</p>
        <h1>${agency.name}</h1>
        <p>${user.name}, this agency is on the ${subscription?.planName || "Starter"} plan and is tracking client delivery, retainers, billing, and ops follow-up inside one FastScript runtime.</p>
      </header>

      <div class="metric-grid">
        <div class="metric-card"><div class="detail-label">Active clients</div><h2>${metrics.activeClients}</h2></div>
        <div class="metric-card"><div class="detail-label">Retainers</div><h2>${metrics.retainers}</h2></div>
        <div class="metric-card"><div class="detail-label">Monthly retainers</div><h2>${formatMoney(metrics.monthlyRetainers)}</h2></div>
        <div class="metric-card"><div class="detail-label">Queued follow-ups</div><h2>${metrics.queuedJobs}</h2></div>
        <div class="metric-card"><div class="detail-label">Open delivery items</div><h2>${metrics.activeWorkItems}</h2></div>
        <div class="metric-card"><div class="detail-label">At-risk work</div><h2>${metrics.atRiskWorkItems}</h2></div>
        <div class="metric-card"><div class="detail-label">Unassigned work</div><h2>${metrics.unassignedWorkItems}</h2></div>
      </div>

      <div class="info-grid">
        <section class="list-card">
          <h3>Core workflows</h3>
          <div class="detail-list">
            <div><div class="detail-label">Clients</div><div class="detail-value">Track retainers, onboarding work, and next steps</div></div>
            <div><div class="detail-label">Team</div><div class="detail-value">Invite operators, strategists, and finance roles</div></div>
            <div><div class="detail-label">Billing</div><div class="detail-value">Upgrade plans and keep invoice trails visible</div></div>
            <div><div class="detail-label">Ops</div><div class="detail-value">Review queued jobs, assignments, and support follow-up state</div></div>
            <div><div class="detail-label">Delivery queue</div><div class="detail-value">Track at-risk work items, due labels, assignees, and internal handoffs</div></div>
          </div>
        </section>
        <section class="list-card">
          <h3>Agency settings</h3>
          <div class="detail-list">
            <div><div class="detail-label">Specialty</div><div class="detail-value">${agency.specialty}</div></div>
            <div><div class="detail-label">Timezone</div><div class="detail-value">${agency.timezone}</div></div>
            <div><div class="detail-label">Contact</div><div class="detail-value">${agency.contactEmail}</div></div>
          </div>
        </section>
      </div>

      <section class="list-stack">
        <h2>Operator workload snapshot</h2>
        <div class="list-stack">${workloadItems || `<div class="empty-state">No active workload yet.</div>`}</div>
      </section>

      <section class="list-stack">
        <h2>Recent activity</h2>
        <div class="event-feed">${activityItems || `<div class="empty-state">No activity yet.</div>`}</div>
      </section>
    </section>
  `;
}
