import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import { normalizeFastScript } from "../src/fs-normalize.mjs";
import { assertFastScript } from "../src/fs-diagnostics.mjs";
import { loadCompatibilityRegistry } from "../src/compatibility-governance.mjs";

const TMP_DIR = resolve(".tmp-interop-matrix");
const OUT_DIR = resolve("benchmarks");
const DOC_PATH = resolve("docs", "INTEROP_MATRIX.md");
const JSON_PATH = join(OUT_DIR, "interop-latest.json");

async function safeRm(path) {
  for (let i = 0; i < 3; i += 1) {
    try {
      rmSync(path, { recursive: true, force: true });
      return;
    } catch (error) {
      if (i === 2) throw error;
      await new Promise((resolveWait) => setTimeout(resolveWait, 80 * (i + 1)));
    }
  }
}

function parseArgs(args) {
  const out = { mode: "report" };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--mode") out.mode = (args[i + 1] || out.mode).toLowerCase();
  }
  return out;
}

function fsLoaderPlugin() {
  const compilerMode = (process.env.FASTSCRIPT_COMPILER_MODE || "strict").toLowerCase() === "lenient" ? "lenient" : "strict";
  return {
    name: "fastscript-fs-loader",
    setup(build) {
      build.onLoad({ filter: /\.fs$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        assertFastScript(raw, { file: args.path, mode: compilerMode });
        return {
          contents: normalizeFastScript(raw, { file: args.path, mode: compilerMode, sourceMap: "inline" }),
          loader: "js",
        };
      });
    },
  };
}

function write(path, content) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function writePkg(name, packageJson, files) {
  const parts = name.startsWith("@") ? name.split("/") : [name];
  const pkgDir = join(TMP_DIR, "node_modules", ...parts);
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(join(pkgDir, "package.json"), `${JSON.stringify({ name, version: "1.0.0", ...packageJson }, null, 2)}\n`, "utf8");
  for (const [rel, content] of Object.entries(files)) {
    write(join(pkgDir, rel), content);
  }
}

async function bundle(entry, { platform = "browser" } = {}) {
  const result = await esbuild.build({
    absWorkingDir: TMP_DIR,
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform,
    write: false,
    logLevel: "silent",
    resolveExtensions: [".fs", ".js", ".mjs", ".cjs", ".json"],
    loader: { ".fs": "js" },
    plugins: [fsLoaderPlugin()],
  });
  const bytes = result.outputFiles.reduce((sum, file) => sum + Buffer.byteLength(file.text || "", "utf8"), 0);
  return { bytes };
}

function setupFixturePackages() {
  writePkg(
    "react",
    { type: "module", exports: "./index.js" },
    {
      "index.js": `export function createElement(tag, props, ...children){ return { tag, props: props || {}, children }; }
const React = { createElement };
export default React;
`,
    },
  );
  writePkg(
    "react-dom",
    { type: "module", exports: { "./client": "./client.js" } },
    {
      "client.js": `export function createRoot(node){ return { node, render(v){ return v; } }; }`,
    },
  );
  writePkg(
    "next",
    { type: "module", exports: { "./link": "./link.js" } },
    {
      "link.js": `export default function Link(props){ return { kind: "next-link", ...props }; }`,
    },
  );
  writePkg(
    "vue",
    { type: "module", exports: "./index.js" },
    {
      "index.js": `export function h(tag, children){ return { tag, children }; }
export function createApp(def){ return { def, mount(el){ return { el, def }; } }; }`,
    },
  );
  writePkg(
    "svelte",
    { type: "module", exports: { "./store": "./store.js" } },
    {
      "store.js": `export function writable(value){
  let v = value;
  const subs = new Set();
  return {
    set(n){ v = n; subs.forEach((fn)=>fn(v)); },
    update(fn){ v = fn(v); subs.forEach((cb)=>cb(v)); },
    subscribe(fn){ subs.add(fn); fn(v); return ()=>subs.delete(fn); }
  };
}`,
    },
  );
  writePkg(
    "preact",
    { type: "module", exports: "./index.js" },
    {
      "index.js": `export function h(tag, props, ...children){ return { tag, props: props || {}, children }; }
export function render(vnode, root){ return { vnode, root }; }`,
    },
  );
  writePkg(
    "solid-js",
    { type: "module", exports: "./index.js" },
    {
      "index.js": `export function createSignal(v){ let value=v; return [() => value, (n) => { value=n; }]; }
export function createMemo(fn){ return () => fn(); }`,
    },
  );
  writePkg(
    "@fastscript/runtime",
    { type: "module", exports: { ".": "./index.js", "./edge": "./edge.js" } },
    {
      "index.js": `export const runtime = "core"; export function boot(){ return "ok"; }`,
      "edge.js": `export function edge(){ return "edge"; }`,
    },
  );
  writePkg(
    "dual-mode-lib",
    {
      type: "module",
      exports: {
        ".": {
          import: "./index.js",
          require: "./index.cjs",
        },
      },
      main: "./index.cjs",
    },
    {
      "index.js": `export default function mode(){ return "esm"; }`,
      "index.cjs": `module.exports = function mode(){ return "cjs"; };`,
    },
  );
  writePkg(
    "left-pad",
    { type: "commonjs", main: "index.cjs" },
    {
      "index.cjs": `module.exports = function leftPad(str, len, ch){
  str = String(str); ch = (ch || " ").charAt(0);
  while (str.length < len) str = ch + str;
  return str;
};`,
    },
  );
}

