import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { analyzeFastScript } from "../src/fs-diagnostics.mjs";
import { normalizeFastScript } from "../src/fs-normalize.mjs";
import { importSourceModule } from "../src/module-loader.mjs";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

function runSyntaxCase(testCase) {
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
    source: `type LoaderResult<T> = {
  data: T;
};

interface User {
  id: string;
  name?: string;
}

export function identity<T extends User>(value: T): LoaderResult<T> {
  return { data: value };
}
`,
    check(output) {
      assert.match(output, /function identity/);
      assert.doesNotMatch(output, /interface User/);
      assert.doesNotMatch(output, /type LoaderResult/);
    },
  },
  {
    id: "tsx-component-surface",
    family: "tsx",
    source: `type Props = { title: string; count: number };

export default function Page<T extends Props>({ title, count }: T) {
  return (
    <section>
      <h1>{title}</h1>
      <strong>{count}</strong>
    </section>
  );
}
`,
    check(output) {
      assert.match(output, /React\.createElement\("section"/);
      assert.doesNotMatch(output, /type Props/);
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
      assert.match(output, /async function Page/);
      assert.match(output, /Page as default/);
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
type Req = { params: { id: string } };
type Res = { json(value: unknown): unknown };

export function createHandler(prefix: string) {
  return function handler(req: Req, res: Res) {
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
const buildPath = pathToFileURL(resolve("src", "build.mjs")).href;

const results = [];
const previousReact = globalThis.React;

try {
  globalThis.React = {
    createElement(type, props, ...children) {
      return { type, props: { ...(props || {}), children } };
    },
    Fragment: Symbol.for("fastscript.test.fragment"),
  };

  for (const testCase of syntaxCases) results.push(runSyntaxCase(testCase));

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
    const { runBuild } = await import(buildPath);
    await runBuild();
  } finally {
    process.chdir(previousCwd);
  }

  assert.equal(existsSync(join(buildProjectRoot, "dist", "fastscript-manifest.json")), true);
  const manifest = JSON.parse(readFileSync(join(buildProjectRoot, "dist", "fastscript-manifest.json"), "utf8"));
  assert.equal(manifest.routes.length, 2);
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
    parserFrontendParity: {
      status: "pass",
      syntaxCases: syntaxCases.length,
    },
    runtimePlatformParity: {
      status: "pass",
      runtimeCases: runtimeCases.length,
      buildCorpus: 1,
    },
    results,
  };

  mkdirSync(resolve(".fastscript", "proofs"), { recursive: true });
  writeFileSync(resolve(".fastscript", "proofs", "fs-parity-matrix.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`test-fs-parity-corpus pass: ${results.length} checks`);
} finally {
  if (previousReact === undefined) delete globalThis.React;
  else globalThis.React = previousReact;
  rmSync(buildProjectRoot, { recursive: true, force: true });
  rmSync(corpusRoot, { recursive: true, force: true });
}
