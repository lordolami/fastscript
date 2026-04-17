const SECTIONS = [{
  label: "Overview",
  links: [{
    label: "Introduction",
    href: "/docs"
  }, {
    label: "Current line v3",
    href: "/docs/v3"
  }, {
    label: "Language spec v1",
    href: "/docs/v1"
  }, {
    label: "Legacy v1.1 additions",
    href: "/docs/v1.1"
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
    label: "Team Dashboard SaaS",
    href: "/docs/team-dashboard-saas"
  }, {
    label: "Agency Ops guide",
    href: "/docs/agency-ops"
  }, {
    label: "Styling primitives",
    href: "/docs/primitives"
  }, {
    label: "Deploy guide",
    href: "/docs/latest"
  }, {
    label: "Migration",
    href: "/docs/v1.1"
  }, {
    label: "Interop",
    href: "/docs/interop"
  }]
}, {
  label: "Reference",
  links: [{
    label: "CLI commands",
    href: "/docs/latest"
  }, {
    label: "Error codes",
    href: "/docs/v1"
  }, {
    label: "Plugin API",
    href: "/docs/latest"
  }, {
    label: "Playground",
    href: "/docs/playground"
  }]
}];
const CARDS = [{
  title: "Language v3 overview",
  copy: "Current public line: universal JS/TS in .fs, optional FastScript sugar, parity proof, and speed discipline.",
  href: "/docs/v3",
  cta: "Read v3"
}, {
  title: "Why developers choose FastScript",
  copy: "The full developer story: why FastScript is better, how frontend and backend live in one runtime, how migration works, and how to request edge cases.",
  href: "/why-fastscript",
  cta: "Read guide"
}, {
  title: "Real-world adoption",
  copy: "One canonical path for starting a new .fs app or migrating an existing TS/JS codebase, with the governed support matrix as the contract before you promise a pattern.",
  href: "/docs/adoption",
  cta: "Open adoption guide"
}, {
  title: "Team Dashboard SaaS baseline",
  copy: "The first official FastScript greenfield product baseline: public pages, authenticated workspace flows, billing, jobs, DB state, and Cloudflare-ready deployment in one reference app.",
  href: "/docs/team-dashboard-saas",
  cta: "Open baseline guide"
}, {
  title: "Agency Ops ordinary-TypeScript guide",
  copy: "A publicly documented proving-ground app that shows how to keep ordinary TypeScript inside .fs while shipping a client-ops product shape with pages, APIs, jobs, DB state, and deploy proof.",
  href: "/docs/agency-ops",
  cta: "Open Agency Ops"
}, {
  title: "FastScript school",
  copy: "Start the interactive no-signup learning path that takes beginners from zero to full-stack FastScript mastery and gives professionals a safe migration path into .fs.",
  href: "/learn",
  cta: "Open school"
}, {
  title: "Styling primitives",
  copy: "Primitive-first UI authoring with Box, Stack, Row, Text, Heading, Button, semantic props, and token-backed variants.",
  href: "/docs/primitives",
  cta: "Learn primitives"
}, {
  title: "Playground",
  copy: "Try FastScript syntax, see compiled output, and explore diagnostic messages in the browser.",
  href: "/docs/playground",
  cta: "Open playground"
}, {
  title: "CLI reference",
  copy: "All commands: create, dev, build, deploy, migrate, export, validate, qa:all.",
  href: "/docs/latest",
  cta: "View reference"
}, {
  title: "Interop + migration",
  copy: "Use npm packages in .fs files and migrate existing TS/JS codebases module by module, with dry runs, diff previews, rollback, compatibility reporting, and governed proof coverage built in.",
  href: "/docs/interop",
  cta: "Learn interop"
}, {
  title: "Compatibility matrix",
  copy: "Generated source-of-truth support matrix with proven, partial, planned, and blocked compatibility lanes across JS/TS, frameworks, runtime targets, tooling, and npm interop.",
  href: "/docs/support",
  cta: "Open matrix"
}, {
  title: "Plugin API",
  copy: "Hook into build and request lifecycle with typed plugin contracts and middleware.",
  href: "/docs/latest",
  cta: "Plugin docs"
}];
function navLinkActive(href, pathname) {
  return `<a class="docs-nav-link is-active" href="${href}">${href}</a>`;
}
function navLinkInactive(href, label) {
  return `<a class="docs-nav-link" href="${href}">${label}</a>`;
}
export default function DocsIndex({pathname}) {
  const sidebar = SECTIONS.map(s => {
    const links = s.links.map(l => {
      if (l.href === pathname) return navLinkActive(l.href, l.label);
      return navLinkInactive(l.href, l.label);
    }).join("");
    return `<div class="docs-nav-section"><p class="docs-nav-label">${s.label}</p>${links}</div>`;
  }).join("");
  const cards = CARDS.map(c => `
    <div class="docs-card">
      <p class="docs-card-title">${c.title}</p>
      <p class="docs-card-copy">${c.copy}</p>
      <a class="docs-card-link" href="${c.href}">${c.cta} &#8594;</a>
    </div>
  `).join("");
  return `
    <div class="docs-layout">
      <aside class="docs-sidebar">${sidebar}</aside>

      <div class="docs-content">
        <header class="sec-header">
          <p class="kicker">Documentation</p>
          <h1 class="h1">FastScript docs.</h1>
          <p class="lead">Everything you need to build, validate, and ship full-stack FastScript applications on the current v3 line, with the governed support matrix as the source of truth for compatibility claims.</p>
        </header>

        <div class="docs-card-grid docs-entry-cards">${cards}</div>

        <hr class="section-divider">

        <section class="docs-syntax">
          <header class="sec-header-sm">
            <p class="kicker">Language baseline</p>
            <h2 class="h2">FastScript v3 at a glance.</h2>
          </header>
          <div class="code-pair">
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">declarations.fs</span>
                <span class="code-block-lang">.fs</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// Normal TS in .fs</span>
<span class="code-kw">type</span> User = { name: <span class="code-kw">string</span> }

<span class="code-kw">export</span> <span class="code-kw">default</span> <span class="code-kw">function</span> <span class="code-fn">Page</span>({ user }: { user: User }) {
  <span class="code-kw">return</span> <span class="code-str">\`&lt;h1&gt;\${user.name}&lt;/h1&gt;\`</span>
}</div>
            </div>
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">compiled output</span>
                <span class="code-block-lang">.js</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// FastScript normalizes to standard JS</span>
<span class="code-kw">export</span> <span class="code-kw">default</span> <span class="code-kw">function</span> <span class="code-fn">Page</span>({ user }) {
  <span class="code-kw">return</span> <span class="code-str">\`&lt;h1&gt;\${user.name}&lt;/h1&gt;\`</span>
}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}
