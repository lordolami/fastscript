import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function must(path) {
  if (!existsSync(path)) throw new Error(`missing required release artifact: ${path}`);
}

function isSemver(value) {
  return /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(String(value || ""));
}

must(resolve("CHANGELOG.md"));
must(resolve("docs", "GOVERNANCE_VERSIONING_POLICY.md"));
must(resolve("docs", "RELEASE_PROCESS.md"));
must(resolve("docs", "RELEASE_SIGNOFF_TEMPLATE.md"));
must(resolve("spec", "STABLE_RELEASE_CHECKLIST.md"));
must(resolve("spec", "FASTSCRIPT_COMPATIBILITY_FIRST_RUNTIME_SPEC.md"));
must(resolve("benchmarks", "suite-latest.json"));
must(resolve("benchmarks", "interop-latest.json"));
must(resolve("benchmarks", "latest-proof-pack.md"));
must(resolve("docs", "PROOF_PACK.md"));
must(resolve(".fastscript", "proofs", "js-ts-syntax-proof.json"));
must(resolve(".fastscript", "proofs", "fs-parity-matrix.json"));
must(resolve("src", "regression-guard.mjs"));
must(resolve("scripts", "test-regression-guard.mjs"));

const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
if (!isSemver(pkg.version)) throw new Error(`package version is not semver: ${pkg.version}`);

const changelog = readFileSync(resolve("CHANGELOG.md"), "utf8");
if (!changelog.includes(pkg.version)) {
  throw new Error(`CHANGELOG missing package version entry: ${pkg.version}`);
}

const spec = readFileSync(resolve("spec", "FASTSCRIPT_COMPATIBILITY_FIRST_RUNTIME_SPEC.md"), "utf8");
if (!/Version:\s*`\d+\.\d+\.\d+`/.test(spec)) {
  throw new Error("compatibility spec missing explicit version header");
}

console.log("test-release-discipline pass");
