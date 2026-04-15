import { listWorkspaceData, requireWorkspaceForUser } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return listWorkspaceData(ctx.db, workspace.id);
}

export default function BillingPage({ workspace, plans, subscription, invoices }) {
  const planCards = (plans || []).map((plan) => `
    <div class="list-card">
      <Text tone="muted" size="sm">${plan.support}</Text>
      <Heading size="lg">${plan.name}</Heading>
      <Text tone="muted">$${plan.price} / month • ${plan.seats} seats</Text>
      <div class="inline-actions">
        <button class="btn-inline" type="button" data-plan="${plan.id}">Choose plan</button>
        ${subscription?.planId === plan.id ? `<span class="status-pill">current</span>` : ""}
      </div>
    </div>
  `).join("");
  const invoiceList = (invoices || []).map((invoice) => `
    <div class="list-card">
      <Heading size="md">${invoice.id}</Heading>
      <div class="inline-actions">
        <span class="status-pill">${invoice.status}</span>
        <span class="meta-pill">$${invoice.total}</span>
        <span class="meta-pill">${invoice.issuedAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Billing</Text>
        <Heading size="3xl">${workspace.name} billing and plan control.</Heading>
        <Text tone="muted" size="lg">Choose a plan, issue an invoice, and enqueue receipt/notification jobs without leaving the app boundary.</Text>
      </Stack>

      <div class="record-grid">${planCards}</div>

      <Card pad="5" radius="lg" surface="card" shadow="soft">
        <div class="inline-actions">
          <span class="mini-note" data-billing-msg>Current plan: ${subscription?.planName || "none"}</span>
          <button class="btn-inline btn-secondary" type="button" data-notify>Trigger manual billing notification</button>
        </div>
      </Card>

      <Stack gap="3">
        <Heading size="xl">Recent invoices</Heading>
        <div class="list-stack">${invoiceList || `<div class="empty-state">No invoices yet.</div>`}</div>
      </Stack>
    </Stack>
  `;
}

export function hydrate({ root }) {
  const msg = root.querySelector("[data-billing-msg]");
  for (const button of root.querySelectorAll("[data-plan]")) {
    button.addEventListener("click", async () => {
      msg.textContent = "Upgrading plan...";
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", "accept": "application/json" },
        body: JSON.stringify({ planId: button.getAttribute("data-plan") })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        msg.textContent = json.reason || "Could not upgrade plan";
        return;
      }
      location.reload();
    });
  }
  const notify = root.querySelector("[data-notify]");
  if (notify) {
    notify.addEventListener("click", async () => {
      msg.textContent = "Queueing notification...";
      const res = await fetch("/api/notifications/retry", {
        method: "POST",
        headers: { "content-type": "application/json", "accept": "application/json" },
        body: JSON.stringify({ kind: "billing-follow-up" })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        msg.textContent = json.reason || "Could not queue notification";
        return;
      }
      location.reload();
    });
  }
}
