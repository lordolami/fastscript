import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return listAgencyData(ctx.db, agency.id);
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function BillingPage({ agency, plans, subscription, invoices }) {
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
      <h3>${invoice.summary}</h3>
      <div class="inline-actions">
        <span class="status-pill">${invoice.status}</span>
        <span class="meta-pill">${formatMoney(invoice.total)}</span>
        <span class="meta-pill">${invoice.issuedAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Billing</p>
        <h1>${agency.name} plan control and invoice trail.</h1>
        <p>Select a plan, issue invoices, and queue billing follow-up without leaving the app boundary.</p>
      </header>

      <div class="record-grid">${planCards}</div>

      <section class="form-card">
        <div class="inline-actions">
          <span class="mini-note" data-billing-msg>Current plan: ${subscription?.planName || "none"}</span>
          <button class="btn-inline btn-secondary" type="button" data-notify>Queue billing follow-up</button>
        </div>
      </section>

      <section class="list-stack">
        <h2>Recent invoices</h2>
        <div class="list-stack">${invoiceList || `<div class="empty-state">No invoices yet.</div>`}</div>
      </section>
    </section>
  `;
}

export function hydrate({ root }) {
  const msg = root.querySelector("[data-billing-msg]");
  for (const button of root.querySelectorAll("[data-plan]")) {
    button.addEventListener("click", async () => {
      msg.textContent = "Upgrading plan...";
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
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
  const notify = root.querySelector("[data-notify]");
  if (!notify || !msg) return;
  notify.addEventListener("click", async () => {
    msg.textContent = "Queueing billing follow-up...";
    const response = await fetch("/api/notifications/retry", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
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
