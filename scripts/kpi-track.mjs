import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const metricsDir = resolve("metrics");
mkdirSync(metricsDir, { recursive: true });

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function weekLabel(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return `${date.getUTCFullYear()}-W${String(Math.floor(diff / 7) + 1).padStart(2, "0")}`;
}

function upsert(path, row) {
  const current = readJson(path, { weeks: [] });
  const idx = current.weeks.findIndex((w) => w.week === row.week);
  if (idx >= 0) current.weeks[idx] = row;
  else current.weeks.push(row);
  writeFileSync(path, JSON.stringify(current, null, 2), "utf8");
}

const week = weekLabel();

upsert(resolve(metricsDir, "reliability-kpis.json"), {
  week,
  five_xx_rate: Number(process.env.KPI_5XX_RATE || 0),
  p95_ms: Number(process.env.KPI_P95_MS || 0),
  deploy_success_rate: Number(process.env.KPI_DEPLOY_SUCCESS || 1),
});

upsert(resolve(metricsDir, "dx-kpis.json"), {
  week,
  time_to_first_page_min: Number(process.env.KPI_TTFP_MIN || 0),
  time_to_prod_min: Number(process.env.KPI_TTPROD_MIN || 0),
  bug_escape_rate: Number(process.env.KPI_BUG_ESCAPE || 0),
});

console.log(`kpi tracking updated for ${week}`);
