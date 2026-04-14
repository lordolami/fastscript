import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { formatFastScriptSource } from "../src/fs-formatter.mjs";
import { runLint } from "../src/fs-linter.mjs";

const root = resolve(".tmp-format-lint");
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });

const file = join(root, "sample.fs");
const source = `var x = 1
let stable = 2
export fn run() { return x + stable }`;

writeFileSync(file, source, "utf8");

const formatted = formatFastScriptSource(source, { file });
const formattedAgain = formatFastScriptSource(formatted, { file });
assert.equal(formatted, formattedAgain);

await runLint(["--path", root, "--mode", "pass", "--fix"]);
const fixed = readFileSync(file, "utf8");
assert.equal(fixed.includes("var "), false);
assert.equal(fixed.includes("const stable"), true);

rmSync(root, { recursive: true, force: true });
console.log("test-format-lint pass");
