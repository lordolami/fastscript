import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { importSourceModule } from "./module-loader.mjs";

const DEFAULT_OUT = resolve(".fastscript", "security-readiness-report.json");
const REQUIRED_HEADERS = [
  "x-content-type-options:nosniff",
  "x-frame-options:sameorigin",
  "referrer-policy:strict-origin-when-cross-origin",
];
const SECRET_KEY_PATTERN = /(SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY|DATABASE_URL|REDIS_URL|WEBHOOK_SECRET|SESSION_SECRET)/i;

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", ".fastscript", "dist"].includes(entry.name)) continue;
      out.push(...walk(full));
      continue;
    }
    if (entry.isFile()) out.push(full);
  }
  return out;
}

function parseArgs(args = []) {
  const options = {
    path: resolve("."),
    mode: "report",
    out: DEFAULT_OUT,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--path") {
      options.path = resolve(args[i + 1] || options.path);
      i += 1;
      continue;
    }
    if (arg === "--mode") {
      const mode = String(args[i + 1] || "report").toLowerCase();
      options.mode = mode === "fail" ? "fail" : "report";
      i += 1;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || options.out);
      i += 1;
    }
  }

  return options;
}

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function addDiagnostic(diagnostics, payload) {
  diagnostics.push({
    severity: "error",
    ...payload,
  });
}

async function loadEnvSchema(root) {
  const fsSchema = join(root, "app", "env.schema.fs");
  const jsSchema = join(root, "app", "env.schema.js");
  const schemaPath = existsSync(fsSchema) ? fsSchema : existsSync(jsSchema) ? jsSchema : null;
  if (!schemaPath) return { path: null, schema: {} };
  const mod = schemaPath.endsWith(".fs")
    ? await importSourceModule(schemaPath, { platform: "node" })
    : await import(`${pathToFileURL(schemaPath).href}?t=${Date.now()}`);
  return { path: schemaPath, schema: mod.schema || mod.default || {} };
}

function schemaHasKey(schema, key) {
  return Object.prototype.hasOwnProperty.call(schema || {}, key);
}

function isSecretKey(key) {
  const normalized = String(key || "").toUpperCase();
  if (!normalized) return false;
  if (normalized.includes("PUBLIC")) return false;
  return SECRET_KEY_PATTERN.test(normalized);
}

function detectSecretRefs(source) {
  const refs = [];
  const pattern = /process\.env\.([A-Z][A-Z0-9_]*)/g;
  let match = pattern.exec(source);
  while (match) {
    const key = match[1];
    if (isSecretKey(key)) refs.push({ key, index: match.index, ref: match[0] });
    match = pattern.exec(source);
  }
  return refs;
}

function isClientPath(file) {
  const normalized = normalizePath(file);
  return normalized.includes("/app/pages/") || normalized.endsWith(".client.fs") || normalized.endsWith(".client.ts") || normalized.endsWith(".client.js");
}

function isApiPath(file) {
  return normalizePath(file).includes("/app/api/");
}

function hasObviousResponseLeak(source, ref) {
  const escaped = ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`ctx\\.helpers\\.json\\s*\\([\\s\\S]{0,240}${escaped}`, "m"),
    new RegExp(`return\\s+\\{[\\s\\S]{0,240}${escaped}`, "m"),
    new RegExp(`return\\s+\`[\\s\\S]{0,240}${escaped}`, "m"),
    new RegExp(`return\\s+\\([\\s\\S]{0,240}${escaped}`, "m")
  ];
  return patterns.some((pattern) => pattern.test(String(source || "")));
}

function hasProtectedAuthUsage(source) {
  return /ctx\.auth|requireUser\s*\(|fs_session|x-csrf-token|fs_csrf/.test(String(source || ""));
}

function hasWebhookUsage(file, source) {
  const normalized = normalizePath(file);
  return normalized.includes("/webhook.") || /verifyWebhookRequest|WEBHOOK_SECRET/.test(String(source || ""));
}

function collectSecuritySignals(files) {
  let authUsed = false;
  let webhookUsed = false;
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (hasProtectedAuthUsage(source)) authUsed = true;
    if (hasWebhookUsage(file, source)) webhookUsed = true;
  }
  return { authUsed, webhookUsed };
}