function setupEntries() {
  const entries = [
    {
      id: "react-core-fs",
      target: "react",
      kind: "framework",
      platform: "browser",
      file: "react-entry.fs",
      note: "FastScript module imports React + react-dom/client.",
      source: `import React from "react"
import { createRoot } from "react-dom/client"
state clicks = 0
fn boot() {
  const root = createRoot({ id: "app" })
  const el = React.createElement("button", { onClick: () => clicks = clicks + 1 }, "Launch")
  root.render(el)
  return clicks
}
export default boot
`,
    },
    {
      id: "next-link-fs",
      target: "next",
      kind: "framework",
      platform: "browser",
      file: "next-entry.fs",
      note: "FastScript module imports next/link shape.",
      source: `import Link from "next/link"
export default function routeLink() {
  return Link({ href: "/docs", children: "Docs" })
}
`,
    },
    {
      id: "vue-core-fs",
      target: "vue",
      kind: "framework",
      platform: "browser",
      file: "vue-entry.fs",
      note: "FastScript module imports Vue createApp/h API.",
      source: `import { createApp, h } from "vue"
export default function mountable() {
  const app = createApp({ render() { return h("div", "ok") } })
  return typeof app.mount === "function"
}
`,
    },
    {
      id: "svelte-store-fs",
      target: "svelte",
      kind: "framework",
      platform: "browser",
      file: "svelte-entry.fs",
      note: "FastScript module imports svelte/store writable.",
      source: `import { writable } from "svelte/store"
export default function runStore() {
  const store = writable(1)
  store.update((n) => n + 1)
  return store
}
`,
    },
    {
      id: "preact-core-fs",
      target: "preact",
      kind: "framework",
      platform: "browser",
      file: "preact-entry.fs",
      note: "FastScript module imports preact h/render API.",
      source: `import { h, render } from "preact"
export default function mount() {
  const vnode = h("div", { id: "ok" }, "hello")
  return render(vnode, { id: "root" })
}
`,
    },
    {
      id: "solid-core-fs",
      target: "solid-js",
      kind: "framework",
      platform: "browser",
      file: "solid-entry.fs",
      note: "FastScript module imports solid-js signals.",
      source: `import { createSignal, createMemo } from "solid-js"
export default function signals() {
  const [count, setCount] = createSignal(1)
  const doubled = createMemo(() => count() * 2)
  setCount(2)
  return doubled()
}
`,
    },
    {
      id: "scoped-subpath-fs",
      target: "@fastscript/runtime/edge",
      kind: "npm",
      platform: "node",
      file: "scoped-subpath-entry.fs",
      note: "FastScript module imports scoped package subpath export.",
      source: `import { edge } from "@fastscript/runtime/edge"
export default function run() {
  return edge()
}
`,
    },
    {
      id: "dual-mode-fs",
      target: "dual-mode-lib",
      kind: "npm",
      platform: "node",
      file: "dual-mode-entry.fs",
      note: "FastScript module imports dual-mode package through ESM export condition.",
      source: `import mode from "dual-mode-lib"
export default function run() {
  return mode()
}
`,
    },
    {
      id: "node-cjs-npm-fs",
      target: "left-pad",
      kind: "npm",
      platform: "node",
      file: "cjs-entry.fs",
      note: "FastScript module imports CommonJS npm package.",
      source: `import leftPad from "left-pad"
export default function run() {
  return leftPad("7", 3, "0")
}
`,
    },
    {
      id: "node-builtins-fs",
      target: "node:crypto,node:path",
      kind: "node",
      platform: "node",
      file: "node-entry.fs",
      note: "FastScript module imports Node built-ins.",
      source: `import { createHash } from "node:crypto"
import { join } from "node:path"
export default function hash() {
  return createHash("sha1").update(join("a", "b")).digest("hex")
}
`,
    },
    {
      id: "real-acorn-js",
      target: "acorn",
      kind: "npm",
      platform: "node",
      file: "acorn-entry.js",
      note: "Real npm package from FastScript dependencies.",
      source: `import { parse } from "acorn";
export default function parseOk(){ return parse("const n = 1", { ecmaVersion: "latest" }).type; }
`,
    },
    {
      id: "real-astring-js",
      target: "astring",
      kind: "npm",
      platform: "node",
      file: "astring-entry.js",
      note: "Real npm package from FastScript dependencies.",
      source: `import { generate } from "astring";
export default function emitOk(){ return generate({ type: "Literal", value: 1 }); }
`,
    },
    {
      id: "real-acorn-walk-js",
      target: "acorn-walk",
      kind: "npm",
      platform: "node",
      file: "acorn-walk-entry.js",
      note: "Real npm package from FastScript dependencies.",
      source: `import { simple } from "acorn-walk";
export default function walkOk(){ return typeof simple === "function"; }
`,
    },
  ];

  for (const entry of entries) write(join(TMP_DIR, entry.file), entry.source);
  return entries;
}

