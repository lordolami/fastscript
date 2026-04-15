import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { runMigrate } from "../src/migrate.mjs";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

function read(path) {
  return readFileSync(path, "utf8");
}

const projectRoot = mkdtempSync(join(tmpdir(), "fastscript-js-ts-syntax-proof-"));
const reportRoot = mkdtempSync(join(tmpdir(), "fastscript-js-ts-syntax-proof-reports-"));

const cases = [
  {
    id: "js-modern-module",
    from: "cases/js-modern-module.js",
    to: "cases/js-modern-module.fs",
    source: `import helper, { answer } from "./deps/shared.js";
export * from "./deps/reexport.js";
export { named as alias } from "./deps/named.js";

export class Example {
  static counter = 0;
  #value = answer ?? 0;
  static {
    this.counter += 1;
  }
  method(input = helper?.()) {
    return input ?? this.#value;
  }
}
`,
    checks(after) {
      assert.match(after, /from "\.\/deps\/shared\.fs"/);
      assert.match(after, /from "\.\/deps\/reexport\.fs"/);
      assert.match(after, /from "\.\/deps\/named\.fs"/);
      assert.match(after, /#value = answer \?\? 0/);
    },
  },
  {
    id: "js-comments-strings-regex",
    from: "cases/js-comments-strings-regex.js",
    to: "cases/js-comments-strings-regex.fs",
    source: `import value from "./deps/shared.js";
const quoted = "import './deps/shared.js'";
const single = 'from "./deps/shared.js"';
const pattern = /from "\\.\\/deps\\/shared\\.js"/g;
// import "./deps/shared.js"
/* export * from "./deps/shared.js" */
export default () => ({ value, quoted, single, pattern });
`,
    checks(after) {
      assert.match(after, /import value from "\.\/deps\/shared\.fs"/);
      assert.match(after, /"import '\.\/deps\/shared\.js'"/);
      assert.match(after, /'from "\.\/deps\/shared\.js"'/);
      assert.match(after, /\/from "\\\.\\\/deps\\\/shared\\\.js"\/g/);
      assert.match(after, /\/\/ import "\.\/deps\/shared\.js"/);
      assert.match(after, /\/\* export \* from "\.\/deps\/shared\.js" \*\//);
    },
  },
  {
    id: "js-dynamic-and-require",
    from: "cases/js-dynamic-and-require.js",
    to: "cases/js-dynamic-and-require.fs",
    source: `export async function load() {
  const mod = await import("./deps/dynamic.js");
  const cjs = require("./deps/cjs.js");
  return [mod.default, cjs.value];
}
`,
    checks(after) {
      assert.match(after, /import\("\.\/deps\/dynamic\.fs"\)/);
      assert.match(after, /require\("\.\/deps\/cjs\.fs"\)/);
    },
  },
  {
    id: "jsx-component",
    from: "cases/jsx-component.jsx",
    to: "cases/jsx-component.fs",
    source: `import Card from "./deps/Card.jsx";
const items = [1, 2, 3];

export default function Page() {
  return (
    <>
      {items.map((item) => <Card key={item} value={item} />)}
    </>
  );
}
`,
    checks(after) {
      assert.match(after, /import Card from "\.\/deps\/Card\.fs"/);
      assert.match(after, /<>\s*\{items\.map/);
    },
  },
  {
    id: "ts-types",
    from: "cases/ts-types.ts",
    to: "cases/ts-types.fs",
    source: `import type { SharedType } from "./deps/types.ts";
import helper from "./deps/shared.js";

export interface User {
  id: string;
  role?: SharedType;
}

export type UserMap = Record<string, User>;
export enum Mode { Read = "read", Write = "write" }

export const config = {
  mode: Mode.Read,
  feature: true,
} as const satisfies Record<string, string | boolean>;

export function useValue<T extends User>(value: T): T {
  return helper(value);
}
`,
    checks(after) {
      assert.match(after, /import type \{ SharedType \} from "\.\/deps\/types\.fs"/);
      assert.match(after, /import helper from "\.\/deps\/shared\.fs"/);
      assert.match(after, /as const satisfies/);
      assert.match(after, /export enum Mode/);
    },
  },
  {
    id: "ts-namespace-and-declare",
    from: "cases/ts-namespace-and-declare.ts",
    to: "cases/ts-namespace-and-declare.fs",
    source: `import "./deps/setup.ts";

declare global {
  interface Window {
    __proof__: boolean;
  }
}

export namespace Proof {
  export const version = "1.0.0";
}
`,
    checks(after) {
      assert.match(after, /import "\.\/deps\/setup\.fs"/);
      assert.match(after, /declare global/);
      assert.match(after, /export namespace Proof/);
    },
  },
  {
    id: "tsx-page",
    from: "cases/tsx-page.tsx",
    to: "cases/tsx-page.fs",
    source: `import type { SharedType } from "./deps/types.ts";
import Card from "./deps/Card.tsx";

type Props<T> = {
  title: string;
  data: T;
  kind?: SharedType;
};

export default function Page<T extends { id: string }>({ title, data }: Props<T>) {
  return (
    <section>
      <h1>{title}</h1>
      <Card value={data.id} />
    </section>
  );
}
`,
    checks(after) {
      assert.match(after, /from "\.\/deps\/types\.fs"/);
      assert.match(after, /from "\.\/deps\/Card\.fs"/);
      assert.match(after, /type Props<T>/);
      assert.match(after, /<section>/);
    },
  },
  {
    id: "multiline-import-assertion-shape",
    from: "cases/multiline-import-assertion-shape.ts",
    to: "cases/multiline-import-assertion-shape.fs",
    source: `import {
  alpha,
  beta,
} from "./deps/named.js";

export const pair = [alpha, beta];
`,
    checks(after) {
      assert.match(after, /from "\.\/deps\/named\.fs"/);
      assert.match(after, /alpha,/);
    },
  },
];

try {
  write(projectRoot, "index.js", `import "./cases/js-modern-module.js";\n`);
  write(projectRoot, "cases/deps/shared.js", `export default function helper(value){ return value ?? "ok"; }\nexport const answer = 42;\n`);
  write(projectRoot, "cases/deps/reexport.js", `export const reexported = true;\n`);
  write(projectRoot, "cases/deps/named.js", `export const named = "named";\n`);
  write(projectRoot, "cases/deps/dynamic.js", `export default "dynamic";\n`);
  write(projectRoot, "cases/deps/cjs.js", `module.exports = { value: "cjs" };\n`);
  write(projectRoot, "cases/deps/Card.jsx", `export default function Card(props){ return <div>{props.value}</div>; }\n`);
  write(projectRoot, "cases/deps/Card.tsx", `export default function Card(props: { value: string }) { return <div>{props.value}</div>; }\n`);
  write(projectRoot, "cases/deps/types.ts", `export type SharedType = "shared" | "other";\n`);
  write(projectRoot, "cases/deps/setup.ts", `globalThis.__proof__ = true;\n`);
  for (const testCase of cases) write(projectRoot, testCase.from, testCase.source);

  await runMigrate([projectRoot, "--fidelity-level", "off", "--report-dir", reportRoot]);

  for (const testCase of cases) {
    const outPath = join(projectRoot, testCase.to);
    assert.equal(existsSync(outPath), true, `missing converted output for ${testCase.id}`);
    assert.equal(existsSync(join(projectRoot, testCase.from)), false, `source file still exists for ${testCase.id}`);
    testCase.checks(read(outPath));
  }

  const manifest = JSON.parse(read(resolve(reportRoot, "latest", "conversion-manifest.json")));
  assert.equal(manifest.summary.renameCount >= cases.length + 8, true);
  assert.equal(manifest.summary.blockedCount, 0);
  assert.equal(manifest.validation.failedChecks.length, 0);

  const proofReport = {
    generatedAt: new Date().toISOString(),
    status: "pass",
    mode: "compatibility-first-rename-only",
    scope: {
      claim: "broad practical JS/TS/JSX/TSX migration syntax preservation",
      guarantee: "covered corpus only; not mathematical proof of every future or undiscovered syntax form",
    },
    cases: cases.map((testCase) => ({
      id: testCase.id,
      input: testCase.from.split(".").pop(),
      output: testCase.to.split(".").pop(),
      status: "pass",
    })),
    manifestSummary: manifest.summary,
  };
  mkdirSync(resolve(".fastscript", "proofs"), { recursive: true });
  writeFileSync(resolve(".fastscript", "proofs", "js-ts-syntax-proof.json"), `${JSON.stringify(proofReport, null, 2)}\n`, "utf8");

  console.log(`test-js-ts-syntax-proof pass: ${cases.length} cases`);
} finally {
  rmSync(projectRoot, { recursive: true, force: true });
  rmSync(reportRoot, { recursive: true, force: true });
}
