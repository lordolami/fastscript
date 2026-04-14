import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-inference-corpus");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const numbers = [1, 2, 3]
const doubled = numbers.map((n) => n * 2)
const filtered = doubled.filter((n) => n > 2)
const result = filtered.reduce((acc, n) => acc + n, 0)

const user = { name: "Alice", age: 30 }
const mixed = [1, "hello", true]

const p1 = Promise.resolve(42)
const p2 = Promise.resolve("hello")
const both = Promise.all([p1, p2])

fn process(value) {
  if (typeof value === "string") return value.toUpperCase()
  if (Array.isArray(value)) return value.length
  return null
}

export default function InferenceCorpus() {
  return String(result) + ":" + String(user.name) + ":" + String(mixed.length) + ":" + String(both) + ":" + String(process("x"))
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const diagnostics = report.diagnostics || [];
const errors = diagnostics.filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero type errors, got ${errors.length}`);

const symbols = (report.files || []).flatMap((f) => f.symbols || []);
const byName = new Map(symbols.map((s) => [s.name, s.type]));

assert.equal(byName.get("doubled"), "number[]");
assert.equal(byName.get("filtered"), "number[]");
assert.equal(byName.get("result"), "number");
assert.equal(String(byName.get("user") || "").includes("name: string"), true);
assert.equal(String(byName.get("user") || "").includes("age: number"), true);
assert.equal(byName.get("mixed"), "boolean | number | string[]");

rmSync(root, { recursive: true, force: true });
console.log("test-v2-inference-corpus pass");
