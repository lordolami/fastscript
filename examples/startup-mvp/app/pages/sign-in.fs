export default function SignIn() {
  return `
    <Screen pad="6" surface="panel">
      <Container>
        <Stack gap="5">
          <Stack gap="2">
            <Text tone="primary" size="sm" weight="semibold">Demo sign-in</Text>
            <Heading size="3xl">Create a workspace and enter the dashboard.</Heading>
            <Text tone="muted" size="lg">This sign-in flow creates an owner session and bootstraps a real workspace so the rest of the SaaS app starts with meaningful data.</Text>
          </Stack>

          <Card pad="5" radius="lg" surface="card" shadow="soft">
            <form class="form-stack" data-session-form>
              <div class="field-grid">
                <label class="field">
                  <span>Name</span>
                  <input name="name" value="Amina Founder" />
                </label>
                <label class="field">
                  <span>Email</span>
                  <input name="email" value="amina@acmeops.dev" />
                </label>
                <label class="field">
                  <span>Workspace</span>
                  <input name="workspaceName" value="Acme Ops" />
                </label>
              </div>
              <div class="inline-actions">
                <button class="btn-inline" type="submit">Create workspace and continue</button>
                <a class="btn-inline btn-secondary" href="/">Back to marketing page</a>
              </div>
              <p class="mini-note" data-session-msg>Creates an authenticated owner session plus a seeded workspace.</p>
            </form>
          </Card>
        </Stack>
      </Container>
    </Screen>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-session-form]");
  const msg = root.querySelector("[data-session-msg]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    msg.textContent = "Creating workspace...";
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      msg.textContent = json.reason || "Could not create session";
      return;
    }
    location.href = "/dashboard";
  });
}
