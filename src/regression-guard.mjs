import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseArgs(args = []) {
  const options = {
    mode: "all",
    autoBaseline: false,
    failOnRegression: true,
    benchmarkLatest: resolve("benchmarks", "suite-latest.json"),
    benchmarkBaseline: resolve("benchmarks", "suite-baseline.json"),
    fidelityLatest: resolve(".fastscript", "conversion", "latest", "fidelity-report.json"),
    fidelityBaseline: resolve(".fastscript", "baselines", "fidelity-baseline.json"),
    out: resolve(".fastscript", "regression", "latest.json"),
    warmBuildBudgetPct: Number(process.env.FASTSCRIPT_REGRESSION_WARM_PCT || 0.15),
    coldBuildBudgetPct: Number(process.env.FASTSCRIPT_REGRESSION_COLD_PCT || 0.2),
    typecheckBudgetPct: Number(process.env.FASTSCRIPT_REGRESSION_TYPECHECK_PCT || 0.2),
    jsBudgetPct: Number(process.env.FASTSCRIPT_REGRESSION_JS_PCT || 0.1),
    cssBudgetPct: Number(process.env.FASTSCRIPT_REGRESSION_CSS_PCT || 0.1),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--mode") {
      const value = String(args[i + 1] || options.mode).toLowerCase();
      options.mode = ["all", "benchmark", "fidelity"].includes(value) ? value : "all";
      i += 1;
      continue;
    }
    if (arg === "--auto-baseline") {
      options.autoBaseline = true;
      continue;
    }
    if (arg === "--no-fail") {
      options.failOnRegression = false;
      continue;
    }
    if (arg === "--benchmark-latest") {
      options.benchmarkLatest = resolve(args[i + 1] || options.benchmarkLatest);
      i += 1;
      continue;
    }
    if (arg === "--benchmark-baseline") {
      options.benchmarkBaseline = resolve(args[i + 1] || options.benchmarkBaseline);
      i += 1;
      continue;
    }
    if (arg === "--fidelity-latest") {
      options.fidelityLatest = resolve(args[i + 1] || options.fidelityLatest);
      i += 1;
      continue;
    }
    if (arg === "--fidelity-baseline") {
      options.fidelityBaseline = resolve(args[i + 1] || options.fidelityBaseline);
      i += 1;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || options.out);
      i += 1;
      continue;
    }
  }

  return options;
}

function budgetExceeded(current, baseline, pct) {
  const max = baseline * (1 + pct);
  return { exceeded: current > max, max };
}

function compareBenchmark(latest, baseline, options) {
  const findings = [];
  const byId = new Map((baseline?.corpora || []).filter((item) => !item.skipped).map((item) => [item.id, item]));

  for (const corpus of latest.corpora || []) {
    if (corpus.skipped) continue;
    const base = byId.get(corpus.id);
    if (!base) continue;

    const checks = [
      {
        metric: "warmBuildP95TrimmedMs",
        current: Number(corpus?.timingsMs?.buildWarm?.p95Trimmed || 0),
        baseline: Number(base?.timingsMs?.buildWarm?.p95Trimmed || 0),
        budgetPct: options.warmBuildBudgetPct,
      },
      {
        metric: "coldBuildMs",
        current: Number(corpus?.timingsMs?.buildCold?.ms || 0),
        baseline: Number(base?.timingsMs?.buildCold?.ms || 0),
        budgetPct: options.coldBuildBudgetPct,
      },
      {
        metric: "typecheckP95TrimmedMs",
        current: Number(corpus?.timingsMs?.typecheck?.p95Trimmed || 0),
        baseline: Number(base?.timingsMs?.typecheck?.p95Trimmed || 0),
        budgetPct: options.typecheckBudgetPct,
      },
      {
        metric: "firstLoadJsGzipBytes",
        current: Number(corpus?.bundles?.js || 0),
        baseline: Number(base?.bundles?.js || 0),
        budgetPct: options.jsBudgetPct,
      },
      {
        metric: "firstLoadCssGzipBytes",
        current: Number(corpus?.bundles?.css || 0),
        baseline: Number(base?.bundles?.css || 0),
        budgetPct: options.cssBudgetPct,
      },
    ];

    for (const check of checks) {
      if (!Number.isFinite(check.current) || !Number.isFinite(check.baseline) || check.baseline <= 0) continue;
      const status = budgetExceeded(check.current, check.baseline, check.budgetPct);
      if (status.exceeded) {
        findings.push({
          domain: "benchmark",
          corpus: corpus.id,
          metric: check.metric,
          current: check.current,
          baseline: check.baseline,
          maxAllowed: Number(status.max.toFixed(2)),
          budgetPct: check.budgetPct,
        });
      }
    }
  }

  return {
    status: findings.length ? "fail" : "pass",
    findings,
    corporaCompared: (latest.corpora || []).filter((item) => !item.skipped).length,
  };
}

