import assert from "node:assert/strict";
import { buildInlineSourceMapComment, compileFastScript, parseFastScript } from "../src/fs-parser.mjs";

const source = [
  "~count = 0",
  "state title = \"hello\"",
  "export fn add(a, b) {",
  "  const sum = a + b",
  "  return sum + count",
  "}",
  "const keep = 1",
].join("\n");

const parsed = parseFastScript(source, { file: "memory.fs", mode: "lenient" });
const compiled = compileFastScript(source, { file: "memory.fs", mode: "lenient" });

assert.equal(parsed.body.length >= 3, true);
assert.equal(compiled.code.includes("let count = 0"), true);
assert.equal(compiled.code.includes("let title = \"hello\""), true);
assert.equal(compiled.code.includes("export function add"), true);

assert.equal(Array.isArray(compiled.map.sources), true);
assert.equal(compiled.map.sources[0], "memory.fs");
assert.equal(Array.isArray(compiled.map.sourcesContent), true);
assert.equal(compiled.map.sourcesContent[0].includes("~count"), true);
assert.equal(typeof compiled.map.mappings, "string");
assert.equal(compiled.map.mappings.length > 0, true);

const generatedCountOffset = compiled.code.indexOf("count");
assert.equal(generatedCountOffset >= 0, true);
const mappedOffset = parsed.mapGeneratedToSource[generatedCountOffset];
const originalCountOffset = source.indexOf("count");
assert.equal(mappedOffset <= originalCountOffset, true);

const inlineComment = buildInlineSourceMapComment(compiled.map);
assert.equal(inlineComment.startsWith("//# sourceMappingURL=data:application/json"), true);

console.log("test-sourcemap-fidelity pass");
