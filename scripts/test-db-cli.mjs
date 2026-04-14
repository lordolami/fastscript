import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runDbMigrate } from "../src/db-cli.mjs";

const ledgerPath = resolve(".fastscript", "migrations.json");
const backupPath = resolve(".tmp-db-cli-ledger-backup.json");
const hadLedger = existsSync(ledgerPath);

if (hadLedger) {
  writeFileSync(backupPath, readFileSync(ledgerPath, "utf8"), "utf8");
}
rmSync(ledgerPath, { force: true });

try {
  await runDbMigrate();
  const first = JSON.parse(readFileSync(ledgerPath, "utf8"));
  assert.equal(Array.isArray(first.applied), true);
  assert.equal(first.applied.length >= 1, true);

  await runDbMigrate();
  const second = JSON.parse(readFileSync(ledgerPath, "utf8"));
  assert.deepEqual(second.applied, first.applied);
  console.log("test-db-cli pass");
} finally {
  if (hadLedger) {
    writeFileSync(ledgerPath, readFileSync(backupPath, "utf8"), "utf8");
    rmSync(backupPath, { force: true });
  } else {
    rmSync(ledgerPath, { force: true });
  }
}
