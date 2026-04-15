#!/usr/bin/env node
import { createApp } from "./create.mjs";
import { runDev } from "./dev.mjs";
import { runBuild } from "./build.mjs";
import { runCheck } from "./check.mjs";
import { runMigrate } from "./migrate.mjs";
import { runBench } from "./bench.mjs";
import { runExport } from "./export.mjs";
import { runCompat } from "./compat.mjs";
import { runValidate } from "./validate.mjs";
import { runDbMigrate, runDbRollback, runDbSeed } from "./db-cli.mjs";
import { runStart } from "./start.mjs";
import { runDeploy } from "./deploy.mjs";
import { runWorkerCommand } from "./worker.mjs";
import { runTypeCheck } from "./typecheck.mjs";
import { runFormat } from "./fs-formatter.mjs";
import { runLint } from "./fs-linter.mjs";
import { runMigrationWizard } from "./migration-wizard.mjs";
import { runProfile } from "./profile.mjs";
import { runTrace } from "./trace.mjs";
import { runDiagnostics } from "./diagnostics.mjs";
import { runMigrateRollback } from "./migrate-rollback.mjs";
import { runManifest } from "./conversion-manifest.mjs";
import { runPermissions } from "./permissions-cli.mjs";
import { runBenchmarkDiscipline } from "./benchmark-discipline.mjs";
import { runRegressionGuard } from "./regression-guard.mjs";

const [, , command, ...args] = process.argv;

async function main() {
  switch (command) {
    case "create":
      await createApp(args[0] ?? "app", {
        template: args.includes("--template") ? args[args.indexOf("--template") + 1] || "default" : "default",
      });
      break;
    case "dev":
      await runDev();
      break;
    case "start":
      await runStart();
      break;
    case "build":
      await runBuild({ mode: args.includes("--mode") ? args[args.indexOf("--mode") + 1] || "build" : "build" });
      break;
    case "ssg":
      await runBuild({ mode: "ssg" });
      break;
    case "check":
      await runCheck();
      break;
    case "migrate":
      await runMigrate(args.length ? args : ["app"]);
      break;
    case "convert":
      await runMigrate(args.length ? args : ["app"]);
      break;
    case "migrate:rollback":
      await runMigrateRollback(args);
      break;
    case "manifest":
      await runManifest(args);
      break;
    case "wizard:migrate":
      await runMigrationWizard(args);
      break;
    case "bench":
      await runBench();
      break;
    case "bench:discipline":
      await runBenchmarkDiscipline();
      break;
    case "regression":
      await runRegressionGuard(args);
      break;
    case "export":
      await runExport(args);
      break;
    case "compat":
      await runCompat();
      break;
    case "validate":
      await runValidate();
      break;
    case "typecheck":
      await runTypeCheck(args);
      break;
    case "profile":
      await runProfile(args);
      break;
    case "trace":
      await runTrace(args);
      break;
    case "diagnostics":
      await runDiagnostics(args);
      break;
    case "permissions":
      await runPermissions(args);
      break;
    case "format":
      await runFormat(args);
      break;
    case "lint":
      await runLint(args);
      break;
    case "db:migrate":
      await runDbMigrate();
      break;
    case "db:seed":
      await runDbSeed();
      break;
    case "db:rollback":
      await runDbRollback(args);
      break;
    case "deploy":
      await runDeploy(args);
      break;
    case "worker":
      await runWorkerCommand(args);
      break;
    default:
      console.log("FastScript CLI");
      console.log("Commands: create, dev, start, build, ssg, check, migrate, convert, migrate:rollback, manifest, wizard:migrate, bench, bench:discipline, regression, export, compat, validate, typecheck, profile, trace, diagnostics, permissions, format, lint, db:migrate, db:seed, db:rollback, deploy, worker");
  }
}

main().catch((error) => {
  console.error("fastscript error:", error.message);
  process.exit(1);
});
