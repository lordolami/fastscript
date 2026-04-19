const NAV = [{
  href: "/platform",
  label: "Platform"
}, {
  href: "/pricing",
  label: "Pricing"
}, {
  href: "/docs",
  label: "Docs"
}, {
  href: "/learn",
  label: "Learn"
}, {
  href: "/ceo",
  label: "CEO"
}, {
  href: "/contact",
  label: "Contact"
}];
const FOOTER_COLS = [{
  title: "Product",
  links: [["Overview", "/"], ["Platform demo", "/platform"], ["Pricing", "/pricing"], ["Buy FastScript", "/buy"]]
}, {
  title: "Docs",
  links: [["Docs", "/docs"], ["Current line", "/docs/latest"], ["Builders course", "/learn"], ["Support matrix", "/docs/support"]]
}, {
  title: "Proof",
  links: [["Benchmarks", "/benchmarks"], ["Showcase", "/showcase"], ["Examples", "/examples"], ["Why FastScript", "/why-fastscript"]]
}, {
  title: "Company",
  links: [["CEO", "/ceo"], ["Enterprise", "/enterprise"], ["Roadmap", "/roadmap"], ["Contact", "/contact"]]
}, {
  title: "Legal",
  links: [["License", "/license"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"]]
}];
function navLink(pathname, href, label, mobile = false) {
  const p = String(pathname || "/");
  const active = href === "/" ? p === "/" : p === href || p.startsWith(href + "/");
  const cls = mobile ? "mobile-link" : "nav-link";
  return `<a class="${cls}${active ? " is-active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
}
export default function Layout({content, pathname}) {
  const navLinks = NAV.map(entry => navLink(pathname, entry.href, entry.label)).join("");
  const mobileLinks = NAV.map(entry => navLink(pathname, entry.href, entry.label, true)).join("");
  const footerCols = FOOTER_COLS.map(col => {
    const links = col.links.map(([label, href]) => {
      const ext = href.startsWith("http");
      return `<a class="footer-link" href="${href}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
    }).join("");
    return `<div class="footer-col"><p class="footer-col-title">${col.title}</p>${links}</div>`;
  }).join("");
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="site-nav" role="banner">
      <div class="shell nav-inner">
        <a class="brand" href="/" aria-label="FastScript home">
          <span class="brand-mark" aria-hidden="true">FS</span>
          <span class="brand-name">FastScript</span>
          <span class="brand-ver">5.0.1</span>
        </a>

        <nav class="nav-links" aria-label="Primary navigation">
          ${navLinks}
        </nav>

        <div class="nav-end">
          <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle colour theme" title="Toggle theme">
            <span class="theme-icon" aria-hidden="true">&#9790;</span>
          </button>
          <a class="btn btn-ghost btn-sm" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub</a>
          <a class="btn btn-secondary btn-sm" href="/platform">See demo</a>
          <a class="btn btn-primary btn-sm" href="/buy">Buy FastScript</a>
          <button type="button" class="menu-toggle" id="menu-toggle" data-nav-toggle aria-expanded="false" aria-label="Open menu" aria-controls="mobile-panel">&#9776;</button>
        </div>
      </div>

      <nav class="mobile-panel shell" id="mobile-panel" data-mobile-panel aria-label="Mobile navigation">
        ${mobileLinks}
        <div class="mobile-divider"></div>
        <a class="mobile-link" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub &rarr;</a>
      </nav>
    </header>

    <main id="main-content" class="site-main" tabindex="-1">
      <div class="page shell">
        ${content}
      </div>
    </main>

    <footer class="site-footer" role="contentinfo">
      <div class="shell">
        <div class="footer-inner">
          <div class="footer-brand-block">
            <div class="footer-brand-name">
              <span class="brand-mark footer-brand-mark" aria-hidden="true">FS</span>
              FastScript
            </div>
            <p class="footer-brand-copy">FastScript is the structured substrate for AI-system workflows: public demo on the website, paid operator console underneath, and one runtime contract from dataset to deployment.</p>
            <p class="footer-brand-copy">The full-stack TypeScript platform is the proof that the thesis is real now, not a slide claim waiting for the product to catch up.</p>
            <div class="footer-social">
              <a class="footer-social-link" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
              <a class="footer-social-link" href="https://discord.gg/fastscript" target="_blank" rel="noreferrer" aria-label="Discord">DC</a>
            </div>
          </div>
          <div class="footer-links">${footerCols}</div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copyright">&#169; 2026 Lakesbim Infotechnology - <a class="footer-bottom-link" href="/license">Source-Available License</a></p>
          <div class="footer-bottom-links">
            <a class="footer-bottom-link" href="/platform">Platform</a>
            <a class="footer-bottom-link" href="/pricing">Pricing</a>
            <a class="footer-bottom-link" href="/docs">Docs</a>
            <a class="footer-bottom-link" href="/learn">Learn</a>
            <a class="footer-bottom-link" href="/ceo">CEO</a>
            <a class="footer-bottom-link" href="/security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
export function hydrate() {
  const toggle = document.getElementById("menu-toggle");
  const panel = document.getElementById("mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll("a").forEach(anchor => {
      anchor.addEventListener("click", () => {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = themeBtn && themeBtn.querySelector(".theme-icon");
  const applyTheme = theme => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("fs-theme", theme);
    } catch (_) {}
    if (themeIcon) themeIcon.innerHTML = theme === "light" ? "&#9788;" : "&#9790;";
  };
  if (themeBtn) {
    let saved = null;
    try {
      saved = window.localStorage.getItem("fs-theme");
    } catch (_) {}
    saved = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    applyTheme(saved);
    themeBtn.addEventListener("click", () => {
      applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
  const fallbackCopy = text => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "true");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {}
    document.body.removeChild(area);
    return ok;
  };
  if (!window.__fsCopyBound) {
    window.__fsCopyBound = true;
    document.addEventListener("click", async event => {
      const button = event.target && event.target.closest ? event.target.closest("[data-copy]") : null;
      if (!button) return;
      event.preventDefault();
      const text = button.getAttribute("data-copy") || "";
      if (!text) return;
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch (_) {}
      if (!copied) copied = fallbackCopy(text);
      if (!copied) return;
      const prev = button.innerHTML;
      button.innerHTML = "&#10003; Copied";
      window.setTimeout(() => {
        button.innerHTML = prev;
      }, 1400);
    });
  }
}
