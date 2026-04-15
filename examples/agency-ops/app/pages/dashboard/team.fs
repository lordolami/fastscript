import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  const snapshot = listAgencyData(ctx.db, agency.id);
  return { agency, memberships: snapshot.memberships, workload: snapshot.workload, metrics: snapshot.metrics };
}

export default function TeamPage({ agency, memberships, workload, metrics }) {
  const list = (memberships || []).map((entry) => `
    <div class="list-card">
      <h3>${entry.name || entry.email}</h3>
      <p>${entry.email}</p>
      <div class="inline-actions">
        <span class="status-pill">${entry.role}</span>
        <span class="meta-pill">${entry.status}</span>
      </div>
    </div>
  `).join("");
  const workloadRows = (workload || []).map((entry) => `
    <div class="list-card">
      <h3>${entry.name}</h3>
      <div class="inline-actions">
        <span class="status-pill">${entry.role}</span>
        <span class="meta-pill">${entry.assignedCount} assigned</span>
        <span class="meta-pill">${entry.atRiskCount} at risk</span>
        <span class="meta-pill">${entry.queuedCount} queued</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Team</p>
        <h1>Invite client ops teammates into ${agency.name}.</h1>
        <p>${metrics.unassignedWorkItems} unassigned work item(s) currently need an owner, so this page doubles as the workload control panel.</p>
      </header>

      <section class="form-card">
        <form class="form-stack" data-invite-form>
          <div class="field-grid">
            <label class="field"><span>Name</span><input name="name" value="Maya Operator" /></label>
            <label class="field"><span>Email</span><input name="email" value="ops@harborcommerce.dev" /></label>
            <label class="field"><span>Role</span><select name="role"><option value="strategist">strategist</option><option value="operator">operator</option><option value="finance">finance</option></select></label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Send invite</button>
            <span class="mini-note" data-invite-msg>Creates a membership row and queues a team invite notification.</span>
          </div>
        </form>
      </section>

      <section class="list-stack">
        <h2>Operator workload</h2>
        <div class="list-stack">${workloadRows || `<div class="empty-state">No active operators yet.</div>`}</div>
      </section>

      <section class="list-stack">
        <h2>Team roster</h2>
        <div class="list-stack">${list}</div>
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
  const form = root.querySelector("[data-invite-form]");
  const msg = root.querySelector("[data-invite-msg]");
  if (!form || !msg) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Sending invite...";
    const response = await fetch("/api/members", {
      method: "POST",
      headers: createJsonHeaders(),
      body: JSON.stringify(body)
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not send invite";
      return;
    }
    location.reload();
  });
}
