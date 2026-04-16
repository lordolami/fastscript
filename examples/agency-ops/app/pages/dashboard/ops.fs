import { listAgencyData, requireAgencyForUser, summarizeOps } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return { agency, ...listAgencyData(ctx.db, agency.id), ops: summarizeOps(ctx.db) };
}

function assignmentOptions(memberships, currentId) {
  const options = [`<option value="">Unassigned</option>`];
  for (const member of memberships || []) {
    if (member.status !== "active") continue;
    const selected = currentId === member.id ? " selected" : "";
    options.push(`<option value="${member.id}"${selected}>${member.name || member.email} · ${member.role}</option>`);
  }
  return options.join("");
}

export default function OpsPage({ agency, ops, notificationJobs, invoices, workItems, config, memberships }) {
  const jobs = (notificationJobs || []).map((job) => `
    <div class="list-card">
      <h3>${job.kind}</h3>
      <div class="inline-actions">
        <span class="status-pill">${job.status}</span>
        <span class="meta-pill">${job.createdAt}</span>
      </div>
    </div>
  `).join("");
  const workRows = (workItems || []).slice(0, 6).map((item) => `
    <div class="list-card">
      <h3>${item.title}</h3>
      <p>${item.clientName} · ${item.lane}</p>
      <div class="inline-actions">
        <span class="status-pill">${item.status}</span>
        <span class="meta-pill">${item.priority}</span>
        <span class="meta-pill">${item.dueLabel}</span>
        <span class="meta-pill">${item.assigneeName || "Unassigned"}</span>
      </div>
      <div class="inline-actions">
        <select class="input-inline" data-assign-select data-work-item-id="${item.id}">${assignmentOptions(memberships, item.assigneeMembershipId)}</select>
        <button class="btn-inline btn-secondary" type="button" data-assign-button data-work-item-id="${item.id}">Save assignment</button>
      </div>
    </div>
  `).join("");
  const invoiceRows = (invoices || []).slice(0, 5).map((invoice) => `
    <div class="list-card">
      <h3>${invoice.summary}</h3>
      <div class="inline-actions">
        <span class="status-pill">${invoice.status}</span>
        <span class="meta-pill">$${invoice.total}</span>
        <span class="meta-pill">${invoice.reminderStatus}</span>
      </div>
      <p>${invoice.reminderLabel || "No reminder activity yet."}</p>
      <div class="inline-actions">
        ${invoice.dueAt ? `<span class="meta-pill">Due ${invoice.dueAt}</span>` : ""}
        ${invoice.lastReminderAt ? `<span class="meta-pill">Last reminder ${invoice.lastReminderAt}</span>` : ""}
      </div>
      ${invoice.status !== "paid" ? `
        <div class="inline-actions">
          <button class="btn-inline btn-secondary" type="button" data-invoice-reminder-action="queue" data-invoice-id="${invoice.id}">Queue reminder</button>
          <button class="btn-inline" type="button" data-invoice-reminder-action="${Number(invoice.reminderCount || 0) > 0 ? "resend" : "send"}" data-invoice-id="${invoice.id}">${Number(invoice.reminderCount || 0) > 0 ? "Resend now" : "Send now"}</button>
        </div>
      ` : ""}
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
        <div class="metric-card"><div class="detail-label">Queued reminders</div><h2>${ops.totals.queuedReminderJobs}</h2></div>
        <div class="metric-card"><div class="detail-label">Overdue invoices</div><h2>${ops.totals.overdueInvoices}</h2></div>
        <div class="metric-card"><div class="detail-label">Open work items</div><h2>${ops.totals.openWorkItems}</h2></div>
        <div class="metric-card"><div class="detail-label">Unassigned work</div><h2>${ops.totals.unassignedWorkItems}</h2></div>
      </div>

      <section class="form-card">
        <form class="list-stack" data-work-item-form>
          <div class="inline-actions">
            <input class="input-inline" name="title" placeholder="Queue a delivery item" />
            <input class="input-inline" name="clientName" placeholder="Client name" />
            <select class="input-inline" name="priority">
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
              <option value="low">Low priority</option>
            </select>
            <select class="input-inline" name="assigneeMembershipId">
              <option value="">Assign later</option>
              ${assignmentOptions(memberships, "")}
            </select>
            <button class="btn-inline" type="submit">Add work item</button>
          </div>
        </form>
        <div class="inline-actions">
          <button class="btn-inline btn-secondary" type="button" data-ops-notify>Queue support follow-up</button>
          <span class="mini-note" data-ops-msg>Support email: ${config?.supportEmail || "ops@agencyops.local"} · Notify from: ${config?.notifyFrom || "notifications@agencyops.local"}</span>
        </div>
      </section>

      <div class="info-grid">
        <section class="list-stack">
          <h2>Delivery queue</h2>
          <div class="list-stack">${workRows || `<div class="empty-state">No work items yet.</div>`}</div>
        </section>
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
  function createJsonHeaders() {
    const headers = { "content-type": "application/json", accept: "application/json" };
    const cookie = String(document.cookie || "").split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("fs_csrf="));
    if (cookie) headers["x-csrf-token"] = cookie.slice("fs_csrf=".length);
    return headers;
  }

  const button = root.querySelector("[data-ops-notify]");
  const msg = root.querySelector("[data-ops-msg]");
  const form = root.querySelector("[data-work-item-form]");

  if (form && msg) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      msg.textContent = "Adding delivery item...";
      const response = await fetch("/api/work-items", {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({
          title: String(formData.get("title") || ""),
          clientName: String(formData.get("clientName") || ""),
          priority: String(formData.get("priority") || "medium"),
          assigneeMembershipId: String(formData.get("assigneeMembershipId") || "")
        })
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        msg.textContent = json.reason || "Could not add work item";
        return;
      }
      location.reload();
    });
  }

  for (const button of root.querySelectorAll("[data-assign-button]")) {
    button.addEventListener("click", async () => {
      const workItemId = button.getAttribute("data-work-item-id") || "";
      const select = root.querySelector(`[data-assign-select][data-work-item-id="${workItemId}"]`);
      msg.textContent = "Saving assignment...";
      const response = await fetch("/api/work-items", {
        method: "PATCH",
        headers: createJsonHeaders(),
        body: JSON.stringify({
          workItemId,
          assigneeMembershipId: select?.value || ""
        })
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        msg.textContent = json.reason || "Could not save assignment";
        return;
      }
      location.reload();
    });
  }

  for (const button of root.querySelectorAll("[data-invoice-reminder-action]")) {
    button.addEventListener("click", async () => {
      msg.textContent = "Updating invoice reminder...";
      const response = await fetch("/api/billing/reminders", {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({
          invoiceId: button.getAttribute("data-invoice-id") || "",
          action: button.getAttribute("data-invoice-reminder-action") || "queue"
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

  if (!button || !msg) return;
  button.addEventListener("click", async () => {
    msg.textContent = "Queueing support follow-up...";
    const response = await fetch("/api/notifications/retry", {
      method: "POST",
      headers: createJsonHeaders(),
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
