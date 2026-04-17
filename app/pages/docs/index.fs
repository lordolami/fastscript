const SECTIONS = [{
  label: "Overview",
  links: [{
    label: "Introduction",
    href: "/docs"
  }, {
    label: "Current line v4",
    href: "/docs/latest"
  }, {
    label: "Legacy v3 release line",
    href: "/docs/v3"
  }, {
    label: "Language spec v1",
    href: "/docs/v1"
  }]
}, {
  label: "Guides",
  links: [{
    label: "FastScript school",
    href: "/learn"
  }, {
    label: "Why FastScript",
    href: "/why-fastscript"
  }, {
    label: "Real-world adoption",
    href: "/docs/adoption"
  }, {
    label: "Greenfield SaaS proof",
    href: "/docs/team-dashboard-saas"
  }, {
    label: "Agency Ops proof",
    href: "/docs/agency-ops"
  }, {
    label: "Deploy guide",
    href: "/docs/latest"
  }, {
    label: "Interop",
    href: "/docs/interop"
  }, {
    label: "Support matrix",
    href: "/docs/support"
  }]
}, {
  label: "Reference",
  links: [{
    label: "CLI commands",
    href: "/docs/latest"
  }, {
    label: "API search",
    href: "/docs/search"
  }, {
    label: "Playground",
    href: "/docs/playground"
  }, {
    label: "Changelog",
    href: "/changelog"
  }]
}];
const CARDS = [{
  title: "Current platform line",
  copy: "FastScript v4 is the complete TypeScript platform release: ordinary TS in .fs, one runtime for product work, proof-backed validation, and deploy-ready outputs.",
  href: "/docs/latest",
  cta: "Read v4"
}, {
  title: "FastScript school",
  copy: "Use /learn as the first proof surface: browser-first lessons, capstones, and guided paths from zero to full-stack FastScript fluency.",
  href: "/learn",
  cta: "Open /learn"
}, {
  title: "Why developers choose FastScript",
  copy: "The platform story for teams that want one TypeScript system for frontend, backend, jobs, deploy, and validation instead of stack sprawl.",
  href: "/why-fastscript",
  cta: "Read guide"
}, {
  title: "Greenfield SaaS reference",
  copy: "The Team Dashboard SaaS baseline proves auth, teams, billing, notifications, admin, tests, and deploy flow in one product-shaped app.",
  href: "/docs/team-dashboard-saas",
  cta: "Open SaaS proof"
}, {
  title: "Agency Ops proof app",
  copy: "The operational proving ground shows ordinary TypeScript inside .fs while shipping authenticated dashboards, billing reminders, jobs, and Cloudflare-ready deploy flow.",
  href: "/docs/agency-ops",
  cta: "Open ops proof"
}, {
  title: "Adoption and migration",
  copy: "Start greenfield or move existing TS and JS route by route with diff previews, manifests, rollback support, and governed compatibility evidence.",
  href: "/docs/adoption",
  cta: "Open adoption guide"
}, {
  title: "Support matrix",
  copy: "Generated source-of-truth compatibility coverage for proven, partial, planned, and blocked lanes across ecosystem, runtime, and tooling surfaces.",
  href: "/docs/support",
  cta: "Open matrix"
}, {
  title: "Docs search",
  copy: "Search the generated docs index, API references, support surfaces, and release notes from one FastScript-native endpoint.",
  href: "/docs/search",
  cta: "Search docs"
}, {
  title: "Benchmarks and proof pack",
  copy: "Measured build, bundle, interop, and product-proof artifacts that keep the public story tied to evidence instead of marketing.",
  href: "/benchmarks",
  cta: "Inspect proof"
}];
function navLinkActive(href, label) {
  return `<a class="docs-nav-link is-active" href="${href}">${label}</a>`;
}
function navLinkInactive(href, label) {
  return `<a class="docs-nav-link" href="${href}">${label}</a>`;
}
export default function DocsIndex({pathname}) {
  const sidebar = SECTIONS.map(section => {
    const links = section.links.map(link => link.href === pathname ? navLinkActive(link.href, link.label) : navLinkInactive(link.href, link.label)).join("");
    return `<div class="docs-nav-section"><p class="docs-nav-label">${section.label}</p>${links}</div>`;
  }).join("");
  const cards = CARDS.map(card => `
    <div class="docs-card">
      <p class="docs-card-title">${card.title}</p>
      <p class="docs-card-copy">${card.copy}</p>
      <a class="docs-card-link" href="${card.href}">${card.cta} &#8594;</a>
    </div>
  `).join("");
  return `
    <div class="docs-layout">
      <aside class="docs-sidebar">${sidebar}</aside>

      <div class="docs-content">
        <header class="sec-header">
          <p class="kicker">Documentation</p>
          <h1 class="h1">FastScript docs.</h1>
          <p class="lead">Everything you need to build, validate, and ship with FastScript v4: the complete TypeScript platform line, visible proof apps, governed compatibility evidence, and browser-first learning through <a href="/learn">/learn</a>.</p>
        </header>

        <div class="docs-card-grid docs-entry-cards">${cards}</div>

        <hr class="section-divider">

        <section class="docs-syntax">
          <header class="sec-header-sm">
            <p class="kicker">Platform baseline</p>
            <h2 class="h2">FastScript v4 at a glance.</h2>
          </header>
          <div class="code-pair">
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">app/pages/project/[id].fs</span>
                <span class="code-block-lang">.fs</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// Ordinary TS in .fs</span>
<span class="code-kw">type</span> Project = { name: <span class="code-kw">string</span> }

<span class="code-kw">export</span> <span class="code-kw">async</span> <span class="code-kw">function</span> <span class="code-fn">load</span>(ctx): <span class="code-kw">Promise</span>&lt;{ project: Project }&gt; {
  <span class="code-kw">const</span> project = <span class="code-kw">await</span> ctx.db.get(<span class="code-str">"projects"</span>, ctx.params.id)
  <span class="code-kw">return</span> { project }
}</div>
            </div>
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">platform contract</span>
                <span class="code-block-lang">v4</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// FastScript owns the pipeline around that code</span>
<span class="code-kw">const</span> pillars = [
  <span class="code-str">"auth"</span>, <span class="code-str">"migrations"</span>, <span class="code-str">"jobs"</span>, <span class="code-str">"notifications"</span>,
  <span class="code-str">"validation"</span>, <span class="code-str">"proof apps"</span>, <span class="code-str">"deploy adapters"</span>
]

<span class="code-kw">export</span> <span class="code-kw">default</span> pillars</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}
