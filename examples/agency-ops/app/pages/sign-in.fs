export default function SignIn() {
  return `
    <section class="list-stack">
      <header>
        <p class="detail-label">Internal-first demo sign-in</p>
        <h1>Create an agency and enter the client ops dashboard.</h1>
        <p>This sign-in flow creates an owner session and bootstraps a seeded agency with clients, retainers, invoices, and queued follow-up work.</p>
      </header>

      <section class="form-card">
        <form class="form-stack" data-session-form>
          <div class="field-grid">
            <label class="field">
              <span>Name</span>
              <input name="name" value="Amina Founder" />
            </label>
            <label class="field">
              <span>Email</span>
              <input name="email" value="amina@northstarops.dev" />
            </label>
            <label class="field">
              <span>Agency</span>
              <input name="agencyName" value="Northstar Client Ops" />
            </label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Create agency and continue</button>
            <a class="btn-inline btn-secondary" href="/">Back to product page</a>
          </div>
          <p class="mini-note" data-session-msg>Creates an authenticated owner session plus a seeded agency snapshot.</p>
        </form>
      </section>
    </section>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-session-form]");
  const msg = root.querySelector("[data-session-msg]");
  if (!form || !msg) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Creating agency...";
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body)
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      msg.textContent = json.reason || "Could not create session";
      return;
    }
    location.href = "/dashboard";
  });
}
