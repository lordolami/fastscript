import { listAgencyData, requireAgencyForUser, summarizeOps } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return { agency, ...listAgencyData(ctx.db, agency.id), ops: summarizeOps(ctx.db) };
}

export default function OpsPage({ agency, ops, notificationJobs, invoices }) {
  const jobs = (notificationJobs || []).map((job) => `
    <div class="list-card">
      <h3>${job.kind}</h3>
      <div class="inline-actions">
        <span class="status-pill">${job.status}</span>
        <span class="meta-pill">${job.createdAt}</span>
      </div>
    </div>
  `).join("");
  const invoiceRows = (invoices || []).slice(0, 5).map((invoice) => `
    <div class="list-card">
      <h3>${invoice.summary}</h3>
      <div class="inline-actions">
        <span class="status-pill">${invoice.status}</span>
        <span class="meta-pill">$${invoice.total}</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Ops</p>
        <h1>Review delivery, billing, and support follow-up for ${agency.name}.</h1>
      </header>

      <div class="metric-grid">
        <div class="metric-card"><div class="detail-label">Agencies</div><h2>${ops.totals.agencies}</h2></div>
        <div class="metric-card"><div class="detail-label">Clients</div><h2>${ops.totals.clients}</h2></div>
        <div class="metric-card"><div class="detail-label">Invoices</div><h2>${ops.totals.invoices}</h2></div>
        <div class="metric-card"><div class="detail-label">Queued jobs</div><h2>${ops.totals.queuedJobs}</h2></div>
      </div>

      <section class="form-card">
        <div class="inline-actions">
          <button class="btn-inline" type="button" data-ops-notify>Queue support follow-up</button>
          <span class="mini-note" data-ops-msg>Use this to exercise ops review and notification replay behavior.</span>
        </div>
      </section>

      <div class="info-grid">
        <section class="list-stack">
          <h2>Recent jobs</h2>
          <div class="list-stack">${jobs || `<div class="empty-state">No job rows yet.</div>`}</div>
        </section>
        <section class="list-stack">
          <h2>Invoice trail</h2>
          <div class="list-stack">${invoiceRows || `<div class="empty-state">No invoices yet.</div>`}</div>
        </section>
      </div>
    </section>
  `;
}

export function hydrate({ root }) {
  const button = root.querySelector("[data-ops-notify]");
  const msg = root.querySelector("[data-ops-msg]");
  if (!button || !msg) return;
  button.addEventListener("click", async () => {
    msg.textContent = "Queueing support follow-up...";
    const response = await fetch("/api/notifications/retry", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ kind: "support-follow-up" })
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not queue support follow-up";
      return;
    }
    location.reload();
  });
}
