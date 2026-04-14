const NAV_LINKS = [{
  href: "/docs",
  label: "Docs"
}, {
  href: "/learn",
  label: "Quickstart"
}, {
  href: "/examples",
  label: "Examples"
}, {
  href: "/benchmarks",
  label: "Benchmarks"
}, {
  href: "/showcase",
  label: "Showcase"
}, {
  href: "/blog",
  label: "Blog"
}, {
  href: "/changelog",
  label: "Changelog"
}, {
  href: "/devs",
  label: "Devs"
}];
const FOOTER_COLUMNS = [{
  title: "Product",
  links: [["Overview", "/"], ["Showcase", "/showcase"], ["Benchmarks", "/benchmarks"], ["Changelog", "/changelog"]]
}, {
  title: "Language",
  links: [["Docs", "/docs"], ["Quickstart", "/learn"], ["Playground", "/docs/playground"], ["Interop", "/docs/v1.1"]]
}, {
  title: "Community",
  links: [["Blog", "/blog"], ["Devs", "/devs"], ["GitHub", "https://github.com/lordolami/fastscript"], ["Issues", "https://github.com/lordolami/fastscript/issues"]]
}];
function active(pathname, href) {
  const current = String(pathname || "/");
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
function navLink(pathname, href, label, mobile = false) {
  const isActive = active(pathname, href);
  if (mobile && isActive) return `<a class="mobile-link is-active" href="${href}">${label}</a>`;
  if (mobile) return `<a class="mobile-link" href="${href}">${label}</a>`;
  if (isActive) return `<a class="nav-link is-active" href="${href}">${label}</a>`;
  return `<a class="nav-link" href="${href}">${label}</a>`;
}
export default function Layout({content, pathname, user}) {
  const links = NAV_LINKS.map(item => navLink(pathname, item.href, item.label, false)).join("");
  const mobileLinks = NAV_LINKS.map(item => navLink(pathname, item.href, item.label, true)).join("");
  const footerColumns = FOOTER_COLUMNS.map(column => {
    const linksHtml = column.links.map(([label, href]) => `<a class="footer-link" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${label}</a>`).join("");
    return `<section class="footer-column"><h4>${column.title}</h4>${linksHtml}</section>`;
  }).join("");
  const authLabel = user ? `Signed in as ${user.name || user.email || "member"}` : "Guest session";
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="site-shell">
      <header class="site-nav">
        <div class="nav-inner">
          <a class="brand" href="/" aria-label="FastScript home">
            <span class="brand-mark">FS</span>
            <span>
              <span class="brand-word">FastScript</span>
              <span class="brand-sub">Full-stack runtime language</span>
            </span>
          </a>

          <nav class="nav-links" aria-label="Primary">
            ${links}
          </nav>

          <div class="nav-actions">
            <a class="btn btn-ghost" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub</a>
            <a class="btn btn-primary" href="/learn">Start</a>
            <button type="button" class="menu-toggle" data-nav-toggle aria-expanded="false" aria-label="Toggle menu">Menu</button>
          </div>
        </div>

        <nav class="mobile-panel" data-mobile-panel aria-label="Mobile">
          ${mobileLinks}
          <a class="mobile-link" href="/private">${authLabel}</a>
        </nav>
      </header>

      <main id="main-content" class="site-main page">${content}</main>

      <footer class="site-footer">
        <div class="footer-grid">
          <section class="footer-brand">
            <span class="footer-mark">FS</span>
            <h2 class="footer-title">FastScript builds full apps without framework lock-in.</h2>
            <p class="footer-copy">Use <code>.fs</code> for readable full-stack code, compile to production JavaScript, and deploy anywhere.</p>
            <p class="footer-note">MIT licensed. Compiler, runtime, adapters, docs, and benchmarks are all shipped in one repo.</p>
            <p class="footer-built">Built by Lakesbim Infotechnology</p>
          </section>

          <section class="footer-columns">${footerColumns}</section>
        </div>
      </footer>
    </div>
  `;
}
export function hydrate() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (!toggle || !panel) return;
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
