import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

export function applyJsonArrayRetention(path, { timestampField = "ts", maxAgeMs = 1000 * 60 * 60 * 24 * 30 } = {}) {
  const rows = readJson(path, []);
  if (!Array.isArray(rows)) return { kept: 0, removed: 0 };
  const cutoff = Date.now() - maxAgeMs;
  const kept = rows.filter((row) => {
    const raw = row?.[timestampField] || row?.failedAt || row?.createdAt || null;
    const n = typeof raw === "number" ? raw : Date.parse(raw || "");
    return Number.isFinite(n) ? n >= cutoff : true;
  });
  const removed = rows.length - kept.length;
  if (removed > 0) writeFileSync(path, JSON.stringify(kept, null, 2), "utf8");
  return { kept: kept.length, removed };
}

export function sweepFileAges(dir, { maxAgeMs = 1000 * 60 * 60 * 24 * 30 } = {}) {
  const root = resolve(dir);
  if (!existsSync(root)) return { removed: 0 };
  const cutoff = Date.now() - maxAgeMs;
  let removed = 0;
  for (const name of readdirSync(root)) {
    const full = join(root, name);
    const st = statSync(full);
    if (st.isDirectory()) continue;
    if (st.mtimeMs < cutoff) {
      rmSync(full, { force: true });
      removed += 1;
    }
  }
  return { removed };
}

export function runRetentionSweep({ root = ".fastscript" } = {}) {
  const resolved = resolve(root);
  const cacheResult = sweepFileAges(join(resolved, "cache"), {
    maxAgeMs: Number(process.env.RETENTION_CACHE_MS || 1000 * 60 * 60 * 24 * 14),
  });
  const jobsResult = applyJsonArrayRetention(join(resolved, "jobs-dead-letter.json"), {
    timestampField: "failedAt",
    maxAgeMs: Number(process.env.RETENTION_DEAD_LETTER_MS || 1000 * 60 * 60 * 24 * 30),
  });
  return {
    cache: cacheResult,
    deadLetter: jobsResult,
  };
}
