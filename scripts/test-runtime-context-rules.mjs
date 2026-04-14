import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-runtime-context-rules");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "server.server.fs"),
  `const envName = process?.env?.NODE_ENV || "dev"
const dir = __dirname
export default function ServerOnly() { return envName + ":" + dir }`,
  "utf8",
);

writeFileSync(
  join(root, "pages", "edge.edge.fs"),
  `const edgeSelf = self
const bad = process?.env?.NODE_ENV || "nope"
export default function EdgeOnly() { return String(Boolean(edgeSelf)) + ":" + bad }`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const diagnostics = report.diagnostics || [];

const fs4201 = diagnostics.filter((d) => d.code === "FS4201");
assert.equal(fs4201.length, 1, `Expected exactly one FS4201 diagnostic, got ${fs4201.length}`);
assert.equal(String(fs4201[0].file || "").replace(/\\/g, "/").includes("edge.edge.fs"), true);
assert.equal(String(fs4201[0].message || "").includes("process"), true);

rmSync(root, { recursive: true, force: true });
console.log("test-runtime-context-rules pass");
