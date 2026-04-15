import { listAgencyData, requireAgencyForUser } from "../../lib/agency.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { agency } = requireAgencyForUser(ctx.db, user);
  return listAgencyData(ctx.db, agency.id);
}

export default function SettingsPage({ agency, config }) {
  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Settings</p>
        <h1>Update the agency operating defaults.</h1>
      </header>

      <section class="form-card">
        <form class="form-stack" data-settings-form>
          <div class="field-grid">
            <label class="field"><span>Agency name</span><input name="name" value="${agency.name}" /></label>
            <label class="field"><span>Specialty</span><input name="specialty" value="${agency.specialty}" /></label>
            <label class="field"><span>Timezone</span><input name="timezone" value="${agency.timezone}" /></label>
            <label class="field"><span>Contact email</span><input name="contactEmail" value="${agency.contactEmail}" /></label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Save settings</button>
            <span class="mini-note" data-settings-msg>Keep agency metadata inside the same FastScript app boundary.</span>
          </div>
        </form>
      </section>

      <section class="list-card">
        <h2>Cloudflare runtime config</h2>
        <div class="detail-list">
          <div><div class="detail-label">App name</div><div class="detail-value">${config.appName}</div></div>
          <div><div class="detail-label">Support email</div><div class="detail-value">${config.supportEmail}</div></div>
          <div><div class="detail-label">Notify from</div><div class="detail-value">${config.notifyFrom}</div></div>
          <div><div class="detail-label">Primary region</div><div class="detail-value">${config.primaryRegion}</div></div>
        </div>
        <p class="mini-note">These values come from the app env schema and Cloudflare-friendly env vars, so the same app can move from local proof to internal deployment without rewriting route code.</p>
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

  const form = root.querySelector("[data-settings-form]");
  const msg = root.querySelector("[data-settings-msg]");
  if (!form || !msg) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Saving settings...";
    const response = await fetch("/api/agency-settings", {
      method: "POST",
      headers: createJsonHeaders(),
      body: JSON.stringify(body)
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not update settings";
      return;
    }
    location.reload();
  });
}
