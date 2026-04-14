import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { importSourceModule } from "./module-loader.mjs";
import { nextCronRun, normalizeScheduleEntry } from "./scheduler.mjs";

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

function createFileQueue({ dir = ".fastscript" } = {}) {
  const root = resolve(dir);
  mkdirSync(root, { recursive: true });
  const jobsPath = join(root, "jobs.json");
  const deadPath = join(root, "jobs-dead-letter.json");
  const state = readJson(jobsPath, { jobs: [] });
  const dead = readJson(deadPath, { jobs: [] });

  function persist() {
    writeJson(jobsPath, state);
  }
  function persistDead() {
    writeJson(deadPath, dead);
  }

  return {
    type: "file",
    enqueue(name, payload = {}, opts = {}) {
      const now = Date.now();
      const delayMs = opts.delayMs ?? 0;
      const dedupeKey = opts.dedupeKey || null;
      if (dedupeKey) {
        const duplicate = state.jobs.find((j) => j.name === name && j.dedupeKey === dedupeKey);
        if (duplicate) return duplicate;
      }
      const job = {
        id: randomUUID(),
        name,
        payload,
        runAt: now + delayMs,
        attempts: 0,
        maxAttempts: opts.maxAttempts ?? 3,
        backoffMs: opts.backoffMs ?? 250,
        repeatEveryMs: opts.repeatEveryMs ?? 0,
        cron: opts.cron || null,
        timezone: opts.timezone || "UTC",
        dedupeKey,
      };
      state.jobs.push(job);
      persist();
      return job;
    },
    peekReady(limit = 10) {
      const now = Date.now();
      return state.jobs.filter((job) => job.runAt <= now).slice(0, limit);
    },
    ack(id) {
      state.jobs = state.jobs.filter((job) => job.id !== id);
      persist();
    },
    fail(job, error = null) {
      const idx = state.jobs.findIndex((j) => j.id === job.id);
      if (idx < 0) return;
      const current = state.jobs[idx];
      current.attempts += 1;
      if (current.attempts >= current.maxAttempts) {
        dead.jobs.push({
          ...current,
          failedAt: Date.now(),
          error: error ? String(error?.message || error) : null,
        });
        state.jobs.splice(idx, 1);
        persistDead();
      } else {
        current.runAt = Date.now() + current.backoffMs * current.attempts;
      }
      persist();
    },
    deadLetter() {
      return [...dead.jobs];
    },
    replayDeadLetter({ limit = 20, name = null } = {}) {
      const out = [];
      const keep = [];
      for (const row of dead.jobs) {
        if (out.length >= limit) {
          keep.push(row);
          continue;
        }
        if (name && row.name !== name) {
          keep.push(row);
          continue;
        }
        const replay = {
          ...row,
          id: randomUUID(),
          attempts: 0,
          runAt: Date.now(),
        };
        delete replay.failedAt;
        delete replay.error;
        state.jobs.push(replay);
        out.push(replay);
      }
      dead.jobs = keep;
      persist();
      persistDead();
      return out;
    },
    list() {
      return [...state.jobs];
    },
  };
}

