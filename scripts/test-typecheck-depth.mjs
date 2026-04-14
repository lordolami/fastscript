import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-typecheck-depth");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const cart = { count: 1, title: "A" }
const total = cart.count + 1
const labels = [1, 2]
labels.push(3)
labels.push("bad")
export default function Home() { return String(total) }`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const codes = report.diagnostics.map((d) => d.code);

assert.equal(codes.includes("FS4103"), true);
assert.equal(codes.includes("FS4101"), false);

rmSync(root, { recursive: true, force: true });
console.log("test-typecheck-depth pass");

