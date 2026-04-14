import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-dom-globals");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const click = new Event("click")
const custom = new CustomEvent("fastscript")
const h = history
const ls = localStorage
const ss = sessionStorage

export default function DomGlobals() {
  return String(Boolean(click)) + ":" + String(Boolean(custom)) + ":" + String(Boolean(h)) + ":" + String(Boolean(ls)) + ":" + String(Boolean(ss))
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const errors = (report?.diagnostics || []).filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero errors, got ${errors.length}`);

rmSync(root, { recursive: true, force: true });
console.log("test-v2-dom-globals pass");
