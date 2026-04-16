import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return listAgencyData(ctx.db, agency.id);
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function reminderActions(invoice) {
  if (invoice.status === "paid") return "";
  const sendLabel = Number(invoice.reminderCount || 0) > 0 ? "Resend now" : "Send now";
  return `
    <div class="inline-actions">
      <button class="btn-inline btn-secondary" type="button" data-reminder-action="queue" data-invoice-id="${invoice.id}">Queue reminder</button>
      <button class="btn-inline" type="button" data-reminder-action="${Number(invoice.reminderCount || 0) > 0 ? "resend" : "send"}" data-invoice-id="${invoice.id}">${sendLabel}</button>
    </div>
  `;
}

export default function BillingPage({ agency, plans, subscription, invoices, reminderJobs, metrics }) {
  const planCards = (plans || []).map((plan) => `
    <div class="list-card">
      <div class="detail-label">${plan.support}</div>
      <h3>${plan.name}</h3>
      <p>${formatMoney(plan.price)} / month · ${plan.seats} seats</p>
      <div class="inline-actions">
        <button class="btn-inline" type="button" data-plan="${plan.id}">Choose plan</button>
        ${subscription?.planId === plan.id ? `<span class="status-pill">current</span>` : ""}
      </div>
    </div>
  `).join("");

  const invoiceList = (invoices || []).map((invoice) => `
    <div class="list-card">
      <div class="detail-label">${invoice.dueAt ? `Due ${invoice.dueAt}` : "Invoice"}</div>
      <h3>${invoice.summary}</h3>
      <div class="inline-actions">
        <span class="status-pill">${invoice.status}</span>
        <span class="meta-pill">${formatMoney(invoice.total)}</span>
        <span class="meta-pill">${invoice.reminderStatus}</span>
      </div>
      <p>${invoice.reminderLabel || "No reminder activity yet."}</p>
      <div class="inline-actions">
        ${invoice.lastReminderAt ? `<span class="meta-pill">Last reminder ${invoice.lastReminderAt}</span>` : ""}
        ${invoice.nextReminderAt ? `<span class="meta-pill">Next reminder ${invoice.nextReminderAt}</span>` : ""}
        <span class="meta-pill">${invoice.reminderCount || 0} sent</span>
      </div>
      ${reminderActions(invoice)}
    </div>
  `).join("");

  const reminderHistory = (reminderJobs || []).slice(0, 6).map((job) => `
    <div class="list-card">
      <h3>${job.payload?.invoiceSummary || "Invoice reminder"}</h3>
      <div class="inline-actions">
        <span class="status-pill">${job.status}</span>
        <span class="meta-pill">${job.payload?.mode || "queue"}</span>
        <span class="meta-pill">${job.deliveredAt || job.createdAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Billing</p>
        <h1>${agency.name} plan control, invoice trail, and reminder coverage.</h1>
        <p>Select a plan, track due and overdue invoices, and run reminder follow-up without leaving the app boundary.</p>
      </header>

      <div class="metric-grid">
        <div class="metric-card"><div class="detail-label">Due invoices</div><h2>${metrics.dueInvoices}</h2></div>
        <div class="metric-card"><div class="detail-label">Overdue invoices</div><h2>${metrics.overdueInvoices}</h2></div>
        <div class="metric-card"><div class="detail-label">Queued reminders</div><h2>${metrics.queuedReminders}</h2></div>
      </div>

      <div class="record-grid">${planCards}</div>

      <section class="form-card">
        <div class="inline-actions">
          <span class="mini-note" data-billing-msg>Current plan: ${subscription?.planName || "none"} · Reminder coverage tracks due and overdue invoices.</span>
          <button class="btn-inline btn-secondary" type="button" data-notify>Queue billing follow-up</button>
        </div>
      </section>

      <section class="list-stack">
        <h2>Invoice reminders</h2>
        <div class="list-stack">${invoiceList || `<div class="empty-state">No invoices yet.</div>`}</div>
      </section>

      <section class="list-stack">
        <h2>Reminder history</h2>
        <div class="list-stack">${reminderHistory || `<div class="empty-state">No reminder history yet.</div>`}</div>
      </section>
    </section>
  `;
}

export function hydrate({ root }) {
  function createJsonHeaders() {
    const headers = { "content-type": "application/json", accept: "application/json" };
    const cookie = String(document.cookie || "").split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("fs_csrf="));
    if (cookie) headers["x-csrf-token"] = cookie.slice("fs_csrf=".length);
    return headers;
  }

  const msg = root.querySelector("[data-billing-msg]");
  for (const button of root.querySelectorAll("[data-plan]")) {
    button.addEventListener("click", async () => {
      msg.textContent = "Upgrading plan...";
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({ planId: button.getAttribute("data-plan") })
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        msg.textContent = json.reason || "Could not upgrade plan";
        return;
      }
      location.reload();
    });
  }
  for (const button of root.querySelectorAll("[data-reminder-action]")) {
    button.addEventListener("click", async () => {
      msg.textContent = `Running ${button.getAttribute("data-reminder-action")}...`;
      const response = await fetch("/api/billing/reminders", {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({
          invoiceId: button.getAttribute("data-invoice-id"),
          action: button.getAttribute("data-reminder-action")
        })
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        msg.textContent = json.reason || "Could not update reminder";
        return;
      }
      location.reload();
    });
  }
  const notify = root.querySelector("[data-notify]");
  if (!notify || !msg) return;
  notify.addEventListener("click", async () => {
    msg.textContent = "Queueing billing follow-up...";
    const response = await fetch("/api/notifications/retry", {
      method: "POST",
      headers: createJsonHeaders(),
      body: JSON.stringify({ kind: "billing-follow-up" })
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not queue notification";
      return;
    }
    location.reload();
  });
}