export async function createRedisJobQueue({
  url = process.env.REDIS_URL,
  prefix = "fastscript:queue",
} = {}) {
  const mod = await import("redis");
  const client = mod.createClient({ url });
  await client.connect();

  const keys = {
    ready: `${prefix}:ready`,
    dead: `${prefix}:dead`,
  };
  const rowKey = (id) => `${prefix}:job:${id}`;
  const dedupeKey = (name, key) => `${prefix}:dedupe:${name}:${key}`;

  return {
    type: "redis",
    async enqueue(name, payload = {}, opts = {}) {
      const id = randomUUID();
      const runAt = Date.now() + (opts.delayMs ?? 0);
      const row = {
        id,
        name,
        payload,
        runAt,
        attempts: 0,
        maxAttempts: opts.maxAttempts ?? 3,
        backoffMs: opts.backoffMs ?? 250,
        repeatEveryMs: opts.repeatEveryMs ?? 0,
        cron: opts.cron || null,
        timezone: opts.timezone || "UTC",
        dedupeKey: opts.dedupeKey || null,
      };
      if (row.dedupeKey) {
        const key = dedupeKey(name, row.dedupeKey);
        const existing = await client.get(key);
        if (existing) {
          const existingJob = await client.get(rowKey(existing));
          if (existingJob) return JSON.parse(existingJob);
        }
        await client.set(key, id);
      }
      await client.set(rowKey(id), JSON.stringify(row));
      await client.zAdd(keys.ready, { score: runAt, value: id });
      return row;
    },
    async peekReady(limit = 10) {
      const ids = await client.zRangeByScore(keys.ready, 0, Date.now(), { LIMIT: { offset: 0, count: limit } });
      const out = [];
      for (const id of ids) {
        const raw = await client.get(rowKey(id));
        if (!raw) continue;
        out.push(JSON.parse(raw));
      }
      return out;
    },
    async ack(id) {
      const raw = await client.get(rowKey(id));
      if (raw) {
        const row = JSON.parse(raw);
        if (row.dedupeKey) await client.del(dedupeKey(row.name, row.dedupeKey));
      }
      await client.zRem(keys.ready, id);
      await client.del(rowKey(id));
    },
    async fail(job, error = null) {
      const raw = await client.get(rowKey(job.id));
      if (!raw) return;
      const current = JSON.parse(raw);
      current.attempts += 1;
      if (current.attempts >= current.maxAttempts) {
        current.failedAt = Date.now();
        current.error = error ? String(error?.message || error) : null;
        await client.rPush(keys.dead, JSON.stringify(current));
        await this.ack(current.id);
      } else {
        current.runAt = Date.now() + current.backoffMs * current.attempts;
        await client.set(rowKey(current.id), JSON.stringify(current));
        await client.zAdd(keys.ready, { score: current.runAt, value: current.id });
      }
    },
    async deadLetter() {
      const rows = await client.lRange(keys.dead, 0, -1);
      return rows.map((row) => JSON.parse(row));
    },
    async replayDeadLetter({ limit = 20, name = null } = {}) {
      const rows = await this.deadLetter();
      const picked = [];
      const keep = [];
      for (const row of rows) {
        if (picked.length >= limit) {
          keep.push(row);
          continue;
        }
        if (name && row.name !== name) {
          keep.push(row);
          continue;
        }
        picked.push(row);
      }
      await client.del(keys.dead);
      if (keep.length) await client.rPush(keys.dead, ...keep.map((row) => JSON.stringify(row)));
      for (const row of picked) {
        await this.enqueue(row.name, row.payload, {
          delayMs: 0,
          maxAttempts: row.maxAttempts,
          backoffMs: row.backoffMs,
          repeatEveryMs: row.repeatEveryMs,
          cron: row.cron,
          timezone: row.timezone,
          dedupeKey: row.dedupeKey,
        });
      }
      return picked;
    },
    async list() {
      return this.peekReady(1000);
    },
    async close() {
      await client.quit();
    },
  };
}

export function createJobQueue({ dir = ".fastscript" } = {}) {
  return createFileQueue({ dir });
}

export async function createDistributedJobQueue({ dir = ".fastscript", driver = process.env.JOBS_DRIVER || "file" } = {}) {
  const mode = String(driver).toLowerCase();
  if (mode === "redis") {
    try {
      return await createRedisJobQueue();
    } catch {
      return createFileQueue({ dir });
    }
  }
  return createFileQueue({ dir });
}

