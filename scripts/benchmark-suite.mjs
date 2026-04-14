import { cpus, totalmem } from "node:os";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { performance } from "node:perf_hooks";
import { spawn } from "node:child_process";
import { parseFastScript } from "../src/fs-parser.mjs";
import { runTypeCheck } from "../src/typecheck.mjs";
import { runBuild } from "../src/build.mjs";

const OUT_DIR = resolve("benchmarks");
const OUT_FILE = join(OUT_DIR, "suite-latest.json");
const RUNS = Math.max(3, Number(process.env.FASTSCRIPT_BENCH_RUNS || 10));
const SAMPLE_MS = 10;

const CORPORA = [
  { id: "repo-app", root: resolve(".") },
  { id: "yomiru", root: resolve("yomiru") },
  { id: "example-startup-mvp", root: resolve("examples", "startup-mvp") },
  { id: "example-fullstack", root: resolve("examples", "fullstack") },
];

mkdirSync(OUT_DIR, { recursive: true });

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function gzipSize(path) {
  if (!existsSync(path)) return 0;
  return gzipSync(readFileSync(path), { level: 9 }).byteLength;
}

function q(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.max(0, Math.min(sorted.length - 1, Math.round((p / 100) * (sorted.length - 1))));
  return sorted[idx];
}

function summarize(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const trim = sorted.length >= 5 ? 1 : 0;
  const trimmed = trim ? sorted.slice(trim, sorted.length - trim) : sorted;
  const mean = trimmed.length ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length : 0;
  return {
    runs: sorted,
    runsTrimmed: trimmed,
    min: sorted[0] || 0,
    max: sorted[sorted.length - 1] || 0,
    median: q(sorted, 50),
    p95: q(sorted, 95),
    p95Trimmed: q(trimmed, 95),
    meanTrimmed: mean,
  };
}

function runCliBuild({ repoRoot, cwd }) {
  return new Promise((resolveRun, rejectRun) => {
    const runnerPath = join(repoRoot, "scripts", "benchmark-build-runner.mjs");
    const child = spawn(process.execPath, [runnerPath], {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      env: { ...process.env, NODE_ENV: "production" },
    });
    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk || "");
    });
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code !== 0) {
        rejectRun(new Error(`build command failed with exit code ${code}`));
        return;
      }
      try {
        const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "{}";
        const parsed = JSON.parse(line);
        resolveRun({ ms: Number(parsed.ms || 0), peakRssMb: Number(parsed.peakRssMb || 0) });
      } catch (error) {
        rejectRun(new Error(`failed to parse build runner output: ${error?.message || error}`));
      }
    });
  });
}

async function withCwd(cwd, fn) {
  const prev = process.cwd();
  process.chdir(cwd);
  try {
    return await fn();
  } finally {
    process.chdir(prev);
  }
}

async function silenceConsole(fn) {
  const original = { log: console.log, warn: console.warn, error: console.error };
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  try {
    return await fn();
  } finally {
    console.log = original.log;
    console.warn = original.warn;
    console.error = original.error;
  }
}

async function measureWithPeak(fn) {
  let peakRss = process.memoryUsage().rss;
  const timer = setInterval(() => {
    const rss = process.memoryUsage().rss;
    if (rss > peakRss) peakRss = rss;
  }, SAMPLE_MS);
  const t0 = performance.now();
  await fn();
  const t1 = performance.now();
  clearInterval(timer);
  return { ms: t1 - t0, peakRssMb: peakRss / (1024 * 1024) };
}

function resolveAsset(assetManifest, logicalName) {
  return assetManifest?.mapping?.[logicalName] || logicalName;
}

