function renderResults(root, items) {
  if (!items.length) {
    root.innerHTML = `<article class="docs-card"><h3 class="docs-title">No results found</h3><p class="docs-copy">Try a broader query such as routing, deploy, interop, or typecheck.</p></article>`;
    return;
  }
  root.innerHTML = items.map(item => `
      <article class="docs-card">
        <h3 class="docs-title">${item.title}</h3>
        <p class="docs-copy">${item.summary}</p>
        <a class="docs-arrow" href="${item.path}">Open page -></a>
      </article>
    `).join("");
}
export default function DocsSearchPage() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Docs search</p>
        <h1 class="section-title">Search guides, APIs, and release references.</h1>
        <p class="section-copy">Results are powered by the generated docs index and ranked by term match quality.</p>
      </header>

      <div class="docs-search-shell">
        <input class="docs-search-input" data-docs-q placeholder="Search docs..." />
        <button class="btn btn-primary" data-docs-search>Search</button>
        <span class="docs-search-shortcut">/api/docs-search</span>
      </div>

      <div class="docs-grid docs-search-results" data-docs-results></div>
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
    const query = encodeURIComponent(String(q.value || "").trim());
    const res = await fetch(`/api/docs-search?q=${query}`, {
      headers: {
        accept: "application/json"
      }
    });
    const json = await res.json();
    renderResults(out, json.items || []);
  }
  btn.addEventListener("click", search);
  q.addEventListener("keydown", event => {
    if (event.key === "Enter") search();
  });
  search();
}
