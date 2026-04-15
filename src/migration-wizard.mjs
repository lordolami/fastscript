import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createStrictConversionPlan } from "./migrate.mjs";

export async function runMigrationWizard(args = []) {
  const target = args[0] || "app";
  const abs = resolve(target);
  if (!existsSync(abs)) throw new Error(`migration wizard: path not found (${abs})`);

  const prepared = createStrictConversionPlan([abs, "--dry-run"]);
  const { plan } = prepared;

  console.log("=== strict conversion preview ===");
  console.log(`target: ${abs}`);
  console.log(`rename files: ${plan.renames.length}`);
  console.log(`rewrite files: ${plan.writes.filter((item) => item.kind === "rewrite").length}`);
  console.log(`import rewrites: ${plan.importRewrites.reduce((sum, item) => sum + item.count, 0)}`);
  console.log(`blocked files: ${plan.blockedFiles.length}`);

  if (plan.renames.length) {
    console.log("--- renames ---");
    for (const item of plan.renames.slice(0, 200)) {
      console.log(`${item.fromRel} -> ${item.toRel}`);
    }
  }

  if (plan.importRewrites.length) {
    console.log("--- import rewrites ---");
    for (const item of plan.importRewrites.slice(0, 100)) {
      console.log(`${item.file} (${item.count})`);
    }
  }

  if (plan.blockedFiles.length) {
    console.log("--- blocked ---");
    for (const item of plan.blockedFiles.slice(0, 200)) {
      console.log(`${item.path}: ${item.reason}`);
    }
  }

  console.log("=== end preview ===");
}