function bundleSnapshot(corpusRoot) {
  const distDir = join(corpusRoot, "dist");
  const manifestPath = join(distDir, "fastscript-manifest.json");
  const assetManifestPath = join(distDir, "asset-manifest.json");
  if (!existsSync(manifestPath)) {
    return { js: 0, css: 0, routes: 0, apiRoutes: 0 };
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const assets = existsSync(assetManifestPath) ? JSON.parse(readFileSync(assetManifestPath, "utf8")) : { mapping: {} };
  return {
    js: gzipSize(join(distDir, resolveAsset(assets, "router.js"))),
    css: gzipSize(join(distDir, resolveAsset(assets, "styles.css"))),
    routes: manifest.routes.length,
    apiRoutes: manifest.apiRoutes?.length ?? 0,
  };
}

async function runCorpus(corpus) {
  const repoRoot = resolve(".");
  const appDir = join(corpus.root, "app");
  if (!existsSync(appDir)) {
    return { id: corpus.id, skipped: true, reason: "missing app directory" };
  }

  const fsFiles = walk(appDir).filter((file) => file.endsWith(".fs"));

  const parseRuns = [];
  for (let i = 0; i < RUNS; i += 1) {
    const start = performance.now();
    for (const file of fsFiles) {
      const src = readFileSync(file, "utf8");
      parseFastScript(src, { file, mode: "lenient", recover: true });
    }
    parseRuns.push(performance.now() - start);
  }

  const typeRuns = [];
  let typePeakRssMb = 0;
  for (let i = 0; i < RUNS; i += 1) {
    const measured = await measureWithPeak(async () => {
      await withCwd(corpus.root, async () => {
        await silenceConsole(async () => {
          await runTypeCheck(["--mode", "pass", "--path", appDir]);
        });
      });
    });
    typeRuns.push(measured.ms);
    typePeakRssMb = Math.max(typePeakRssMb, measured.peakRssMb);
  }

  let typecheckSummary = { errors: 0, warnings: 0 };
  const typeReportPath = join(corpus.root, ".fastscript", "typecheck-report.json");
  if (existsSync(typeReportPath)) {
    const report = JSON.parse(readFileSync(typeReportPath, "utf8"));
    typecheckSummary = {
      errors: report?.summary?.errors ?? 0,
      warnings: report?.summary?.warnings ?? 0,
    };
  }

  let coldBuild = null;
  let warmBuildSummary = null;
  let buildPeakRssMb = null;
  let buildError = null;
  try {
    if (corpus.id === "repo-app") {
      coldBuild = await measureWithPeak(async () => {
        await withCwd(corpus.root, async () => {
          await silenceConsole(async () => {
            await runBuild();
          });
        });
      });
      buildPeakRssMb = coldBuild.peakRssMb;
    } else {
      const measured = await runCliBuild({ repoRoot, cwd: corpus.root });
      coldBuild = { ms: measured.ms };
      buildPeakRssMb = measured.peakRssMb;
    }

    const warmRuns = [];
    for (let i = 0; i < RUNS; i += 1) {
      if (corpus.id === "repo-app") {
        const measured = await measureWithPeak(async () => {
          await withCwd(corpus.root, async () => {
            await silenceConsole(async () => {
              await runBuild();
            });
          });
        });
        warmRuns.push(measured.ms);
        buildPeakRssMb = Math.max(buildPeakRssMb, measured.peakRssMb);
      } else {
        const measured = await runCliBuild({ repoRoot, cwd: corpus.root });
        warmRuns.push(measured.ms);
        buildPeakRssMb = Math.max(buildPeakRssMb || 0, measured.peakRssMb);
      }
    }
    warmBuildSummary = summarize(warmRuns);
  } catch (error) {
    buildError = String(error?.message || error);
  }

  const parseSummary = summarize(parseRuns);
  const typeSummary = summarize(typeRuns);
  const bundles = bundleSnapshot(corpus.root);

  return {
    id: corpus.id,
    root: corpus.root,
    skipped: false,
    corpus: { appFsFiles: fsFiles.length },
    typecheckSummary,
    timingsMs: {
      parsePerCorpus: parseSummary,
      typecheck: typeSummary,
      buildCold: coldBuild ? { ms: coldBuild.ms } : null,
      buildWarm: warmBuildSummary,
    },
    memoryPeakMb: {
      typecheck: typePeakRssMb,
      build: buildPeakRssMb,
    },
    bundles,
    buildError,
      hardLimitCheck: {
        parsePerFileUnder100ms: (parseSummary.p95 / Math.max(1, fsFiles.length)) <= 100,
        typecheckPer100FilesUnder500ms: typeSummary.p95 <= 500,
      warmBuildUnder2000ms: warmBuildSummary ? warmBuildSummary.p95Trimmed <= 2000 : null,
      coldBuildUnder5000ms: coldBuild ? coldBuild.ms <= 5000 : null,
      firstLoadJsUnder5kb: bundles.js <= 5 * 1024,
    },
  };
}

const perCorpus = [];
for (const corpus of CORPORA) {
  perCorpus.push(await runCorpus(corpus));
}

const report = {
  generatedAt: new Date().toISOString(),
  protocol: {
    runs: RUNS,
    outlierDiscard: RUNS >= 5 ? "discard 1 min and 1 max for trimmed mean" : "none",
    sampleIntervalMs: SAMPLE_MS,
  },
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpuModel: cpus()?.[0]?.model || "unknown",
    cpuCount: cpus()?.length || 0,
    totalMemoryMb: totalmem() / (1024 * 1024),
  },
  corpora: perCorpus,
};

writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`benchmark suite generated: ${OUT_FILE}`);
