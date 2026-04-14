export default function DocsPlaygroundPage() {
  return (`
    <section>
      <p class="eyebrow">Playground</p>
      <h1>Interactive FastScript Playground</h1>
      <p>Write `.fs)` snippets and share by URL hash.</p>
      <div class="hero-links">
        <textarea data-play-src rows="10">~count = 1
export fn view() { return count }</textarea>
        <div>
          <button data-play-run>Run</button>
          <button data-play-share>Copy Share Link</button>
        </div>
        <pre data-play-out></pre>
      </div>
    </section>
  `;
}
export function hydrate({root}) {
  const src = root.querySelector("[data-play-src]");
  const run = root.querySelector("[data-play-run]");
  const share = root.querySelector("[data-play-share]");
  const out = root.querySelector("[data-play-out]");
  if (!src || !run || !share || !out) return;
  const hash = location.hash.startsWith("#code=") ? location.hash.slice(6) : "";
  if (hash) {
    try {
      src.value = decodeURIComponent(atob(hash));
    } catch {}
  }
  function execute() {
    out.textContent = src.value.replace(/^\s*~([A-Za-z_$][\w$]*)/gm, "let $1").replace(/^\s*(export\s+)?fn\s+/gm, (_, e) => `${e || ""}function `);
  }
  run.addEventListener("click", execute);
  share.addEventListener("click", async () => {
    const encoded = btoa(encodeURIComponent(src.value));
    const url = `${location.origin}/docs/playground#code=${encoded}`;
    await navigator.clipboard.writeText(url);
    out.textContent = `Share link copied:\n${url}`;
  });
  execute();
}
