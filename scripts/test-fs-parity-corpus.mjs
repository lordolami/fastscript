import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { analyzeFastScript } from "../src/fs-diagnostics.mjs";
import { normalizeFastScript } from "../src/fs-normalize.mjs";
import { importSourceModule } from "../src/module-loader.mjs";
import { loadCompatibilityRegistry } from "../src/compatibility-governance.mjs";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

async function safeRm(path) {
  let lastError = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      rmSync(path, { recursive: true, force: true });
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolveWait) => setTimeout(resolveWait, 50 * (attempt + 1)));
    }
  }
  if (lastError && lastError.code !== "EPERM") throw lastError;
}

const typecheckPath = pathToFileURL(resolve("..", "fastscript-core-private", "src", "typecheck.mjs")).href;
const buildPath = pathToFileURL(resolve("..", "fastscript-core-private", "src", "build.mjs")).href;

async function runProjectSyntaxCase(testCase) {
  const root = mkdtempSync(join(tmpdir(), `fastscript-fs-syntax-${testCase.id}-`));
  try {
    write(root, "app/pages/index.fs", testCase.source);
    for (const [rel, content] of Object.entries(testCase.files || {})) write(root, rel, content);
    const previousCwd = process.cwd();
    process.chdir(root);
    try {
      const { runTypeCheck } = await import(`${typecheckPath}?case=${testCase.id}-${Date.now()}`);
      const { runBuild } = await import(`${buildPath}?case=${testCase.id}-${Date.now()}`);
      await runTypeCheck(["--mode", "fail"]);
      await runBuild();
    } finally {
      process.chdir(previousCwd);
    }
    return {
      id: testCase.id,
      family: testCase.family,
      mode: "syntax",
      status: "pass",
    };
  } finally {
    await safeRm(root);
  }
}

async function runSyntaxCase(testCase) {
  if (testCase.projectBacked) return runProjectSyntaxCase(testCase);
  const diagnostics = analyzeFastScript(testCase.source, { file: `${testCase.id}.fs`, mode: "lenient" });
  assert.equal(diagnostics.filter((entry) => entry.severity !== "warning").length, 0, `syntax diagnostics for ${testCase.id}`);
  const output = normalizeFastScript(testCase.source, { file: `${testCase.id}.fs`, mode: "lenient" });
  testCase.check(output);
  return {
    id: testCase.id,
    family: testCase.family,
    mode: "syntax",
    status: "pass",
  };
}

