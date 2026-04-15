import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadCompatibilityArtifacts, loadCompatibilityRegistry, writeCompatibilityArtifacts } from "../src/compatibility-governance.mjs";

const registry = loadCompatibilityRegistry();
const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const artifacts = loadCompatibilityArtifacts();
const { report } = writeCompatibilityArtifacts({ registry, pkg, artifacts });

console.log(`compatibility matrix written: docs/SUPPORT_MATRIX.md`);
console.log(`compatibility report written: .fastscript/proofs/compatibility-registry-report.json`);
console.log(`compatibility report module written: src/generated/compatibility-registry-report.mjs`);
console.log(`compatibility registry entries: ${report.summary.entries}`);
