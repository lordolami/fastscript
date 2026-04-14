import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2), "utf8");
}

export function createMetricsStore({ dir = ".fastscript", name = "metrics" } = {}) {
  const root = resolve(dir);
  mkdirSync(root, { recursive: true });
  const file = join(root, `${name}.json`);
  const state = readJson(file, { counters: {}, timings: {} });

  function persist() {
    writeJson(file, state);
  }

  return {
    inc(counter, by = 1) {
      state.counters[counter] = (state.counters[counter] || 0) + by;
      persist();
    },
    observe(nameKey, valueMs) {
      const row = state.timings[nameKey] || { count: 0, total: 0, min: null, max: null };
      row.count += 1;
      row.total += valueMs;
      row.min = row.min === null ? valueMs : Math.min(row.min, valueMs);
      row.max = row.max === null ? valueMs : Math.max(row.max, valueMs);
      state.timings[nameKey] = row;
      persist();
    },
    snapshot() {
      const avg = {};
      for (const [k, row] of Object.entries(state.timings)) {
        avg[k] = row.count > 0 ? Number((row.total / row.count).toFixed(2)) : 0;
      }
      return { counters: { ...state.counters }, timings: { ...state.timings }, averages: avg };
    },
  };
}
