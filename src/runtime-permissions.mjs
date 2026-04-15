import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const DEFAULT_POLICY_PATH = resolve("fastscript.permissions.json");

const DEFAULT_POLICY = Object.freeze({
  version: 1,
  preset: "compat",
  audit: {
    enabled: true,
    path: ".fastscript/permissions-audit.jsonl",
  },
  fileAccess: {
    mode: "allow",
    allow: ["**"],
    deny: [],
  },
  envAccess: {
    mode: "allow",
    allow: ["*"],
    deny: [],
  },
  networkAccess: {
    mode: "allow",
    allowHosts: ["*"],
    denyHosts: [],
  },
  subprocessExecution: {
    mode: "allow",
    allowPrefixes: [],
    denyPrefixes: [],
  },
  dynamicImports: {
    mode: "allow",
    allowKinds: ["relative", "absolute", "package", "fileUrl", "dataUrl", "httpUrl", "httpsUrl"],
    denyKinds: [],
  },
  pluginAccess: {
    mode: "allow",
    allow: ["*"],
    deny: [],
  },
});

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_POLICY));
}

function normalizeSlashes(value) {
  return String(value || "").replace(/\\/g, "/");
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function wildcardToRegex(pattern) {
  const escaped = String(pattern || "")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "::DOUBLE_STAR::")
    .replace(/\*/g, "[^/]*")
    .replace(/::DOUBLE_STAR::/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

function matchesAny(patterns, value) {
  if (!Array.isArray(patterns) || patterns.length === 0) return false;
  const input = normalizeSlashes(value);
  for (const pattern of patterns) {
    if (String(pattern || "") === "*") return true;
    const regex = wildcardToRegex(normalizeSlashes(pattern));
    if (regex.test(input)) return true;
  }
  return false;
}

function parseCommand(resource) {
  if (Array.isArray(resource)) return resource.map((item) => String(item || "")).filter(Boolean);
  const text = String(resource || "").trim();
  if (!text) return [];
  return text.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^['"]|['"]$/g, "")) || [];
}

function startsWithPrefix(tokens, prefixes) {
  if (!tokens.length || !Array.isArray(prefixes) || !prefixes.length) return false;
  for (const prefix of prefixes) {
    const parts = parseCommand(prefix);
    if (!parts.length || parts.length > tokens.length) continue;
    let ok = true;
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i] !== tokens[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

function classifyImport(resource) {
  const specifier = String(resource || "");
  if (specifier.startsWith("./") || specifier.startsWith("../")) return "relative";
  if (specifier.startsWith("/") || /^[A-Za-z]:[\\/]/.test(specifier)) return "absolute";
  if (specifier.startsWith("file:")) return "fileUrl";
  if (specifier.startsWith("data:")) return "dataUrl";
  if (specifier.startsWith("http:")) return "httpUrl";
  if (specifier.startsWith("https:")) return "httpsUrl";
  return "package";
}

function normalizeMode(mode, fallback = "allow") {
  const value = String(mode || fallback).toLowerCase();
  return value === "deny" ? "deny" : "allow";
}

function mergePolicy(base, override) {
  const policy = {
    ...base,
    ...(override || {}),
  };

  for (const key of ["audit", "fileAccess", "envAccess", "networkAccess", "subprocessExecution", "dynamicImports", "pluginAccess"]) {
    policy[key] = {
      ...(base[key] || {}),
      ...((override || {})[key] || {}),
    };
  }

  policy.fileAccess.mode = normalizeMode(policy.fileAccess.mode);
  policy.envAccess.mode = normalizeMode(policy.envAccess.mode);
  policy.networkAccess.mode = normalizeMode(policy.networkAccess.mode);
  policy.subprocessExecution.mode = normalizeMode(policy.subprocessExecution.mode);
  policy.dynamicImports.mode = normalizeMode(policy.dynamicImports.mode);
  policy.pluginAccess.mode = normalizeMode(policy.pluginAccess.mode);

  return policy;
}

function applyPreset(policy) {
  const preset = String(process.env.FASTSCRIPT_PERMISSION_PRESET || policy.preset || "compat").toLowerCase();
  if (preset !== "secure") return policy;

  return mergePolicy(policy, {
    preset: "secure",
    networkAccess: { mode: "deny", allowHosts: [] },
    subprocessExecution: { mode: "deny", allowPrefixes: [] },
    pluginAccess: { mode: "deny", allow: [] },
    dynamicImports: { mode: "allow", allowKinds: ["relative", "absolute", "fileUrl", "dataUrl"], denyKinds: ["httpUrl", "httpsUrl"] },
  });
}

export function loadPermissionPolicy({ root = process.cwd(), policyPath = process.env.FASTSCRIPT_PERMISSION_POLICY_PATH || DEFAULT_POLICY_PATH } = {}) {
  const base = cloneDefault();
  const abs = resolve(root, policyPath);
  const filePolicy = readJson(abs, {});
  const merged = applyPreset(mergePolicy(base, filePolicy));
  return { path: abs, policy: merged };
}

export function evaluateRuntimePermission(policy, { kind, resource, details = {} } = {}) {
  const p = policy || cloneDefault();
  const event = { kind: String(kind || ""), resource: String(resource || ""), details };

  if (event.kind === "fileAccess") {
    const cfg = p.fileAccess || {};
    if (cfg.mode === "deny") return { allowed: false, reason: "file access denied by policy", boundary: "fileAccess" };
    if (matchesAny(cfg.deny, event.resource)) return { allowed: false, reason: "file path denied", boundary: "fileAccess" };
    if (!matchesAny(cfg.allow, event.resource)) return { allowed: false, reason: "file path not allowlisted", boundary: "fileAccess" };
    return { allowed: true, reason: "file access allowed", boundary: "fileAccess" };
  }

  if (event.kind === "envAccess") {
    const cfg = p.envAccess || {};
    if (cfg.mode === "deny") return { allowed: false, reason: "env access denied by policy", boundary: "envAccess" };
    if (matchesAny(cfg.deny, event.resource)) return { allowed: false, reason: "env key denied", boundary: "envAccess" };
    if (!matchesAny(cfg.allow, event.resource)) return { allowed: false, reason: "env key not allowlisted", boundary: "envAccess" };
    return { allowed: true, reason: "env access allowed", boundary: "envAccess" };
  }

  if (event.kind === "networkAccess") {
    const cfg = p.networkAccess || {};
    if (cfg.mode === "deny") return { allowed: false, reason: "network access denied by policy", boundary: "networkAccess" };
    let host = event.resource;
    try {
      host = new URL(event.resource).host || host;
    } catch {}
    if (matchesAny(cfg.denyHosts, host)) return { allowed: false, reason: "host denied", boundary: "networkAccess" };
    if (!matchesAny(cfg.allowHosts, host)) return { allowed: false, reason: "host not allowlisted", boundary: "networkAccess" };
    return { allowed: true, reason: "network access allowed", boundary: "networkAccess" };
  }

  if (event.kind === "subprocessExecution") {
    const cfg = p.subprocessExecution || {};
    if (cfg.mode === "deny") return { allowed: false, reason: "subprocess denied by policy", boundary: "subprocessExecution" };
    const tokens = parseCommand(event.resource);
    if (startsWithPrefix(tokens, cfg.denyPrefixes)) return { allowed: false, reason: "subprocess prefix denied", boundary: "subprocessExecution" };
    if (Array.isArray(cfg.allowPrefixes) && cfg.allowPrefixes.length > 0 && !startsWithPrefix(tokens, cfg.allowPrefixes)) {
      return { allowed: false, reason: "subprocess prefix not allowlisted", boundary: "subprocessExecution" };
    }
    return { allowed: true, reason: "subprocess allowed", boundary: "subprocessExecution" };
  }

  if (event.kind === "dynamicImportAccess") {
    const cfg = p.dynamicImports || {};
    const importKind = classifyImport(event.resource);
    if (cfg.mode === "deny") return { allowed: false, reason: "dynamic import denied by policy", boundary: "dynamicImports" };
    if (Array.isArray(cfg.denyKinds) && cfg.denyKinds.includes(importKind)) {
      return { allowed: false, reason: `dynamic import kind denied (${importKind})`, boundary: "dynamicImports" };
    }
    if (Array.isArray(cfg.allowKinds) && cfg.allowKinds.length > 0 && !cfg.allowKinds.includes(importKind)) {
      return { allowed: false, reason: `dynamic import kind not allowlisted (${importKind})`, boundary: "dynamicImports" };
    }
    return { allowed: true, reason: "dynamic import allowed", boundary: "dynamicImports", importKind };
  }

  if (event.kind === "pluginAccess") {
    const cfg = p.pluginAccess || {};
    if (cfg.mode === "deny") return { allowed: false, reason: "plugin access denied by policy", boundary: "pluginAccess" };
    if (matchesAny(cfg.deny, event.resource)) return { allowed: false, reason: "plugin denied", boundary: "pluginAccess" };
    if (!matchesAny(cfg.allow, event.resource)) return { allowed: false, reason: "plugin not allowlisted", boundary: "pluginAccess" };
    return { allowed: true, reason: "plugin access allowed", boundary: "pluginAccess" };
  }

  return { allowed: true, reason: "permission kind not configured", boundary: "unknown" };
}

function appendAudit(policy, row) {
  if (!policy?.audit?.enabled) return;
  const out = resolve(policy.audit.path || ".fastscript/permissions-audit.jsonl");
  mkdirSync(dirname(out), { recursive: true });
  appendFileSync(out, `${JSON.stringify(row)}\n`, "utf8");
}

export function createPermissionRuntime({ root = process.cwd(), policyPath } = {}) {
  const loaded = loadPermissionPolicy({ root, policyPath });
  const policy = loaded.policy;

  return {
    policy,
    policyPath: loaded.path,
    check(input) {
      const decision = evaluateRuntimePermission(policy, input);
      appendAudit(policy, {
        ts: new Date().toISOString(),
        allowed: decision.allowed,
        ...input,
        decision,
      });
      return decision;
    },
    assert(input) {
      const decision = this.check(input);
      if (!decision.allowed) {
        const error = new Error(`permission denied (${decision.boundary}): ${decision.reason}`);
        error.code = "FS7101";
        error.boundary = decision.boundary;
        error.permission = input;
        throw error;
      }
      return decision;
    },
  };
}

export function permissionAwareEnvGet(key, { runtime = createPermissionRuntime(), fallback = undefined } = {}) {
  runtime.assert({ kind: "envAccess", resource: String(key || "") });
  return process.env[key] ?? fallback;
}

export function permissionAwareReadFile(path, { runtime = createPermissionRuntime(), encoding = "utf8" } = {}) {
  const resolved = resolve(path);
  runtime.assert({ kind: "fileAccess", resource: resolved });
  return readFileSync(resolved, encoding);
}

export function permissionAwareSpawn(command, args = [], options = {}, { runtime = createPermissionRuntime() } = {}) {
  const parts = [String(command || ""), ...(Array.isArray(args) ? args.map((item) => String(item || "")) : [])].filter(Boolean);
  runtime.assert({ kind: "subprocessExecution", resource: parts.join(" ") });
  return spawn(command, args, options);
}

export async function permissionAwareFetch(input, init = {}, { runtime = createPermissionRuntime() } = {}) {
  const url = typeof input === "string" ? input : input?.url || String(input || "");
  runtime.assert({ kind: "networkAccess", resource: url });
  return fetch(input, init);
}

export function permissionAwarePluginAccess(pluginId, { runtime = createPermissionRuntime(), onAllowed } = {}) {
  runtime.assert({ kind: "pluginAccess", resource: String(pluginId || "") });
  if (typeof onAllowed === "function") return onAllowed();
  return true;
}
