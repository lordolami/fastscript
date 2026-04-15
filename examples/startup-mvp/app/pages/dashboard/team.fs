import { listWorkspaceData, requireWorkspaceForUser } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return {
    workspace,
    memberships: listWorkspaceData(ctx.db, workspace.id).memberships
  };
}

export default function TeamPage({ workspace, memberships }) {
  const list = (memberships || []).map((entry) => `
    <div class="list-card">
      <Heading size="md">${entry.email}</Heading>
      <div class="inline-actions">
        <span class="status-pill">${entry.role}</span>
        <span class="meta-pill">${entry.status}</span>
      </div>
    </div>
  `).join("");

  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Team settings</Text>
        <Heading size="3xl">Invite teammates into ${workspace.name}.</Heading>
      </Stack>

      <Card pad="5" radius="lg" surface="card" shadow="soft">
        <form class="form-stack" data-invite-form>
          <div class="field-grid">
            <label class="field">
              <span>Email</span>
              <input name="email" value="ops@northwindlabs.dev" />
            </label>
            <label class="field">
              <span>Role</span>
              <select name="role">
                <option value="member">member</option>
                <option value="manager">manager</option>
                <option value="finance">finance</option>
              </select>
            </label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Send invite</button>
            <span class="mini-note" data-invite-msg>Invites create a membership row and enqueue a notification job.</span>
          </div>
        </form>
      </Card>

      <div class="list-stack">${list}</div>
    </Stack>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-invite-form]");
  const msg = root.querySelector("[data-invite-msg]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Sending invite...";
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      msg.textContent = json.reason || "Could not send invite";
      return;
    }
    location.reload();
  });
}
