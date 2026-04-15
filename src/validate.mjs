import { runCheck } from "./check.mjs";
import { runBuild } from "./build.mjs";
import { runBench } from "./bench.mjs";
import { runCompat } from "./compat.mjs";
import { runExport } from "./export.mjs";
import { runDbMigrate, runDbSeed } from "./db-cli.mjs";
import { runTypeCheck } from "./typecheck.mjs";
import { runLint } from "./fs-linter.mjs";
import { runMigrate } from "./migrate.mjs";
import { runPermissions } from "./permissions-cli.mjs";
import { runBenchmarkDiscipline } from "./benchmark-discipline.mjs";
import { runRegressionGuard } from "./regression-guard.mjs";
import { runCompatibilityGovernanceCheck } from "./compatibility-governance.mjs";

export async function runValidate() {
  await runMigrate(["app", "--dry-run", "--fidelity-level", "full", "--fail-on-unproven-fidelity"]);
  await runPermissions(["--mode", "report"]);
  await runCheck();
  await runLint(["--mode", "fail"]);
  await runTypeCheck(["--mode", "fail"]);
  await runBuild();
  await runBench();
  await runBenchmarkDiscipline();
  await runCompatibilityGovernanceCheck();
  await runRegressionGuard(["--mode", "all", "--auto-baseline"]);
  await runCompat();
  await runDbMigrate();
  await runDbSeed();
  await runExport(["--to", "js", "--out", "exported-js-app"]);
  await runExport(["--to", "ts", "--out", "exported-ts-app"]);
  console.log("validate complete: check/lint/typecheck/build/bench/compat/db/export all passed");
}
