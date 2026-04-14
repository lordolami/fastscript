function prefix(tenantId, value) {
  return `${tenantId}:${value}`;
}

export function resolveTenantId(req, { headerName = "x-tenant-id", fallback = "public" } = {}) {
  const raw = req?.headers?.[headerName];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const tenant = String(value || fallback).trim();
  return tenant || fallback;
}

export function scopeDbByTenant(db, tenantId) {
  if (!db || typeof db.collection !== "function") return db;
  const scope = String(tenantId || "public");
  return {
    ...db,
    collection(name) {
      return db.collection(prefix(scope, name));
    },
    query(collection, predicate) {
      return db.query(prefix(scope, collection), predicate);
    },
    first(collection, predicate) {
      return db.first(prefix(scope, collection), predicate);
    },
    where(collection, filters) {
      return db.where(prefix(scope, collection), filters);
    },
  };
}

export function scopeCacheByTenant(cache, tenantId) {
  if (!cache) return cache;
  const scope = String(tenantId || "public");
  const k = (key) => prefix(scope, key);
  return {
    ...cache,
    async get(key) {
      return cache.get(k(key));
    },
    async set(key, value, ttlMs = 0) {
      return cache.set(k(key), value, ttlMs);
    },
    async setWithTags(key, value, opts = {}) {
      const tags = (opts.tags || []).map((tag) => prefix(scope, tag));
      return cache.setWithTags(k(key), value, { ...opts, tags });
    },
    async del(key) {
      return cache.del(k(key));
    },
    async invalidateTag(tag) {
      return cache.invalidateTag(prefix(scope, tag));
    },
  };
}
