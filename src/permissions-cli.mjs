import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { createPermissionRuntime } from "./runtime-permissions.mjs";

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function parseArgs(args = []) {
  const options = {
    policy: process.env.FASTSCRIPT_PERMISSION_POLICY_PATH || "fastscript.permissions.json",
    mode: "report",
    kind: "",
    resource: "",
    out: "",
    json: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--policy") {
      options.policy = args[i + 1] || options.policy;
      i += 1;
      continue;
    }
    if (arg === "--mode") {
      const next = String(args[i + 1] || "report").toLowerCase();
      options.mode = next === "assert" ? "assert" : "report";
      i += 1;
      continue;
    }
    if (arg === "--kind") {
      options.kind = String(args[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--resource") {
      options.resource = String(args[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
  }

  return options;
}

function summarizePolicy(policyRuntime) {
  const policy = policyRuntime.policy;
  return {
    policyPath: normalize(relative(resolve("."), policyRuntime.policyPath)),
    preset: policy.preset,
    boundaries: {
      fileAccess: policy.fileAccess.mode,
      envAccess: policy.envAccess.mode,
      networkAccess: policy.networkAccess.mode,
      subprocessExecution: policy.subprocessExecution.mode,
      dynamicImports: policy.dynamicImports.mode,
      pluginAccess: policy.pluginAccess.mode,
    },
  };
}

export async function runPermissions(args = []) {
  const options = parseArgs(args);
  const runtime = createPermissionRuntime({ policyPath: options.policy });

  const summary = summarizePolicy(runtime);
  let decision = null;

  if (options.kind && options.resource) {
    if (options.mode === "assert") {
      decision = runtime.assert({ kind: options.kind, resource: options.resource });
    } else {
      decision = runtime.check({ kind: options.kind, resource: options.resource });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    decision,
  };

  if (options.out) {
    mkdirSync(dirname(options.out), { recursive: true });
    writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`permissions policy: ${summary.policyPath}`);
  console.log(`preset: ${summary.preset}`);
  for (const [boundary, mode] of Object.entries(summary.boundaries)) {
    console.log(`${boundary}: ${mode}`);
  }
  if (decision) {
    console.log(`decision: ${decision.allowed ? "allow" : "deny"} (${decision.boundary})`);
    console.log(`reason: ${decision.reason}`);
  }
}
