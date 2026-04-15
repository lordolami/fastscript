import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { loadCompatibilityArtifacts, loadCompatibilityRegistry, validateCompatibilityGovernance } from "../src/compatibility-governance.mjs";

const registry = loadCompatibilityRegistry();
const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const artifacts = loadCompatibilityArtifacts();
const supportMatrix = readFileSync(resolve("docs", "SUPPORT_MATRIX.md"), "utf8");
const reportJson = JSON.parse(readFileSync(resolve(".fastscript", "proofs", "compatibility-registry-report.json"), "utf8"));

const { errors, expectedReport } = validateCompatibilityGovernance({ registry, pkg, artifacts, supportMatrix, reportJson });
assert.equal(errors.length, 0, errors.join("\n"));
assert.equal(expectedReport.summary.provenEntries > 0, true);
console.log("test-compatibility-matrix pass");