function validateDeployHeaders(root, diagnostics) {
  const vercelPath = join(root, "vercel.json");
  if (!existsSync(vercelPath)) return;
  const vercel = readJson(vercelPath, {});
  const headers = (vercel.headers || [])
    .flatMap((entry) => entry.headers || [])
    .map((entry) => `${String(entry.key || "").toLowerCase()}:${String(entry.value || "").toLowerCase()}`);
  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      addDiagnostic(diagnostics, {
        code: "FS4306",
        file: normalizePath(relative(resolve("."), vercelPath)),
        message: `Deploy header baseline missing required header ${required}.`,
      });
    }
  }
}

function validatePermissionPolicy(root, diagnostics) {
  const policyPath = join(root, "fastscript.permissions.json");
  if (!existsSync(policyPath)) {
    addDiagnostic(diagnostics, {
      code: "FS4303",
      file: normalizePath(relative(resolve("."), policyPath)),
      message: "Missing fastscript.permissions.json. FastScript v4.1 requires an explicit production permissions policy.",
    });
    return { path: policyPath, policy: null };
  }
  const policy = readJson(policyPath, {});
  if (String(policy?.preset || "").toLowerCase() !== "secure") {
    addDiagnostic(diagnostics, {
      code: "FS4304",
      file: normalizePath(relative(resolve("."), policyPath)),
      message: "fastscript.permissions.json must use the secure preset for the v4.1 production security contract.",
    });
  }
  return { path: policyPath, policy };
}

function validateEnvContract(root, schemaPath, schema, signals, diagnostics) {
  const required = new Set(["MAX_BODY_BYTES", "REQUEST_TIMEOUT_MS"]);
  if (signals.authUsed) required.add("SESSION_SECRET");
  if (signals.webhookUsed) required.add("WEBHOOK_SECRET");

  if (!schemaPath) {
    addDiagnostic(diagnostics, {
      code: "FS4305",
      file: normalizePath(relative(resolve("."), join(root, "app", "env.schema.fs"))),
      message: "Missing app/env.schema.fs. FastScript v4.1 requires an explicit env schema for production security readiness.",
    });
    return;
  }

  for (const key of required) {
    if (!schemaHasKey(schema, key)) {
      addDiagnostic(diagnostics, {
        code: "FS4305",
        file: normalizePath(relative(resolve("."), schemaPath)),
        message: `Env schema missing required security key ${key}.`,
      });
    }
  }
}

function validateSecretExposure(files, diagnostics) {
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const refs = detectSecretRefs(source);
    if (!refs.length) continue;
    for (const ref of refs) {
      if (isClientPath(file)) {
        addDiagnostic(diagnostics, {
          code: "FS4301",
          file: normalizePath(relative(resolve("."), file)),
          message: `Secret-like env value ${ref.key} is referenced from a browser/public page surface. Move it to server-only flow or a validated backend boundary.`,
        });
        continue;
      }
      if (isApiPath(file) && hasObviousResponseLeak(source, ref.ref)) {
        addDiagnostic(diagnostics, {
          code: "FS4302",
          file: normalizePath(relative(resolve("."), file)),
          message: `Secret-like env value ${ref.key} appears to flow into a public API response. Keep secrets server-only and return derived state instead.`,
        });
      }
    }
  }
}

export async function runSecurityReadiness(args = []) {
  const options = parseArgs(args);
  const root = options.path;
  const diagnostics = [];
  const files = walk(join(root, "app")).filter((file) => /\.(fs|js|ts|jsx|tsx)$/i.test(file));
  const permissionPolicy = validatePermissionPolicy(root, diagnostics);
  const { path: schemaPath, schema } = await loadEnvSchema(root);
  const signals = collectSecuritySignals(files);
  validateEnvContract(root, schemaPath, schema, signals, diagnostics);
  validateDeployHeaders(root, diagnostics);
  validateSecretExposure(files, diagnostics);

  const report = {
    generatedAt: new Date().toISOString(),
    root: normalizePath(root),
    filesScanned: files.length,
    checks: {
      explicitPermissionsPolicy: Boolean(permissionPolicy.policy),
      securePreset: String(permissionPolicy.policy?.preset || "").toLowerCase() === "secure",
      envSchemaPresent: Boolean(schemaPath),
      authUsed: signals.authUsed,
      webhookUsed: signals.webhookUsed,
      diagnostics: diagnostics.length,
    },
    diagnostics,
  };

  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (options.mode === "fail" && diagnostics.length > 0) {
    const preview = diagnostics.map((entry) => `${entry.code} ${entry.file}: ${entry.message}`).join("; ");
    throw new Error(`security readiness failed: ${preview}`);
  }

  console.log(`security readiness complete: files=${files.length}, diagnostics=${diagnostics.length}`);
  console.log(`security readiness report: ${normalizePath(relative(resolve("."), options.out))}`);
  return report;
}
