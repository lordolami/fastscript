const DOC_ROUTE_FALLBACKS = ["/docs", "/docs/latest", "/docs/interop", "/docs/playground", "/docs/search", "/docs/support", "/docs/v3", "/docs/v2", "/docs/v1", "/docs/v1.1", "/learn", "/benchmarks", "/why-fastscript"];
function resolveDocRoute(item) {
  const direct = String(item?.path || "").trim();
  if (DOC_ROUTE_FALLBACKS.includes(direct)) return direct;
  const haystack = `${item?.title || ""} ${item?.summary || ""} ${direct}`.toLowerCase();
  if (haystack.includes("support matrix") || haystack.includes("compatibility matrix")) return "/docs/support";
  if (haystack.includes("proven") || haystack.includes("blocked") || haystack.includes("supported") || haystack.includes("planned")) return "/docs/support";
  if (haystack.includes("next") || haystack.includes("react") || haystack.includes("vue") || haystack.includes("node") || haystack.includes("npm")) return "/docs/support";
  if (haystack.includes("playground")) return "/docs/playground";
  if (haystack.includes("why fastscript") || haystack.includes("why developers") || haystack.includes("adopt") || haystack.includes("frontend and backend") || haystack.includes("full-stack")) return "/why-fastscript";
  if (haystack.includes("v3") || haystack.includes("latest") || haystack.includes("parity") || haystack.includes("stdlib") || haystack.includes("runtime")) return "/docs/v3";
  if (haystack.includes("compatibility")) return "/docs/support";
  if (haystack.includes("v2") || haystack.includes("ratified")) return "/docs/v2";
  if (haystack.includes("interop")) return "/docs/interop";
  if (haystack.includes("migration") || haystack.includes("convert") || haystack.includes("rollback") || haystack.includes("edge case")) return "/docs/interop";
  if (haystack.includes("spec") || haystack.includes("error code")) return "/docs/v1";
  if (haystack.includes("deploy") || haystack.includes("release") || haystack.includes("rollout") || haystack.includes("api reference") || haystack.includes("plugin") || haystack.includes("cli")) {
    return "/docs/latest";
  }
  return "/docs/latest";
}
function renderResults(root, items) {
  if (!items.length) {
    root.innerHTML = `<div class="docs-card"><p class="docs-card-title">No results found</p><p class="docs-card-copy">Try a broader query such as routing, deploy, interop, or typecheck.</p></div>`;
    return;
  }
  root.innerHTML = items.map(item => `
    <div class="docs-card">
      <p class="docs-card-title">${item.title}</p>
      <p class="docs-card-copy">${item.summary}</p>
      <a class="docs-card-link" href="${resolveDocRoute(item)}">Open page &#8594;</a>
    </div>
  `).join("");
}
export default function DocsSearchPage() {
  return `
    <section class="docs-search-page">
      <header class="sec-header">
        <p class="kicker">Docs search</p>
        <h1 class="h1">Search guides, APIs, and release references.</h1>
        <p class="lead">Results are powered by the generated docs index and ranked by term match quality.</p>
      </header>

      <div class="filter-row">
        <input class="input filter-input" data-docs-q placeholder="Search docs..." />
        <button type="button" class="btn btn-primary" data-docs-search>Search</button>
        <span class="tag">GET /api/docs-search</span>
      </div>

      <div class="docs-card-grid docs-search-out" data-docs-results></div>
    </section>
  `;
}
export function hydrate({root}) {
  const q = root.querySelector("[data-docs-q]");
  const btn = root.querySelector("[data-docs-search]");
  const out = root.querySelector("[data-docs-results]");
  if (!q || !btn || !out) return;
  const initial = new URLSearchParams(location.search).get("q") || "";
  q.value = initial;
  async function search() {
    const raw = String(q.value || "").trim();
    const query = encodeURIComponent(raw);
    out.innerHTML = `<div class="docs-card"><p class="docs-card-title">Searching...</p><p class="docs-card-copy">Checking the generated docs index for relevant guides and references.</p></div>`;
    try {
      const res = await fetch(`/api/docs-search?q=${query}`, {
        headers: {
          accept: "application/json"
        }
      });
      if (!res.ok) {
        out.innerHTML = `<div class="docs-card"><p class="docs-card-title">Search unavailable</p><p class="docs-card-copy">The docs index returned status ${res.status}. Open <a class="docs-card-link" href="/docs/latest">Docs latest</a> or try again in a moment.</p></div>`;
        return;
      }
      const json = await res.json();
      renderResults(out, json.items || []);
    } catch (_) {
      out.innerHTML = `<div class="docs-card"><p class="docs-card-title">Search unavailable</p><p class="docs-card-copy">The docs index could not be reached right now. Open <a class="docs-card-link" href="/docs/latest">Docs latest</a> or try again in a moment.</p></div>`;
    }
  }
  btn.addEventListener("click", search);
  q.addEventListener("keydown", e => {
    if (e.key === "Enter") search();
  });
  search();
}