function compareFidelity(latest, baseline) {
  const findings = [];

  const latestStatus = String(latest?.status || "unknown");
  const baselineStatus = String(baseline?.status || "unknown");
  if (latestStatus !== "pass") {
    findings.push({ domain: "fidelity", metric: "status", current: latestStatus, baseline: baselineStatus, expected: "pass" });
  }

  const latestChecksFail = (latest?.checks || []).filter((item) => item.status !== "pass").map((item) => item.id);
  if (latestChecksFail.length) {
    findings.push({ domain: "fidelity", metric: "checks", current: latestChecksFail, baseline: [] });
  }

  const latestProbesFail = (latest?.probes || []).filter((item) => item.status !== "pass").map((item) => item.id);
  if (latestProbesFail.length) {
    findings.push({ domain: "fidelity", metric: "probes", current: latestProbesFail, baseline: [] });
  }

  const baselineRequired = new Set((baseline?.required || []).map((item) => String(item || "")));
  const latestRequired = new Set((latest?.required || []).map((item) => String(item || "")));
  for (const id of baselineRequired) {
    if (!latestRequired.has(id)) {
      findings.push({ domain: "fidelity", metric: "requiredProbeMissing", probe: id });
    }
  }

  return {
    status: findings.length ? "fail" : "pass",
    findings,
    requiredCount: latestRequired.size,
  };
}

function ensureBaselineOrLoad(path, latest, options) {
  const baseline = readJson(path, null);
  if (baseline) return { baseline, created: false };
  if (!options.autoBaseline) {
    throw new Error(`regression baseline missing: ${normalize(relative(resolve("."), path))}`);
  }
  writeJson(path, latest);
  return { baseline: latest, created: true };
}

export async function runRegressionGuard(args = []) {
  const options = parseArgs(args);
  const report = {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    benchmark: null,
    fidelity: null,
    baselineCreated: {
      benchmark: false,
      fidelity: false,
    },
    status: "pass",
    findings: [],
  };

  if (options.mode === "all" || options.mode === "benchmark") {
    const latest = readJson(options.benchmarkLatest, null);
    if (!latest) throw new Error(`benchmark latest missing: ${normalize(relative(resolve("."), options.benchmarkLatest))}`);

    const baselineState = ensureBaselineOrLoad(options.benchmarkBaseline, latest, options);
    report.baselineCreated.benchmark = baselineState.created;
    report.benchmark = compareBenchmark(latest, baselineState.baseline, options);
    report.findings.push(...report.benchmark.findings);
  }

  if (options.mode === "all" || options.mode === "fidelity") {
    const latest = readJson(options.fidelityLatest, null);
    if (!latest) throw new Error(`fidelity latest missing: ${normalize(relative(resolve("."), options.fidelityLatest))}`);

    const baselineState = ensureBaselineOrLoad(options.fidelityBaseline, latest, options);
    report.baselineCreated.fidelity = baselineState.created;
    report.fidelity = compareFidelity(latest, baselineState.baseline);
    report.findings.push(...report.fidelity.findings);
  }

  if (report.findings.length) report.status = "fail";

  writeJson(options.out, report);

  console.log(`regression guard: ${report.status}`);
  console.log(`regression report: ${normalize(relative(resolve("."), options.out))}`);

  if (options.failOnRegression && report.status === "fail") {
    throw new Error(`regression guard failed with ${report.findings.length} finding(s)`);
  }
}
