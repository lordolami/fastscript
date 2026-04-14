import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-typecheck");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `state count = 1
fn add(a, b) { return a + b }
const title = add(count, "x")
count = "bad"
const output = missingVar
export default function Home() { return String(output) }`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const codes = report.diagnostics.map((diagnostic) => diagnostic.code);

assert.equal(codes.includes("FS4103"), true);
assert.equal(codes.includes("FS4101"), true);
assert.equal(report.summary.errors >= 2, true);

let failed = false;
try {
  await runTypeCheck(["--path", root, "--mode", "fail"]);
} catch (error) {
  failed = true;
  assert.equal(error.status, 1);
}
assert.equal(failed, true);

rmSync(root, { recursive: true, force: true });
console.log("test-typecheck pass");
