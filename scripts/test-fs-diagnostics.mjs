import assert from "node:assert/strict";
import { analyzeFastScript, assertFastScript, formatDiagnosticsReport } from "../src/fs-diagnostics.mjs";

const ok = analyzeFastScript(`
~count = 0
state title = "x"
fn add(a, b) { return a + b }
`);
assert.equal(ok.length, 0);

const typedOk = analyzeFastScript(`
type X = { n: number }
interface Y { name: string }
const value: number = 1
export async fn load(): Promise<{ n: number }> { return { n: value } }
export default fn Page(input: { n: number }) { return String(input.n + value) }
`);
assert.equal(typedOk.length, 0);

const badSource = `
~ bad
state wrong
fn (x) { return x }
type X = { n: number }
const keep = TODO_ERROR
`;

const bad = analyzeFastScript(badSource, { file: "memory.fs" });
const codes = bad.map((diagnostic) => diagnostic.code);
assert.equal(codes.includes("FS1001"), true);
assert.equal(codes.includes("FS1002"), true);
assert.equal(codes.includes("FS1003"), true);
assert.equal(codes.includes("FS1005"), true);
assert.equal(codes.includes("FS1004"), false);
assert.equal(codes.includes("FS1007"), true);

const report = formatDiagnosticsReport(bad, { source: badSource });
assert.equal(report.includes("FS1001"), true);
assert.equal(report.includes("^"), true);

let thrown = false;
try {
  assertFastScript("~ bad", { file: "test.fs", mode: "strict" });
} catch (error) {
  thrown = true;
  assert.equal(String(error.message).includes("FS1001"), true);
}
assert.equal(thrown, true);

console.log("test-fs-diagnostics pass");
