import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createFileDatabase } from "./db.mjs";
import { createPostgresCollectionDatabase } from "./db-postgres-collection.mjs";
import { importSourceModule } from "./module-loader.mjs";

const FASTSCRIPT_DIR = resolve(".fastscript");
const MIGRATIONS_DIR = resolve("app/db/migrations");
const MIGRATION_LEDGER = join(FASTSCRIPT_DIR, "migrations.json");
const SEED_FILES = [resolve("app/db/seed.fs"), resolve("app/db/seed.js"), resolve("app/db/seed.mjs"), resolve("app/db/seed.cjs")];

function readLedgerFile() {
  if (!existsSync(MIGRATION_LEDGER)) return { applied: [] };
  try {
    const raw = JSON.parse(readFileSync(MIGRATION_LEDGER, "utf8"));
    return { applied: Array.isArray(raw.applied) ? raw.applied : [] };
  } catch {
    return { applied: [] };
  }
}

function writeLedgerFile(applied) {
  mkdirSync(FASTSCRIPT_DIR, { recursive: true });
  writeFileSync(MIGRATION_LEDGER, JSON.stringify({ applied: [...new Set(applied)].sort() }, null, 2), "utf8");
}

async function createLedgerAdapter(driver = (process.env.DB_DRIVER || "file").toLowerCase()) {
  if (driver !== "postgres") {
    return {
      type: "file",
      async listApplied() {
        return readLedgerFile().applied;
      },
      async markApplied(id) {
        const current = new Set(readLedgerFile().applied);
        current.add(id);
        writeLedgerFile([...current]);
      },
      async markRolledBack(id) {
        const current = new Set(readLedgerFile().applied);
        current.delete(id);
        writeLedgerFile([...current]);
      },
      async close() {},
    };
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when DB_DRIVER=postgres");
  }
  const { Client } = await import("pg");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS fs_migrations_ledger (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  return {
    type: "postgres",
    async listApplied() {
      const rows = (await client.query("SELECT id FROM fs_migrations_ledger ORDER BY applied_at ASC")).rows;
      return rows.map((row) => row.id);
    },
    async markApplied(id) {
      await client.query(
        "INSERT INTO fs_migrations_ledger(id) VALUES($1) ON CONFLICT(id) DO NOTHING",
        [id],
      );
    },
    async markRolledBack(id) {
      await client.query("DELETE FROM fs_migrations_ledger WHERE id=$1", [id]);
    },
    async close() {
      await client.end();
    },
  };
}

async function createMigrationDatabase(driver = (process.env.DB_DRIVER || "file").toLowerCase()) {
  if (driver !== "postgres") return createFileDatabase({ dir: ".fastscript", name: "appdb" });
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when DB_DRIVER=postgres");
  }
  return await createPostgresCollectionDatabase({ connectionString: process.env.DATABASE_URL });
}

function migrationFiles() {
  if (!existsSync(MIGRATIONS_DIR)) return [];
  return readdirSync(MIGRATIONS_DIR).filter((file) => /\.(fs|js|mjs|cjs)$/.test(file)).sort();
}

export async function runDbMigrate() {
  const driver = (process.env.DB_DRIVER || "file").toLowerCase();
  const db = await createMigrationDatabase(driver);
  const ledger = await createLedgerAdapter(driver);
  if (!existsSync(MIGRATIONS_DIR)) {
    console.log("db migrate: no app/db/migrations directory");
    return;
  }

  const done = new Set(await ledger.listApplied());
  const files = migrationFiles();
  let count = 0;

  for (const file of files) {
    if (done.has(file)) {
      console.log(`db migrate: skipped ${file} (already applied)`);
      continue;
    }
    const mod = await importSourceModule(join(MIGRATIONS_DIR, file), { platform: "node" });
    const fn = mod.up ?? mod.default;
    if (typeof fn !== "function") {
      console.log(`db migrate: skipped ${file} (missing up/default export)`);
      continue;
    }
    await fn(db);
    await ledger.markApplied(file);
    done.add(file);
    count += 1;
    console.log(`db migrate: applied ${file}`);
  }

  if (db?.flush) await db.flush();
  if (db?.close) await db.close();
  await ledger.close();

  console.log(`db migrate complete: ${count} migration(s)`);
}

export async function runDbRollback(args = []) {
  const driver = (process.env.DB_DRIVER || "file").toLowerCase();
  const db = await createMigrationDatabase(driver);
  const ledger = await createLedgerAdapter(driver);
  const countFlag = args.indexOf("--count");
  const count = Math.max(1, Number(countFlag >= 0 ? args[countFlag + 1] || 1 : 1));
  const applied = await ledger.listApplied();
  const target = applied.slice(-count).reverse();

  if (!target.length) {
    console.log("db rollback: nothing to rollback");
    if (db?.close) await db.close();
    await ledger.close();
    return;
  }

  let rolledBack = 0;
  for (const id of target) {
    const mod = await importSourceModule(join(MIGRATIONS_DIR, id), { platform: "node" });
    const fn = mod.down;
    if (typeof fn !== "function") {
      throw new Error(`db rollback: migration ${id} does not export down(db)`);
    }
    await fn(db);
    await ledger.markRolledBack(id);
    rolledBack += 1;
    console.log(`db rollback: reverted ${id}`);
  }

  if (db?.flush) await db.flush();
  if (db?.close) await db.close();
  await ledger.close();
  console.log(`db rollback complete: ${rolledBack} migration(s)`);
}

export async function runDbSeed() {
  const driver = (process.env.DB_DRIVER || "file").toLowerCase();
  const db = await createMigrationDatabase(driver);
  const seedFile = SEED_FILES.find((p) => existsSync(p));
  if (!seedFile) {
    console.log("db seed: no app/db/seed file");
    if (db?.close) await db.close();
    return;
  }
  const mod = await importSourceModule(seedFile, { platform: "node" });
  const fn = mod.seed ?? mod.default;
  if (typeof fn !== "function") throw new Error("app/db/seed must export seed(db) or default(db)");
  await fn(db);
  if (db?.flush) await db.flush();
  if (db?.close) await db.close();
  console.log("db seed complete");
}