function markdown(report) {
  const registry = loadCompatibilityRegistry();
  const governed = registry.entries.filter((entry) => (entry.proofIds || []).some((proofId) => proofId.startsWith("artifact:interop:")));
  const rows = report.cases
    .map((item) => `| ${item.id} | ${item.target} | ${item.kind} | ${item.platform} | ${item.status} | ${item.bundleBytes} | ${item.note} |`)
    .join("\n");

  const failed = report.cases.filter((item) => item.status === "fail");
  const failSection = failed.length
    ? `\n## Failures\n${failed.map((item) => `- \`${item.id}\`: ${item.error}`).join("\n")}\n`
    : `\n## Failures\n- None\n`;

  return `# FastScript Interop Matrix

- Generated: ${report.generatedAt}
- Profile: ${report.profile}
- Total: ${report.summary.total}
- Pass: ${report.summary.pass}
- Fail: ${report.summary.fail}
- Governed registry entries linked here: ${governed.length}
- Governance track: FastScript 4.0 compatibility system

Interop matrix includes:
- Framework API compatibility shims for react, next/link, vue, svelte/store, preact, and solid-js.
- Scoped/subpath and dual-mode package checks (@fastscript/runtime/edge, dual-mode-lib).
- Real npm package checks using installed dependencies (acorn, acorn-walk, astring).
- Node built-in and CommonJS interop checks.

| Case | Target | Kind | Platform | Status | Bundle Bytes | Notes |
|---|---|---|---|---|---:|---|
${rows}
${failSection}`;
}

export async function runInteropMatrix(args = []) {
  const { mode } = parseArgs(args);
  await safeRm(TMP_DIR);
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(resolve("docs"), { recursive: true });

  setupFixturePackages();
  const entries = setupEntries();
  const cases = [];

  for (const entry of entries) {
    const started = performance.now();
    try {
      const bundled = await bundle(join(TMP_DIR, entry.file), { platform: entry.platform });
      cases.push({
        id: entry.id,
        target: entry.target,
        kind: entry.kind,
        platform: entry.platform,
        status: "pass",
        durationMs: Number((performance.now() - started).toFixed(2)),
        bundleBytes: bundled.bytes,
        note: entry.note,
        error: "",
      });
      console.log(`interop pass: ${entry.id}`);
    } catch (error) {
      cases.push({
        id: entry.id,
        target: entry.target,
        kind: entry.kind,
        platform: entry.platform,
        status: "fail",
        durationMs: Number((performance.now() - started).toFixed(2)),
        bundleBytes: 0,
        note: entry.note,
        error: String(error?.message || error),
      });
      console.log(`interop fail: ${entry.id}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    profile: mode,
    summary: {
      total: cases.length,
      pass: cases.filter((item) => item.status === "pass").length,
      fail: cases.filter((item) => item.status === "fail").length,
    },
    cases,
  };

  if (mode !== "test") {
    writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(DOC_PATH, markdown(report), "utf8");
    console.log(`interop matrix written: ${JSON_PATH}`);
    console.log(`interop doc written: ${DOC_PATH}`);
  } else {
    console.log("interop matrix test mode: no artifact files written");
  }
  await safeRm(TMP_DIR);

  if (mode === "test" && report.summary.fail > 0) {
    const error = new Error(`interop matrix failed: ${report.summary.fail} case(s)`);
    error.status = 1;
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runInteropMatrix(process.argv.slice(2));
}
