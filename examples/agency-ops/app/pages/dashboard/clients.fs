import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return { agency, clients: listAgencyData(ctx.db, agency.id).clients };
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function ClientsPage({ agency, clients }) {
  const rows = (clients || []).map((client) => `
    <div class="list-card">
      <div class="detail-label">${client.engagement}</div>
      <h3>${client.name}</h3>
      <p>${client.nextStep}</p>
      <div class="inline-actions">
        <span class="status-pill">${client.status}</span>
        <span class="meta-pill">${formatMoney(client.monthlyRetainer)} / mo</span>
        <span class="meta-pill">Updated ${client.updatedAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Clients</p>
        <h1>Manage clients and engagements inside ${agency.name}.</h1>
      </header>

      <section class="form-card">
        <form class="form-stack" data-client-form>
          <div class="field-grid">
            <label class="field"><span>Client name</span><input name="name" value="Harbor Commerce" /></label>
            <label class="field"><span>Engagement</span><input name="engagement" value="Retention retainer" /></label>
            <label class="field"><span>Status</span><select name="status"><option value="active">active</option><option value="onboarding">onboarding</option><option value="proposal">proposal</option></select></label>
            <label class="field"><span>Monthly retainer</span><input name="monthlyRetainer" value="2600" /></label>
          </div>
          <label class="field"><span>Next step</span><input name="nextStep" value="Send lifecycle dashboard and kickoff notes" /></label>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Create client</button>
            <span class="mini-note" data-client-msg>Add a client and engagement record to the agency snapshot.</span>
          </div>
        </form>
      </section>

      <div class="list-stack">${rows}</div>
    </section>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-client-form]");
  const msg = root.querySelector("[data-client-msg]");
  if (!form || !msg) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Creating client...";
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body)
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not create client";
      return;
    }
    location.reload();
  });
}
