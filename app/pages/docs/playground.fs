export default function DocsPlaygroundPage() {
  return `
    <section class="section">
      <header class="section-head playground-header">
        <p class="section-kicker">Playground</p>
        <h1 class="section-title">Test FastScript snippets instantly.</h1>
        <p class="section-copy">This playground focuses on transform preview for quick experimentation and shareable links.</p>
      </header>

      <div class="playground-shell">
        <textarea class="playground-editor" data-play-src rows="12">state count = 1
fn increment() {
  count = count + 1
  return count
}

export default function View() {
  return String(increment())
}</textarea>

        <div class="playground-actions">
          <button class="btn btn-primary" data-play-run>Transform</button>
          <button class="btn btn-ghost" data-play-share>Copy share link</button>
        </div>

        <pre class="playground-output" data-play-out></pre>
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
    } catch {
      out.textContent = "Could not decode shared snippet.";
    }
  }
  function transform(value) {
    return value.replace(/^\s*state\s+([A-Za-z_$][\w$]*)/gm, "let $1").replace(/^\s*(export\s+)?fn\s+/gm, (_, e) => `${e || ""}function `);
  }
  function execute() {
    out.textContent = transform(src.value);
  }
  run.addEventListener("click", execute);
  share.addEventListener("click", async () => {
    const encoded = btoa(encodeURIComponent(src.value));
    const url = `${location.origin}/docs/playground#code=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      out.textContent = `Share link copied:\n${url}`;
    } catch {
      out.textContent = `Copy failed. Manual link:\n${url}`;
    }
  });
  execute();
}
