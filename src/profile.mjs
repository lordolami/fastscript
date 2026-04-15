import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { runBuild } from "./build.mjs";
import { runTypeCheck } from "./typecheck.mjs";
import { runBench } from "./bench.mjs";
import { runCompat } from "./compat.mjs";

function parseArgs(args = []) {
  const options = {
    command: "build",
    runs: Math.max(1, Number(process.env.FASTSCRIPT_PROFILE_RUNS || 1)),
    out: resolve(".fastscript", "profile-latest.json"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--command") {
      options.command = String(args[i + 1] || options.command).toLowerCase();
      i += 1;
      continue;
    }
    if (arg === "--runs") {
      options.runs = Math.max(1, Number(args[i + 1] || options.runs));
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

function createRunner(command) {
  switch (command) {
    case "build":
      return () => runBuild({ mode: "build" });
    case "typecheck":
      return () => runTypeCheck(["--mode", "pass"]);
    case "bench":
      return () => runBench();
    case "compat":
      return () => runCompat();
    default:
      throw new Error(`profile: unsupported command '${command}'`);
  }
}

export async function runProfile(args = []) {
  const options = parseArgs(args);
  const runner = createRunner(options.command);
  const runs = [];

  for (let i = 0; i < options.runs; i += 1) {
    const rssBefore = process.memoryUsage().rss;
    const t0 = performance.now();
    await runner();
    const t1 = performance.now();
    const rssAfter = process.memoryUsage().rss;

    runs.push({
      run: i + 1,
      ms: Number((t1 - t0).toFixed(2)),
      rssBeforeMb: Number((rssBefore / (1024 * 1024)).toFixed(2)),
      rssAfterMb: Number((rssAfter / (1024 * 1024)).toFixed(2)),
      rssDeltaMb: Number(((rssAfter - rssBefore) / (1024 * 1024)).toFixed(2)),
    });
  }

  const times = runs.map((row) => row.ms).sort((a, b) => a - b);
  const mean = times.reduce((sum, value) => sum + value, 0) / Math.max(1, times.length);

  const report = {
    generatedAt: new Date().toISOString(),
    command: options.command,
    runs,
    summary: {
      count: runs.length,
      minMs: times[0] || 0,
      medianMs: times[Math.floor(times.length / 2)] || 0,
      maxMs: times[times.length - 1] || 0,
      meanMs: Number(mean.toFixed(2)),
    },
  };

  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`profile complete: command=${options.command}, runs=${runs.length}, mean=${report.summary.meanMs}ms`);
  console.log(`profile report: ${String(relative(resolve("."), options.out)).replace(/\\/g, "/")}`);
}
