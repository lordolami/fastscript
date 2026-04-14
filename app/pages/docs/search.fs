export default function DocsSearchPage() {
  return `
    <section>
      <p class="eyebrow">Docs Search</p>
      <h1>Find Documentation</h1>
      <div class="hero-links">
        <input data-docs-q placeholder="Search docs..." />
        <button data-docs-search>Search</button>
      </div>
      <div data-docs-results class="grid"></div>
    </section>
  `;
}
function renderResults(root, items) {
  root.innerHTML = items.map(item => `<article><h3>${item.title}</h3><p>${item.summary}</p><a href="${item.path}">Open</a></article>`).join("");
}
export function hydrate({root}) {
  const q = root.querySelector("[data-docs-q]");
  const btn = root.querySelector("[data-docs-search]");
  const out = root.querySelector("[data-docs-results]");
  if (!q || !btn || !out) return;
  async function search() {
    const query = encodeURIComponent(String(q.value || ""));
    const res = await fetch(`/api/docs-search?q=${query}`, {
      headers: {
        accept: "application/json"
      }
    });
    const json = await res.json();
    renderResults(out, json.items || []);
  }
  btn.addEventListener("click", search);
  q.addEventListener("keydown", e => {
    if (e.key === "Enter") search();
  });
  search();
}