const syntaxCases = [
  {
    id: "ecmascript-modern-class",
    family: "ecmascript",
    source: `export class Counter {
  static seed = 1;
  #value = Counter.seed;
  static {
    this.seed += 1;
  }
  *values() {
    yield this.#value;
  }
  async *stream() {
    yield await Promise.resolve(this.#value + 1);
  }
}
`,
    check(output) {
      assert.match(output, /class Counter/);
      assert.match(output, /#value = Counter\.seed/);
      assert.match(output, /async \*stream/);
    },
  },
  {
    id: "typescript-types-and-generics",
    family: "typescript",
    projectBacked: true,
    source: `type LoaderResult<T> = {
  data: T;
};

interface User {
  id: string;
  name?: string;
}

const sample: LoaderResult<User> = {
  data: { id: "user-1", name: "Ada" }
};

export default fn Page() {
  return sample.data.name || sample.data.id;
}
`,
  },
  {
    id: "tsx-component-surface",
    family: "tsx",
    projectBacked: true,
    source: `import React from "react";

type Props = { title: string; count: number };

export default function Page<T extends Props>({ title, count }: T) {
  return (
    <section>
      <h1>{title}</h1>
      <strong>{count}</strong>
    </section>
  );
}
`,
    files: {
      "node_modules/react/package.json": `{
  "name": "react",
  "version": "1.0.0",
  "type": "module",
  "exports": "./index.js"
}
`,
      "node_modules/react/index.js": `export function createElement(type, props, ...children) {
  return { type, props: { ...(props || {}), children } };
}
const React = { createElement };
export default React;
`,
    },
  },
  {
    id: "fastscript-sugar-compatible",
    family: "fastscript-sugar",
    source: `state total = 0
export default async fn Page(step: number) {
  total = total + step;
  return String(total);
}
`,
    check(output) {
      assert.match(output, /let total = 0/);
      assert.match(output, /export default async function Page/);
    },
  },
  {
    id: "module-interop-patterns",
    family: "modules",
    source: `import path from "node:path";
export async function load(name: string) {
  const helper = await import("./helper.fs");
  const cjs = require("./legacy.cjs");
  return path.basename(helper.default(name)) + cjs.suffix;
}
`,
    check(output) {
      assert.match(output, /await import\("\.\/helper\.fs"\)/);
      assert.match(output, /require\("\.\/legacy\.cjs"\)/);
    },
  },
];

const runtimeCases = [
  {
    id: "node-express-style",
    entry: "node-express-style.fs",
    files: {
      "node-express-style.fs": `import { join } from "node:path";
export function createHandler(prefix: string) {
  return function handler(req, res) {
    return res.json({ route: join(prefix, req.params.id) });
  };
}

export default createHandler("/users");
`,
    },
    async check(mod) {
      const reply = mod.default({ params: { id: "42" } }, { json: (value) => value });
      assert.deepEqual(reply, { route: "\\users\\42" });
    },
  },
  {
    id: "node-middleware-error-chain",
    entry: "node-middleware-error-chain.fs",
    files: {
      "node-middleware-error-chain.fs": `export function compose(stack, onError) {
  return function run(req, res) {
    let index = -1;
    function dispatch(i, error) {
      if (error) return onError(error, req, res);
      if (i <= index) throw new Error("next-called-twice");
      index = i;
      const layer = stack[i];
      if (!layer) return res.json({ ok: true, trace: req.trace || [], mode: process.env.FASTSCRIPT_MODE || "unset" });
      return layer(req, res, (nextError) => dispatch(i + 1, nextError || null));
    }
    return dispatch(0);
  };
}

const traceMiddleware = (req, _res, next) => {
  req.trace = [...(req.trace || []), "trace"];
  return next();
};

const guardMiddleware = (req, _res, next) => {
  if (req.path === "/explode") return next(new Error("boom"));
  req.trace = [...(req.trace || []), "guard"];
  return next();
};

export default compose([traceMiddleware, guardMiddleware], (error, req, res) => {
  res.statusCode = 500;
  return res.json({ ok: false, message: error.message, trace: req.trace || [] });
});
`,
    },
    async check(mod) {
      const previous = process.env.FASTSCRIPT_MODE;
      process.env.FASTSCRIPT_MODE = "proof";
      try {
        const ok = mod.default({ path: "/users" }, { json: (value) => value });
        assert.deepEqual(ok, { ok: true, trace: ["trace", "guard"], mode: "proof" });
        const errRes = { statusCode: 200, json: (value) => value };
        const failed = mod.default({ path: "/explode" }, errRes);
        assert.equal(errRes.statusCode, 500);
        assert.deepEqual(failed, { ok: false, message: "boom", trace: ["trace"] });
      } finally {
        if (previous === undefined) delete process.env.FASTSCRIPT_MODE;
        else process.env.FASTSCRIPT_MODE = previous;
      }
    },
  },
  {
    id: "vue-script-setup-adjacent",
    entry: "vue-script-setup-adjacent.fs",
    files: {
      "vue-script-setup-adjacent.fs": `type Todo = { id: number; done: boolean };
const todos: Todo[] = [{ id: 1, done: false }];
export function useTodos() {
  return todos.map((todo) => ({ ...todo, label: todo.done ? "done" : "open" }));
}
export default useTodos;
`,
    },
    async check(mod) {
      assert.deepEqual(mod.default(), [{ id: 1, done: false, label: "open" }]);
    },
  },
  {
    id: "vue-composable-store-adjacent",
    entry: "vue-composable-store-adjacent.fs",
    files: {
      "vue-composable-store-adjacent.fs": `import { ref, computed } from "vue";

export function useInventory() {
  const items = ref([{ id: 1, qty: 2 }, { id: 2, qty: 4 }]);
  const total = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));
  function add(qty) {
    items.value = [...items.value, { id: items.value.length + 1, qty }];
    return total.value;
  }
  return {
    total,
    add,
    snapshot() {
      return items.value.map((item) => item.qty);
    }
  };
}

export default function inventorySummary() {
  const store = useInventory();
  return {
    before: store.total.value,
    after: store.add(3),
    snapshot: store.snapshot()
  };
}
`,
      "node_modules/vue/package.json": `{
  "name": "vue",
  "version": "1.0.0",
  "type": "module",
  "exports": "./index.js"
}
`,
      "node_modules/vue/index.js": `export function ref(value){
  return { value };
}
export function computed(fn){
  return {
    get value(){
      return fn();
    }
  };
}
`,
    },
    async check(mod) {
      assert.deepEqual(mod.default(), { before: 6, after: 9, snapshot: [2, 4, 3] });
    },
  },
  {
    id: "next-page-style-tsx",
    entry: "next-page-style-tsx.fs",
    files: {
      "next-page-style-tsx.fs": `type PageProps = { params: { slug: string } };
export default fn Page({ params }: PageProps) {
  return <main><h1>{params.slug}</h1></main>;
}
`,
    },
    async check(mod) {
      const tree = mod.default({ params: { slug: "post-1" } });
      assert.equal(tree.type, "main");
      assert.equal(tree.props.children[0].type, "h1");
    },
  },
  {
    id: "next-layout-metadata-style",
    entry: "next-layout-metadata-style.fs",
    files: {
      "next-layout-metadata-style.fs": `export const metadata = {
  title: "Docs",
  description: "FastScript compatibility docs"
};

export async function generateMetadata(slug) {
  return {
    title: "post:" + slug,
    description: "generated:" + slug
  };
}

export default function Layout({ children }) {
  return <section data-title={metadata.title}>{children}</section>;
}
`,
    },
    async check(mod) {
      assert.deepEqual(mod.metadata, { title: "Docs", description: "FastScript compatibility docs" });
      assert.deepEqual(await mod.generateMetadata("guide"), { title: "post:guide", description: "generated:guide" });
      const tree = mod.default({ children: "body" });
      assert.equal(tree.type, "section");
      assert.equal(tree.props["data-title"], "Docs");
      assert.equal(tree.props.children[0], "body");
    },
  },
  {
    id: "react-hooks-context-lazy",
    entry: "react-hooks-context-lazy.fs",
    files: {
      "react-hooks-context-lazy.fs": `import React, { createContext, useContext, useState, lazy } from "react";

const ThemeContext = createContext("light");
const LazyCard = lazy(() => import("./react-lazy-card.fs"));

export async function useDashboardTheme() {
  const theme = useContext(ThemeContext);
  const [count, setCount] = useState(2);
  setCount(count + 1);
  const lazyMod = await LazyCard.load();
  return {
    theme,
    count,
    next: count + 1,
    lazyName: lazyMod.default()
  };
}

export default useDashboardTheme;
`,
      "react-lazy-card.fs": `export default function LazyCard() {
  return "lazy-card";
}
`,
      "node_modules/react/package.json": `{
  "name": "react",
  "version": "1.0.0",
  "type": "module",
  "exports": "./index.js"
}
`,
      "node_modules/react/index.js": `const contexts = new WeakMap();
export function createElement(type, props, ...children) {
  return { type, props: { ...(props || {}), children } };
}
export function createContext(defaultValue) {
  const ctx = { defaultValue };
  contexts.set(ctx, defaultValue);
  return ctx;
}
export function useContext(ctx) {
  return contexts.get(ctx) ?? ctx.defaultValue;
}
export function useState(initial) {
  let value = initial;
  return [value, (next) => { value = next; }];
}
export function lazy(loader) {
  return {
    async load() {
      return loader();
    }
  };
}
const React = { createElement, createContext, useContext, useState, lazy };
export default React;
`,
    },
    async check(mod) {
      const result = await mod.default();
      assert.deepEqual(result, { theme: "light", count: 2, next: 3, lazyName: "lazy-card" });
    },
  },
  {
    id: "commonjs-interop",
    entry: "commonjs-interop.fs",
    files: {
      "commonjs-interop.fs": `const lib = require("./legacy.cjs");
export default function run(name: string) {
  return lib.prefix + name + lib.suffix;
}
`,
      "legacy.cjs": `module.exports = { prefix: "[", suffix: "]" };`,
    },
    async check(mod) {
      assert.equal(mod.default("fs"), "[fs]");
    },
  },
];

const buildProjectRoot = mkdtempSync(join(tmpdir(), "fastscript-fs-parity-build-"));
const corpusRoot = mkdtempSync(join(tmpdir(), "fastscript-fs-parity-runtime-"));

const results = [];
const previousReact = globalThis.React;

try {
  globalThis.React = {
    createElement(type, props, ...children) {
      return { type, props: { ...(props || {}), children } };
    },
    Fragment: Symbol.for("fastscript.test.fragment"),
  };

  for (const testCase of syntaxCases) results.push(await runSyntaxCase(testCase));

  write(
    buildProjectRoot,
    "app/pages/index.fs",
    `type CardProps = { title: string; count: number };

export default fn Page(props: CardProps) {
  return (
    <section>
      <h1>{props.title}</h1>
      <p>{props.count}</p>
    </section>
  );
}
`,
  );
  write(
    buildProjectRoot,
    "app/pages/blog/[slug].fs",
    `type BlogPageProps = { params: { slug: string } };

export async fn load(): Promise<{ title: string }> {
  return { title: "post" };
}

export default function BlogPage({ params }: BlogPageProps) {
  return <article><h2>{params.slug}</h2></article>;
}
`,
  );
  write(
    buildProjectRoot,
    "app/pages/dashboard/layout.fs",
    `type LayoutProps = { children: unknown };

export const metadata = {
  title: "dashboard",
  description: "layout metadata"
};

export default function DashboardLayout({ children }: LayoutProps) {
  return <section data-layout="dashboard">{children}</section>;
}
`,
  );
  write(
    buildProjectRoot,
    "app/api/hello.fs",
    `type RequestContext = { params: { name: string } };
export async function GET(ctx: RequestContext) {
  return { status: 200, body: "hello:" + ctx.params.name };
}
`,
  );

  const previousCwd = process.cwd();
  process.chdir(buildProjectRoot);
  try {
    const { runBuild } = await import(`${buildPath}?case=framework-build-${Date.now()}`);
    await runBuild();
  } finally {
    process.chdir(previousCwd);
  }

  assert.equal(existsSync(join(buildProjectRoot, "dist", "fastscript-manifest.json")), true);
  const manifest = JSON.parse(readFileSync(join(buildProjectRoot, "dist", "fastscript-manifest.json"), "utf8"));
  assert.equal(manifest.routes.length, 3);
  assert.equal(manifest.apiRoutes.length, 1);
  results.push({ id: "framework-build-corpus", family: "frameworks", mode: "build", status: "pass" });

  for (const testCase of runtimeCases) {
    const testRoot = join(corpusRoot, testCase.id);
    mkdirSync(testRoot, { recursive: true });
    for (const [rel, content] of Object.entries(testCase.files)) write(testRoot, rel, content);
    if (!("legacy.cjs" in testCase.files)) write(testRoot, "legacy.cjs", `module.exports = { suffix: "-ok" };`);
    if (!("helper.fs" in testCase.files)) write(testRoot, "helper.fs", `export default function helper(name) { return "dir/" + name; }`);
    const mod = await importSourceModule(join(testRoot, testCase.entry));
    await testCase.check(mod);
    results.push({ id: testCase.id, family: "frameworks", mode: "runtime", status: "pass" });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    status: "pass",
    contract: "all valid JS/TS should be accepted in .fs; failures are compatibility bugs",
    governanceTrack: "4.0",
    parserFrontendParity: {
      status: "pass",
      syntaxCases: syntaxCases.length,
    },
    runtimePlatformParity: {
      status: "pass",
      runtimeCases: runtimeCases.length,
      buildCorpus: 1,
    },
    registryCoverage: loadCompatibilityRegistry().entries
      .filter((entry) => (entry.proofIds || []).some((proofId) => proofId.startsWith("artifact:fs-parity:")))
      .map((entry) => ({ id: entry.id, feature: entry.feature, status: entry.status })),
    results,
  };

  mkdirSync(resolve(".fastscript", "proofs"), { recursive: true });
  writeFileSync(resolve(".fastscript", "proofs", "fs-parity-matrix.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`test-fs-parity-corpus pass: ${results.length} checks`);
} finally {
  if (previousReact === undefined) delete globalThis.React;
  else globalThis.React = previousReact;
  await safeRm(buildProjectRoot);
  await safeRm(corpusRoot);
}
