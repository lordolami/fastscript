export default function DashboardLayout({ content, pathname, user }) {
  const links = [
    ["/dashboard", "Overview"],
    ["/dashboard/projects", "Projects"],
    ["/dashboard/team", "Team"],
    ["/dashboard/billing", "Billing"],
    ["/dashboard/settings", "Settings"],
    ["/dashboard/admin", "Admin"],
  ].map(([href, label]) => {
    if (pathname === href) {
      return `
    <a class="workspace-link is-active" href="${href}">${label}</a>
  `;
    }
    return `
    <a class="workspace-link" href="${href}">${label}</a>
  `;
  }).join("");

  return `
    <Screen pad="6" surface="plain">
      <Container>
        <Stack gap="5">
          <div class="topbar-row">
            <div class="saas-chip">Signed in as ${user?.name || "Workspace owner"}</div>
            <button class="btn-inline btn-secondary" type="button" data-signout>Sign out</button>
          </div>
          <div class="workspace-nav">${links}</div>
          ${content}
        </Stack>
      </Container>
    </Screen>
  `;
}

export function hydrate({ root }) {
  const button = root.querySelector("[data-signout]");
  if (!button) return;
  button.addEventListener("click", async () => {
    await fetch("/api/session", { method: "DELETE" });
    location.href = "/";
  });
}
