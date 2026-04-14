const NAV = [{
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
  label: "About"
}];
const FOOTER_COLS = [{
  title: "Product",
  links: [["Overview", "/"], ["Quickstart", "/learn"], ["Examples", "/examples"], ["Showcase", "/showcase"], ["Benchmarks", "/benchmarks"], ["Playground", "/docs/playground"]]
}, {
  title: "Language",
  links: [["Docs", "/docs"], ["Changelog", "/changelog"], ["Roadmap", "/roadmap"], ["Interop", "/docs/v1.1"], ["Spec", "/docs/v1"]]
}, {
  title: "Community",
  links: [["Blog", "/blog"], ["About", "/devs"], ["Contribute", "/contribute"], ["GitHub", "https://github.com/lordolami/fastscript"], ["Discord", "https://discord.gg/fastscript"]]
}, {
  title: "Legal",
  links: [["License", "/license"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"]]
}];
function navLinkActive(href, label) {
  return `<a class="nav-link is-active" href="${href}" aria-current="page">${label}</a>`;
}
function navLinkInactive(href, label) {
  return `<a class="nav-link" href="${href}">${label}</a>`;
}
function mobileLinkActive(href, label) {
  return `<a class="mobile-link is-active" href="${href}" aria-current="page">${label}</a>`;
}
function mobileLinkInactive(href, label) {
  return `<a class="mobile-link" href="${href}">${label}</a>`;
}
function isActive(pathname, href) {
  const p = String(pathname || "/");
  if (href === "/") return p === "/";
  return p === href || p.startsWith(href + "/");
}
export default function Layout({content, pathname}) {
  const navLinks = NAV.map(({href, label}) => isActive(pathname, href) ? navLinkActive(href, label) : navLinkInactive(href, label)).join("");
  const mobileLinks = NAV.map(({href, label}) => isActive(pathname, href) ? mobileLinkActive(href, label) : mobileLinkInactive(href, label)).join("");
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
          <span class="brand-ver">v1.0</span>
        </a>

        <nav class="nav-links" aria-label="Primary navigation">
          ${navLinks}
        </nav>

        <div class="nav-end">
          <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle colour theme" title="Toggle theme">
            <span class="theme-icon" aria-hidden="true">&#9790;</span>
          </button>
          <a class="btn btn-ghost btn-sm" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer" aria-label="FastScript on GitHub">GitHub</a>
          <a class="btn btn-primary btn-sm" href="/learn">Get Started</a>
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
            <p class="footer-brand-copy">Full-stack language runtime with <code class="ic">.fs</code> source and <code class="ic">.js</code> ecosystem compatibility. This website is built and shipped with FastScript itself. Core platform rights are protected and commercially licensed by Lakesbim Infotechnology.</p>
            <div class="footer-social">
              <a class="footer-social-link" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
              <a class="footer-social-link" href="https://discord.gg/fastscript" target="_blank" rel="noreferrer" aria-label="Discord">DC</a>
            </div>
          </div>
          <div class="footer-links">
            ${footerCols}
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copyright">&#169; 2026 Lakesbim Infotechnology &mdash; <a class="footer-bottom-link" href="/license">Source-Available License</a></p>
          <div class="footer-bottom-links">
            <a class="footer-bottom-link" href="/docs">Docs</a>
            <a class="footer-bottom-link" href="/changelog">Changelog</a>
            <a class="footer-bottom-link" href="/security">Security</a>
            <a class="footer-bottom-link" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub</a>
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
    panel.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    if (!window.__fsEscapeBound) {
      window.__fsEscapeBound = true;
      document.addEventListener("keydown", e => {
        const livePanel = document.getElementById("mobile-panel");
        const liveToggle = document.getElementById("menu-toggle");
        if (e.key === "Escape" && livePanel && liveToggle && livePanel.classList.contains("is-open")) {
          livePanel.classList.remove("is-open");
          liveToggle.setAttribute("aria-expanded", "false");
          liveToggle.focus();
        }
      });
    }
  }
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = themeBtn && themeBtn.querySelector(".theme-icon");
  const applyTheme = t => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      window.localStorage.setItem("fs-theme", t);
    } catch (_) {}
    if (themeIcon) themeIcon.innerHTML = t === "light" ? "&#9788;" : "&#9790;";
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
    area.style.pointerEvents = "none";
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
      const btn = event.target && event.target.closest ? event.target.closest("[data-copy]") : null;
      if (!btn) return;
      const text = btn.getAttribute("data-copy") || "";
      if (!text) return;
      event.preventDefault();
      if (btn.dataset.copyBusy === "true") return;
      btn.dataset.copyBusy = "true";
      try {
        let copied = false;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            copied = true;
          }
        } catch (_) {}
        if (!copied) copied = fallbackCopy(text);
        if (!copied) return;
        btn.classList.add("copied");
        const prev = btn.innerHTML;
        btn.innerHTML = "&#10003; Copied";
        window.setTimeout(() => {
          btn.innerHTML = prev;
          btn.classList.remove("copied");
          delete btn.dataset.copyBusy;
        }, 1500);
      } finally {
        if (btn.dataset.copyBusy === "true") {
          delete btn.dataset.copyBusy;
        }
      }
    });
  }
  if (window.IntersectionObserver) {
    const revealObserver = new window.IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          observer.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
    const childRevealObserver = new window.IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed-children");
          observer.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: "0px 0px -40px 0px"
    });
    document.querySelectorAll(".reveal-children").forEach(el => childRevealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("revealed"));
    document.querySelectorAll(".reveal-children").forEach(el => el.classList.add("revealed-children"));
  }
}
