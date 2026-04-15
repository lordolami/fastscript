import { listWorkspaceData, requireWorkspaceForUser } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return listWorkspaceData(ctx.db, workspace.id);
}

export default function SettingsPage({ workspace }) {
  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Workspace settings</Text>
        <Heading size="3xl">Update the team workspace defaults.</Heading>
      </Stack>

      <Card pad="5" radius="lg" surface="card" shadow="soft">
        <form class="form-stack" data-settings-form>
          <div class="field-grid">
            <label class="field">
              <span>Workspace name</span>
              <input name="name" value="${workspace.name}" />
            </label>
            <label class="field">
              <span>Industry</span>
              <input name="industry" value="${workspace.industry}" />
            </label>
            <label class="field">
              <span>Timezone</span>
              <input name="timezone" value="${workspace.timezone}" />
            </label>
            <label class="field">
              <span>Notification email</span>
              <input name="notificationEmail" value="${workspace.notificationEmail}" />
            </label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Save settings</button>
            <span class="mini-note" data-settings-msg>Keep workspace metadata inside the same FastScript app boundary.</span>
          </div>
        </form>
      </Card>
    </Stack>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-settings-form]");
  const msg = root.querySelector("[data-settings-msg]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Saving settings...";
    const res = await fetch("/api/workspace-settings", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      msg.textContent = json.reason || "Could not update settings";
      return;
    }
    location.reload();
  });
}
