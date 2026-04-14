const SECTIONS = [{
  label: "Overview",
  links: [{
    label: "Introduction",
    href: "/docs"
  }, {
    label: "Language spec v2.0",
    href: "/docs/v2"
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
    label: "Quickstart",
    href: "/learn"
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
  title: "Language v2.0 spec",
  copy: "Ratified language/runtime surface, ambient stdlib, runtime scope rules, zero-JS authored app proof, and execution tracker.",
  href: "/docs/v2",
  cta: "Read spec"
}, {
  title: "Quickstart",
  copy: "Install the CLI, create, build, and deploy a FastScript app in 15 minutes. Clone the repo when you want to work on the language itself.",
  href: "/learn",
  cta: "Get started"
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
  copy: "Use npm packages in .fs files and migrate existing JS codebases module by module, with older v1.1 notes preserved for reference.",
  href: "/docs/interop",
  cta: "Learn interop"
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
          <p class="lead">Everything you need to build, validate, and ship full-stack FastScript applications on the ratified v2.0 line.</p>
        </header>

        <div class="docs-card-grid docs-entry-cards">${cards}</div>

        <hr class="section-divider">

        <section class="docs-syntax">
          <header class="sec-header-sm">
            <p class="kicker">Language baseline</p>
            <h2 class="h2">FastScript v2.0 syntax at a glance.</h2>
          </header>
          <div class="code-pair">
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">declarations.fs</span>
                <span class="code-block-lang">.fs</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// Reactive binding</span>
<span class="code-fs">~</span>count = 0
<span class="code-kw">state</span> user = <span class="code-kw">null</span>
<span class="code-fn">fn</span> <span class="code-fn">greet</span>(name) {
  <span class="code-kw">return</span> <span class="code-str">\`Hello \${name}\`</span>
}
<span class="code-kw">export</span> <span class="code-fn">fn</span> <span class="code-fn">load</span>(ctx) {
  <span class="code-kw">return</span> ctx.db.get(<span class="code-str">"users"</span>)
}</div>
            </div>
            <div class="code-block">
              <div class="code-block-head">
                <span class="code-block-file">compiled output</span>
                <span class="code-block-lang">.js</span>
              </div>
              <div class="code-block-body"><span class="code-cmt">// Compiled from .fs</span>
<span class="code-kw">let</span> count = 0
<span class="code-kw">let</span> user = <span class="code-kw">null</span>
<span class="code-kw">function</span> <span class="code-fn">greet</span>(name) {
  <span class="code-kw">return</span> <span class="code-str">\`Hello \${name}\`</span>
}
<span class="code-kw">export</span> <span class="code-kw">function</span> <span class="code-fn">load</span>(ctx) {
  <span class="code-kw">return</span> ctx.db.get(<span class="code-str">"users"</span>)
}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}