export async function loadJobHandlers({ root = process.cwd() } = {}) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const jobsDir = path.join(root, "app", "jobs");
  const handlers = new Map();
  if (!fs.existsSync(jobsDir)) return handlers;
  const files = fs.readdirSync(jobsDir).filter((f) => /\.(fs|js|mjs|cjs)$/.test(f));
  for (const file of files) {
    if (file === "schedules.js" || file === "schedules.fs") continue;
    const full = path.join(jobsDir, file);
    const mod = await importSourceModule(full, { platform: "node" });
    const name = mod.name || file.replace(/\.(fs|js|mjs|cjs)$/, "");
    const handle = mod.handle || mod.default;
    if (typeof handle === "function") handlers.set(name, handle);
  }
  return handlers;
}

export async function loadSchedules({ root = process.cwd() } = {}) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const jsFile = path.join(root, "app", "jobs", "schedules.js");
  const fsFile = path.join(root, "app", "jobs", "schedules.fs");
  const file = fs.existsSync(fsFile) ? fsFile : jsFile;
  if (!fs.existsSync(file)) return [];
  const mod = await importSourceModule(file, { platform: "node" });
  const schedules = mod.schedules || mod.default || [];
  return (Array.isArray(schedules) ? schedules : []).map((row) => normalizeScheduleEntry(row)).filter(Boolean);
}

function nextRunForJob(job) {
  if (job.cron) {
    const next = nextCronRun(job.cron, { timezone: job.timezone || "UTC" });
    return next ? next.getTime() : null;
  }
  if (job.repeatEveryMs > 0) return Date.now() + job.repeatEveryMs;
  return null;
}

export async function runWorker({ dir = ".fastscript", pollMs = 350, driver = process.env.JOBS_DRIVER || "file" } = {}) {
  const queue = await createDistributedJobQueue({ dir, driver });
  const handlers = await loadJobHandlers();
  const schedules = await loadSchedules();
  let inFlight = 0;
  let stopping = false;

  for (const s of schedules) {
    if (!s || !s.name) continue;
    await queue.enqueue(s.name, s.payload || {}, {
      delayMs: Math.max(0, (s.nextRunAt || Date.now()) - Date.now()),
      maxAttempts: s.maxAttempts ?? 3,
      repeatEveryMs: s.everyMs || 0,
      cron: s.cron || null,
      timezone: s.timezone || "UTC",
      dedupeKey: s.dedupeKey || `schedule:${s.name}`,
    });
  }

  console.log(`worker started: handlers=${handlers.size} driver=${driver}`);
  const timer = setInterval(async () => {
    if (stopping) return;
    const jobs = await queue.peekReady(20);
    for (const job of jobs) {
      const handle = handlers.get(job.name);
      if (!handle) {
        await queue.fail(job, "handler_not_found");
        continue;
      }
      inFlight += 1;
      try {
        await handle(job.payload, { queue });
        const nextRun = nextRunForJob(job);
        if (nextRun) {
          await queue.enqueue(job.name, job.payload, {
            delayMs: Math.max(0, nextRun - Date.now()),
            maxAttempts: job.maxAttempts,
            backoffMs: job.backoffMs,
            repeatEveryMs: job.repeatEveryMs,
            cron: job.cron,
            timezone: job.timezone,
            dedupeKey: job.dedupeKey || null,
          });
        }
        await queue.ack(job.id);
      } catch (error) {
        await queue.fail(job, error);
      } finally {
        inFlight -= 1;
      }
    }
  }, pollMs);

  async function shutdown() {
    if (stopping) return;
    stopping = true;
    clearInterval(timer);
    const started = Date.now();
    while (inFlight > 0 && Date.now() - started < 3000) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
    }
    if (queue.close) await queue.close();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export async function replayDeadLetter({ dir = ".fastscript", limit = 20, name = null, driver = process.env.JOBS_DRIVER || "file" } = {}) {
  const queue = await createDistributedJobQueue({ dir, driver });
  const replayed = await queue.replayDeadLetter({ limit, name });
  if (queue.close) await queue.close();
  return replayed;
}
