import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runRegressionGuard } from "../src/regression-guard.mjs";

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const root = mkdtempSync(join(tmpdir(), "fastscript-regression-guard-"));

try {
  const benchmarkLatestPath = join(root, "benchmark-latest.json");
  const benchmarkBaselinePath = join(root, "benchmark-baseline.json");
  const fidelityLatestPath = join(root, "fidelity-latest.json");
  const fidelityBaselinePath = join(root, "fidelity-baseline.json");
  const reportPath = join(root, "regression-report.json");

  const benchmarkBaseline = {
    corpora: [
      {
        id: "sample-app",
        skipped: false,
        timingsMs: {
          buildWarm: { p95Trimmed: 100 },
          buildCold: { ms: 200 },
          typecheck: { p95Trimmed: 80 },
        },
        bundles: {
          js: 4000,
          css: 12000,
        },
      },
    ],
  };

  const benchmarkLatestGood = {
    corpora: [
      {
        id: "sample-app",
        skipped: false,
        timingsMs: {
          buildWarm: { p95Trimmed: 105 },
          buildCold: { ms: 220 },
          typecheck: { p95Trimmed: 90 },
        },
        bundles: {
          js: 4300,
          css: 13000,
        },
      },
    ],
  };

  const fidelityPass = {
    status: "pass",
    required: ["domSnapshotComparison"],
    checks: [{ id: "before-after-file-hash-tracking", status: "pass" }],
    probes: [{ id: "domSnapshotComparison", status: "pass" }],
  };

  writeJson(benchmarkLatestPath, benchmarkLatestGood);
  writeJson(benchmarkBaselinePath, benchmarkBaseline);
  writeJson(fidelityLatestPath, fidelityPass);
  writeJson(fidelityBaselinePath, fidelityPass);

  await runRegressionGuard([
    "--mode",
    "all",
    "--benchmark-latest",
    benchmarkLatestPath,
    "--benchmark-baseline",
    benchmarkBaselinePath,
    "--fidelity-latest",
    fidelityLatestPath,
    "--fidelity-baseline",
    fidelityBaselinePath,
    "--out",
    reportPath,
  ]);

  const goodReport = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.equal(goodReport.status, "pass");
  assert.equal(goodReport.findings.length, 0);

  const benchmarkLatestBad = {
    corpora: [
      {
        id: "sample-app",
        skipped: false,
        timingsMs: {
          buildWarm: { p95Trimmed: 300 },
          buildCold: { ms: 500 },
          typecheck: { p95Trimmed: 260 },
        },
        bundles: {
          js: 7000,
          css: 16000,
        },
      },
    ],
  };
  writeJson(benchmarkLatestPath, benchmarkLatestBad);

  await assert.rejects(
    () =>
      runRegressionGuard([
        "--mode",
        "benchmark",
        "--benchmark-latest",
        benchmarkLatestPath,
        "--benchmark-baseline",
        benchmarkBaselinePath,
        "--out",
        reportPath,
      ]),
    /regression guard failed/i,
  );

  await runRegressionGuard([
    "--mode",
    "benchmark",
    "--benchmark-latest",
    benchmarkLatestPath,
    "--benchmark-baseline",
    benchmarkBaselinePath,
    "--out",
    reportPath,
    "--no-fail",
  ]);
  const badReport = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.equal(badReport.status, "fail");
  assert.equal(badReport.findings.length >= 1, true);

  rmSync(benchmarkBaselinePath, { force: true });
  rmSync(fidelityBaselinePath, { force: true });
  writeJson(benchmarkLatestPath, benchmarkLatestGood);

  await runRegressionGuard([
    "--mode",
    "all",
    "--auto-baseline",
    "--benchmark-latest",
    benchmarkLatestPath,
    "--benchmark-baseline",
    benchmarkBaselinePath,
    "--fidelity-latest",
    fidelityLatestPath,
    "--fidelity-baseline",
    fidelityBaselinePath,
    "--out",
    reportPath,
  ]);

  assert.equal(existsSync(benchmarkBaselinePath), true);
  assert.equal(existsSync(fidelityBaselinePath), true);
  console.log("test-regression-guard pass");
} finally {
  rmSync(root, { recursive: true, force: true });
}
