function navLink(pathname, href, label) {
  if (pathname === href) {
    return `<a class="agency-link is-active" href="${href}">${label}</a>`;
  }
  return `<a class="agency-link" href="${href}">${label}</a>`;
}

export default function DashboardLayout({ content, pathname, user }) {
  return `
    <section class="list-stack">
      <div class="topbar-row">
        <div class="saas-chip">Signed in as ${user?.name || "Agency owner"}</div>
        <button class="btn-inline btn-secondary" type="button" data-signout>Sign out</button>
      </div>
      <nav class="agency-nav">
        ${navLink(pathname, "/dashboard", "Overview")}
        ${navLink(pathname, "/dashboard/clients", "Clients")}
        ${navLink(pathname, "/dashboard/team", "Team")}
        ${navLink(pathname, "/dashboard/billing", "Billing")}
        ${navLink(pathname, "/dashboard/settings", "Settings")}
        ${navLink(pathname, "/dashboard/ops", "Ops")}
      </nav>
      ${content}
    </section>
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
