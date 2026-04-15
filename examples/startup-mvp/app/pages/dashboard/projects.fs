import { listWorkspaceData, requireWorkspaceForUser } from "../../lib/saas.fs";

export async function load(ctx) {
  const user = ctx.user || ctx.auth.requireUser();
  const { workspace } = requireWorkspaceForUser(ctx.db, user);
  return {
    workspace,
    projects: listWorkspaceData(ctx.db, workspace.id).projects
  };
}

export default function ProjectsPage({ workspace, projects }) {
  const rows = (projects || []).map((project) => `
    <div class="list-card">
      <Text tone="muted" size="sm">${project.client}</Text>
      <Heading size="lg">${project.name}</Heading>
      <div class="inline-actions">
        <span class="status-pill">${project.status}</span>
        <span class="meta-pill">Updated ${project.updatedAt}</span>
      </div>
    </div>
  `).join("");

  return `
    <Stack gap="5">
      <Stack gap="2">
        <Text tone="primary" size="sm" weight="semibold">Projects</Text>
        <Heading size="3xl">Track delivery inside ${workspace.name}.</Heading>
      </Stack>

      <Card pad="5" radius="lg" surface="card" shadow="soft">
        <form class="form-stack" data-project-form>
          <div class="field-grid">
            <label class="field">
              <span>Project name</span>
              <input name="name" value="Customer health rollout" />
            </label>
            <label class="field">
              <span>Client</span>
              <input name="client" value="Northwind Labs" />
            </label>
            <label class="field">
              <span>Status</span>
              <select name="status">
                <option value="active">active</option>
                <option value="planning">planning</option>
                <option value="blocked">blocked</option>
              </select>
            </label>
          </div>
          <div class="inline-actions">
            <button class="btn-inline" type="submit">Create project</button>
            <span class="mini-note" data-project-msg>Add a new core record to the workspace.</span>
          </div>
        </form>
      </Card>

      <div class="list-stack">${rows}</div>
    </Stack>
  `;
}

export function hydrate({ root }) {
  const form = root.querySelector("[data-project-form]");
  const msg = root.querySelector("[data-project-msg]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "Creating project...";
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      msg.textContent = json.reason || "Could not create project";
      return;
    }
    location.reload();
  });
}
