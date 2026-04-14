import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { generateCspPolicy } from "./csp.mjs";

function nowMs() {
  return Date.now();
}

function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return fallback;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2), "utf8");
}

export function createMemoryWindowStore() {
  const rows = new Map();
  return {
    async increment(key, windowMs) {
      const now = nowMs();
      const row = rows.get(key) || { count: 0, resetAt: now + windowMs };
      if (now > row.resetAt) {
        row.count = 0;
        row.resetAt = now + windowMs;
      }
      row.count += 1;
      rows.set(key, row);
      return { count: row.count, resetAt: row.resetAt };
    },
  };
}

export function createFileWindowStore({ dir = ".fastscript/security", name = "rate-limit" } = {}) {
  const root = resolve(dir);
  mkdirSync(root, { recursive: true });
  const file = join(root, `${name}.json`);
  const state = readJson(file, { rows: {} });

  function persist() {
    writeJson(file, state);
  }

  return {
    async increment(key, windowMs) {
      const now = nowMs();
      const row = state.rows[key] || { count: 0, resetAt: now + windowMs };
      if (now > row.resetAt) {
        row.count = 0;
        row.resetAt = now + windowMs;
      }
      row.count += 1;
      state.rows[key] = row;
      persist();
      return { count: row.count, resetAt: row.resetAt };
    },
  };
}

export async function createRedisWindowStore({ url = process.env.REDIS_URL, prefix = "fastscript:rate" } = {}) {
  const mod = await import("redis");
  const client = mod.createClient({ url });
  await client.connect();
  return {
    async increment(key, windowMs) {
      const rowKey = `${prefix}:${key}`;
      const count = Number(await client.incr(rowKey));
      if (count === 1) await client.pExpire(rowKey, windowMs);
      const ttl = Number(await client.pTTL(rowKey));
      return { count, resetAt: nowMs() + Math.max(0, ttl) };
    },
    async close() {
      await client.quit();
    },
  };
}

export async function createWindowStore({ driver = process.env.RATE_LIMIT_DRIVER || "memory", ...opts } = {}) {
  const mode = String(driver || "memory").toLowerCase();
  if (mode === "redis") {
    try {
      return await createRedisWindowStore(opts);
    } catch {
      return createMemoryWindowStore();
    }
  }
  if (mode === "file") return createFileWindowStore(opts);
  return createMemoryWindowStore();
}

export function securityHeaders({
  csp,
  target = process.env.DEPLOY_TARGET || "node",
  hsts = "max-age=31536000; includeSubDomains",
} = {}) {
  return async function securityHeadersMiddleware(ctx, next) {
    const mode = process.env.NODE_ENV || "development";
    const cspPolicy = csp || generateCspPolicy({ target, mode });
    ctx.res.setHeader("x-content-type-options", "nosniff");
    ctx.res.setHeader("x-frame-options", "DENY");
    ctx.res.setHeader("referrer-policy", "strict-origin-when-cross-origin");
    ctx.res.setHeader("permissions-policy", "geolocation=(), microphone=(), camera=()");
    ctx.res.setHeader("content-security-policy", cspPolicy);
    if (mode === "production") {
      ctx.res.setHeader("strict-transport-security", hsts);
    }
    return next();
  };
}

export function rateLimit({
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max = Number(process.env.RATE_LIMIT_MAX || 120),
  key = (ctx) => ctx.req.socket.remoteAddress || "anon",
  store,
} = {}) {
  const lazy = { store: store || null, pending: null };
  async function getStore() {
    if (lazy.store) return lazy.store;
    if (!lazy.pending) lazy.pending = createWindowStore({ name: "rate-limit" }).then((s) => { lazy.store = s; return s; });
    return lazy.pending;
  }
  return async function rateLimitMiddleware(ctx, next) {
    const s = await getStore();
    const row = await s.increment(String(key(ctx)), windowMs);
    ctx.res.setHeader("x-ratelimit-limit", String(max));
    ctx.res.setHeader("x-ratelimit-remaining", String(Math.max(0, max - row.count)));
    if (row.count > max) {
      return {
        status: 429,
        json: { ok: false, error: "rate_limited" },
        headers: { "retry-after": String(Math.ceil((row.resetAt - nowMs()) / 1000)) },
      };
    }
    return next();
  };
}

export function requestQuota({
  windowMs = Number(process.env.QUOTA_WINDOW_MS || 60_000),
  max = Number(process.env.QUOTA_MAX || 600),
  store,
} = {}) {
  const lazy = { store: store || null, pending: null };
  async function getStore() {
    if (lazy.store) return lazy.store;
    if (!lazy.pending) lazy.pending = createWindowStore({ name: "request-quotas" }).then((s) => { lazy.store = s; return s; });
    return lazy.pending;
  }
  return async function requestQuotaMiddleware(ctx, next) {
    const principal = ctx.user?.id || ctx.req.socket.remoteAddress || "anon";
    const route = (ctx.pathname || "/").split("/").slice(0, 2).join("/") || "/";
    const key = `${principal}:${route}`;
    const s = await getStore();
    const row = await s.increment(key, windowMs);
    if (row.count > max) {
      return {
        status: 429,
        json: { ok: false, error: "quota_exceeded", route, principal },
      };
    }
    return next();
  };
}

export function abuseGuard({
  scoreWindowMs = Number(process.env.ABUSE_WINDOW_MS || 120_000),
  threshold = Number(process.env.ABUSE_THRESHOLD || 80),
  blockMs = Number(process.env.ABUSE_BLOCK_MS || 300_000),
} = {}) {
  const score = new Map();
  const blocked = new Map();
  return async function abuseGuardMiddleware(ctx, next) {
    const key = ctx.req.socket.remoteAddress || "anon";
    const now = nowMs();
    const blockUntil = blocked.get(key) || 0;
    if (blockUntil > now) {
      return { status: 429, json: { ok: false, error: "abuse_blocked", retryAt: blockUntil } };
    }

    const row = score.get(key) || { value: 0, resetAt: now + scoreWindowMs };
    if (now > row.resetAt) {
      row.value = 0;
      row.resetAt = now + scoreWindowMs;
    }
    const method = (ctx.method || "GET").toUpperCase();
    row.value += ["POST", "PUT", "PATCH", "DELETE"].includes(method) ? 3 : 1;
    if ((ctx.pathname || "").startsWith("/api/")) row.value += 1;
    score.set(key, row);

    if (row.value >= threshold) {
      blocked.set(key, now + blockMs);
      return { status: 429, json: { ok: false, error: "abuse_detected", blockedForMs: blockMs } };
    }

    return next();
  };
}

export function csrf({ cookieName = "fs_csrf", headerName = "x-csrf-token" } = {}) {
  return async function csrfMiddleware(ctx, next) {
    const method = ctx.method || "GET";
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      const token = ctx.cookies[cookieName] || createHash("sha256").update(`${nowMs()}-${Math.random()}`).digest("hex");
      ctx.helpers.setCookie(cookieName, token, { path: "/", sameSite: "Lax", secure: parseBool(process.env.SESSION_COOKIE_SECURE, false) });
      return next();
    }
    const cookie = ctx.cookies[cookieName];
    const hasCookieHeader = Boolean(ctx.req.headers.cookie);
    if (!cookie && !hasCookieHeader) {
      return next();
    }
    const header = ctx.req.headers[headerName];
    const token = Array.isArray(header) ? header[0] : header;
    if (!cookie || !token || cookie !== token) {
      return { status: 403, json: { ok: false, error: "csrf_invalid" } };
    }
    return next();
  };
}
