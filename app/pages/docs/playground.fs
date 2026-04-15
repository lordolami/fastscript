export default function Playground() {
  return `
    <section class="playground-page">
      <header class="sec-header">
        <p class="kicker">Playground</p>
        <h1 class="h1">Try FastScript in the browser.</h1>
        <p class="lead">Write .fs code, see what compiles, and explore diagnostic messages instantly. No install needed.</p>
      </header>

      <div class="playground-wrap">
        <div class="playground-head">
          <span class="playground-head-title">editor.fs</span>
          <div class="pg-example-row">
            <button type="button" class="btn btn-ghost btn-sm" data-pg-example="reactive">Reactive</button>
            <button type="button" class="btn btn-ghost btn-sm" data-pg-example="page">Page</button>
            <button type="button" class="btn btn-ghost btn-sm" data-pg-example="api">API</button>
          </div>
        </div>
        <textarea class="playground-editor" data-pg-input spellcheck="false">// FastScript syntax playground
// Try: fn, state, ~ declarations

fn greet(name) {
  return \`Hello, \${name}!\`
}

state count = 0
~double = count * 2

export default fn Page({ user }) {
  return \`&lt;h1&gt;\${greet(user?.name || "World")}&lt;/h1&gt;\`
}</textarea>
        <div class="playground-sep"></div>
        <div class="playground-output" data-pg-output>// Compiled output will appear here</div>
        <div class="playground-actions">
          <button type="button" class="btn btn-primary btn-sm" data-pg-run>Compile &rarr;</button>
          <button type="button" class="btn btn-ghost btn-sm" data-pg-clear>Clear</button>
          <span class="playground-note">FastScript v3 &middot; client-side preview</span>
        </div>
      </div>

      <p class="playground-hint">Tip: press <code class="ic">Ctrl+Enter</code> to compile. For full diagnostics and source maps, install the CLI.</p>
    </section>
  `;
}
export function hydrate({root}) {
  const input = root.querySelector("[data-pg-input]");
  const output = root.querySelector("[data-pg-output]");
  const runBtn = root.querySelector("[data-pg-run]");
  const clrBtn = root.querySelector("[data-pg-clear]");
  if (!input || !output) return;
  const EXAMPLES = {
    reactive: `// Reactive binding\n~count = 0\n~doubled = count * 2\n\nfn increment() {\n  count += 1\n}`,
    page: `export async fn load(ctx) {\n  const user = await ctx.db.get("users", ctx.params.id)\n  if (!user) return { notFound: true }\n  return { user }\n}\n\nexport default fn UserPage({ user }) {\n  return \`<h1>\${user.name}</h1>\`\n}`,
    api: `// POST /api/items\nexport async fn POST(ctx, h) {\n  const body = await ctx.input.validateBody({\n    name: "string",\n    qty:  "number"\n  })\n  const item = await ctx.db.insert("items", body)\n  return h.json({ ok: true, item }, 201)\n}`
  };
  const compile = () => {
    const src = input.value || "";
    let out = src;
    out = out.replace(/^(\s*)~(\s*)(\w+)\s*=/gm, "$1let $3 =");
    out = out.replace(/^(\s*)state\s+(\w+)\s*=/gm, "$1let $2 =");
    out = out.replace(/\bfn\s+(\w+)\s*\(/g, "function $1(");
    output.textContent = "// compiled .js output\n" + out;
  };
  root.querySelectorAll("[data-pg-example]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-pg-example");
      if (EXAMPLES[key]) {
        input.value = EXAMPLES[key];
        compile();
      }
    });
  });
  if (runBtn) runBtn.addEventListener("click", compile);
  if (clrBtn) clrBtn.addEventListener("click", () => {
    input.value = "";
    output.textContent = "// Compiled output will appear here";
  });
  input.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      compile();
    }
  });
  compile();
}
