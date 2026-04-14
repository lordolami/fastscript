import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function now() {
  return Date.now();
}

function normalizeTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags : []).map((tag) => String(tag).trim()).filter(Boolean))];
}

function expired(row) {
  return Boolean(row && row.exp && row.exp < now());
}

export function createMemoryCache() {
  const rows = new Map();
  const tagIndex = new Map();

  function attachTags(key, tags) {
    for (const tag of normalizeTags(tags)) {
      if (!tagIndex.has(tag)) tagIndex.set(tag, new Set());
      tagIndex.get(tag).add(key);
    }
  }

  function detachTags(key, tags) {
    for (const tag of normalizeTags(tags)) {
      const set = tagIndex.get(tag);
      if (!set) continue;
      set.delete(key);
      if (set.size === 0) tagIndex.delete(tag);
    }
  }

  return {
    async get(key) {
      const row = rows.get(key);
      if (!row) return null;
      if (expired(row)) {
        detachTags(key, row.tags);
        rows.delete(key);
        return null;
      }
      return row.value;
    },
    async set(key, value, ttlMs = 0) {
      const prev = rows.get(key);
      if (prev) detachTags(key, prev.tags);
      rows.set(key, { value, exp: ttlMs ? now() + ttlMs : 0, tags: [] });
    },
    async setWithTags(key, value, { ttlMs = 0, tags = [] } = {}) {
      const prev = rows.get(key);
      if (prev) detachTags(key, prev.tags);
      const normalizedTags = normalizeTags(tags);
      rows.set(key, { value, exp: ttlMs ? now() + ttlMs : 0, tags: normalizedTags });
      attachTags(key, normalizedTags);
    },
    async del(key) {
      const prev = rows.get(key);
      if (prev) detachTags(key, prev.tags);
      rows.delete(key);
    },
    async invalidateTag(tag) {
      const keys = [...(tagIndex.get(tag) || [])];
      for (const key of keys) {
        const row = rows.get(key);
        if (row) detachTags(key, row.tags);
        rows.delete(key);
      }
      tagIndex.delete(tag);
      return keys.length;
    },
    async clear() {
      rows.clear();
      tagIndex.clear();
    },
  };
}

export function createFileCache({ dir = ".fastscript/cache" } = {}) {
  const root = resolve(dir);
  mkdirSync(root, { recursive: true });
  const p = (key) => join(root, `${encodeURIComponent(key)}.json`);
  const tagsFile = join(root, "_tags.json");

  function readTags() {
    if (!existsSync(tagsFile)) return {};
    try {
      return JSON.parse(readFileSync(tagsFile, "utf8")) || {};
    } catch {
      return {};
    }
  }

  function writeTags(index) {
    writeFileSync(tagsFile, JSON.stringify(index, null, 2), "utf8");
  }

  function detach(key) {
    const index = readTags();
    let changed = false;
    for (const [tag, keys] of Object.entries(index)) {
      const next = (Array.isArray(keys) ? keys : []).filter((item) => item !== key);
      if (next.length !== keys.length) changed = true;
      if (next.length) index[tag] = next;
      else delete index[tag];
    }
    if (changed) writeTags(index);
  }

  function attach(key, tags) {
    const normalized = normalizeTags(tags);
    if (!normalized.length) return;
    const index = readTags();
    for (const tag of normalized) {
      const set = new Set(Array.isArray(index[tag]) ? index[tag] : []);
      set.add(key);
      index[tag] = [...set];
    }
    writeTags(index);
  }

  return {
    async get(key) {
      const file = p(key);
      if (!existsSync(file)) return null;
      const row = JSON.parse(readFileSync(file, "utf8"));
      if (expired(row)) {
        rmSync(file, { force: true });
        detach(key);
        return null;
      }
      return row.value;
    },
    async set(key, value, ttlMs = 0) {
      writeFileSync(p(key), JSON.stringify({ value, exp: ttlMs ? now() + ttlMs : 0, tags: [] }), "utf8");
      detach(key);
    },
    async setWithTags(key, value, { ttlMs = 0, tags = [] } = {}) {
      const normalized = normalizeTags(tags);
      writeFileSync(p(key), JSON.stringify({ value, exp: ttlMs ? now() + ttlMs : 0, tags: normalized }), "utf8");
      detach(key);
      attach(key, normalized);
    },
    async del(key) {
      rmSync(p(key), { force: true });
      detach(key);
    },
    async invalidateTag(tag) {
      const index = readTags();
      const keys = Array.isArray(index[tag]) ? index[tag] : [];
      for (const key of keys) rmSync(p(key), { force: true });
      delete index[tag];
      writeTags(index);
      return keys.length;
    },
    async clear() {
      rmSync(root, { recursive: true, force: true });
      mkdirSync(root, { recursive: true });
    },
  };
}

function stringifyValue(value) {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function parseValue(value) {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function createRedisCache({ url = process.env.REDIS_URL, prefix = "fastscript:cache" } = {}) {
  const mod = await import("redis");
  const client = mod.createClient({ url });
  await client.connect();

  function rowKey(key) {
    return `${prefix}:row:${key}`;
  }
  function tagKey(tag) {
    return `${prefix}:tag:${tag}`;
  }

  async function detachFromTags(key) {
    const tags = await client.sMembers(`${prefix}:rowtags:${key}`);
    if (!tags.length) return;
    for (const tag of tags) await client.sRem(tagKey(tag), key);
    await client.del(`${prefix}:rowtags:${key}`);
  }

  return {
    async get(key) {
      const raw = await client.get(rowKey(key));
      if (raw === null) return null;
      const row = parseValue(raw);
      if (!row || typeof row !== "object") return row;
      if (expired(row)) {
        await this.del(key);
        return null;
      }
      return row.value;
    },
    async set(key, value, ttlMs = 0) {
      await detachFromTags(key);
      const row = stringifyValue({ value, exp: ttlMs ? now() + ttlMs : 0, tags: [] });
      if (ttlMs > 0) await client.set(rowKey(key), row, { PX: ttlMs });
      else await client.set(rowKey(key), row);
    },
    async setWithTags(key, value, { ttlMs = 0, tags = [] } = {}) {
      await detachFromTags(key);
      const normalized = normalizeTags(tags);
      const row = stringifyValue({ value, exp: ttlMs ? now() + ttlMs : 0, tags: normalized });
      if (ttlMs > 0) await client.set(rowKey(key), row, { PX: ttlMs });
      else await client.set(rowKey(key), row);
      for (const tag of normalized) await client.sAdd(tagKey(tag), key);
      if (normalized.length) await client.sAdd(`${prefix}:rowtags:${key}`, ...normalized);
    },
    async del(key) {
      await detachFromTags(key);
      await client.del(rowKey(key));
    },
    async invalidateTag(tag) {
      const keys = await client.sMembers(tagKey(tag));
      for (const key of keys) await this.del(key);
      await client.del(tagKey(tag));
      return keys.length;
    },
    async clear() {
      const cursor = "0";
      let next = cursor;
      do {
        const data = await client.scan(next, { MATCH: `${prefix}:*`, COUNT: 200 });
        next = data.cursor;
        if (data.keys && data.keys.length) await client.del(data.keys);
      } while (next !== "0");
    },
    async close() {
      await client.quit();
    },
  };
}
