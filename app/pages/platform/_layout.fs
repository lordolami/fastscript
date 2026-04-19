function navLink(pathname, href, label) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return `<a class="platform-nav-link${active ? " is-active" : ""}" href="${href}">${label}</a>`;
}
export default function PlatformLayout({content, pathname}) {
  return `
    <section class="platform-frame">
      <div class="platform-layout">
        <aside class="platform-sidebar">
          <p class="kicker">Platform</p>
          <h1 class="h3">Full universe console</h1>
          <p class="platform-sidebar-copy">FastScript now keeps datasets, training, evals, proof, specialization, models, deployments, workspaces, and grounded commands inside one structured platform surface.</p>
          <nav class="platform-nav">
            ${navLink(pathname, "/platform", "Overview")}
            ${navLink(pathname, "/platform/datasets", "Datasets")}
            ${navLink(pathname, "/platform/experiments", "Experiments")}
            ${navLink(pathname, "/platform/training", "Training")}
            ${navLink(pathname, "/platform/evals", "Eval suites")}
            ${navLink(pathname, "/platform/specialization", "Specialization")}
            ${navLink(pathname, "/platform/adapters", "Adapters")}
            ${navLink(pathname, "/platform/synthetic-data", "Synthetic data")}
            ${navLink(pathname, "/platform/models", "Models")}
            ${navLink(pathname, "/platform/deployments", "Deployments")}
            ${navLink(pathname, "/platform/workspaces", "Workspaces")}
            ${navLink(pathname, "/platform/audit", "Audit")}
            ${navLink(pathname, "/platform/incidents", "Incidents")}
            ${navLink(pathname, "/platform/costs", "Costs")}
            ${navLink(pathname, "/platform/commands", "Commands")}
          </nav>
        </aside>
        <div class="platform-content">${content}</div>
      </div>
    </section>
  `;
}
