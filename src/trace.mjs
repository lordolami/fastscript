import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { runCheck } from "./check.mjs";
import { runBuild } from "./build.mjs";
import { runTypeCheck } from "./typecheck.mjs";
import { runBench } from "./bench.mjs";
import { createTracer } from "./observability.mjs";

function parseArgs(args = []) {
  const options = {
    pipeline: ["check", "typecheck", "build", "bench"],
    out: resolve(".fastscript", "trace-latest.json"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--pipeline") {
      const next = String(args[i + 1] || "").trim();
      if (next) options.pipeline = next.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
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

async function runStage(stage) {
  switch (stage) {
    case "check":
      await runCheck();
      return;
    case "typecheck":
      await runTypeCheck(["--mode", "pass"]);
      return;
    case "build":
      await runBuild({ mode: "build" });
      return;
    case "bench":
      await runBench();
      return;
    default:
      throw new Error(`trace: unsupported stage '${stage}'`);
  }
}

export async function runTrace(args = []) {
  const options = parseArgs(args);
  const tracer = createTracer({ service: "fastscript-cli" });
  const spans = [];

  for (const stage of options.pipeline) {
    const startedAt = Date.now();
    const span = tracer.span(stage, { stage });
    try {
      await runStage(stage);
      const durationMs = Date.now() - startedAt;
      span.end({ status: "pass", durationMs });
      spans.push({ stage, status: "pass", durationMs, startedAt: new Date(startedAt).toISOString() });
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      span.end({ status: "fail", durationMs, error: String(error?.message || error) });
      spans.push({
        stage,
        status: "fail",
        durationMs,
        startedAt: new Date(startedAt).toISOString(),
        error: String(error?.message || error),
      });
      break;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    pipeline: options.pipeline,
    spans,
    status: spans.some((item) => item.status === "fail") ? "fail" : "pass",
  };

  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (report.status === "fail") {
    throw new Error(`trace failed: ${spans.find((item) => item.status === "fail")?.stage || "unknown"}`);
  }

  console.log(`trace complete: ${options.pipeline.join(", ")}`);
  console.log(`trace report: ${String(relative(resolve("."), options.out)).replace(/\\/g, "/")}`);
}
