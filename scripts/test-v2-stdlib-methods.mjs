import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-stdlib-methods");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const arr = Array.from([1, 2, 3])
const ok = Array.isArray(arr)
const entries = Object.entries({ a: 1, b: 2 })
const now = Date.now()
const biggest = Math.max(now, 0)
const raw = JSON.stringify({ ok, entries, biggest })
const parsed = JSON.parse(raw)
const all = Promise.all([Promise.resolve(1), Promise.resolve(2)])

export default function Methods() {
  return String(ok) + ":" + String(entries.length) + ":" + String(parsed?.ok) + ":" + String(all)
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const errors = (report?.diagnostics || []).filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero errors, got ${errors.length}`);

rmSync(root, { recursive: true, force: true });
console.log("test-v2-stdlib-methods pass");
