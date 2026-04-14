export async function createPostgresCollectionDatabase({ connectionString = process.env.DATABASE_URL } = {}) {
  const { Client } = await import("pg");
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS fs_records (
      collection text NOT NULL,
      id text NOT NULL,
      data jsonb NOT NULL,
      PRIMARY KEY(collection, id)
    );
  `);

  const state = { collections: {} };
  const rows = (await client.query("SELECT collection, id, data FROM fs_records")).rows;
  for (const row of rows) {
    if (!state.collections[row.collection]) state.collections[row.collection] = {};
    state.collections[row.collection][row.id] = row.data;
  }

  const pending = new Set();
  function enqueue(op) {
    const p = Promise.resolve().then(op).catch(() => {}).finally(() => pending.delete(p));
    pending.add(p);
    return p;
  }
  function ensureCollection(collection) {
    if (!state.collections[collection]) state.collections[collection] = {};
    return state.collections[collection];
  }

  const db = {
    collection(name) {
      return {
        get(id) {
          const col = ensureCollection(name);
          return col[id] ?? null;
        },
        set(id, value) {
          const col = ensureCollection(name);
          col[id] = value;
          enqueue(() => client.query(
            "INSERT INTO fs_records(collection, id, data) VALUES($1,$2,$3::jsonb) ON CONFLICT(collection,id) DO UPDATE SET data=excluded.data",
            [name, id, JSON.stringify(value)],
          ));
          return col[id];
        },
        delete(id) {
          const col = ensureCollection(name);
          delete col[id];
          enqueue(() => client.query("DELETE FROM fs_records WHERE collection=$1 AND id=$2", [name, id]));
        },
        all() {
          const col = ensureCollection(name);
          return Object.values(col);
        },
        upsert(id, updater) {
          const col = ensureCollection(name);
          const prev = col[id] ?? null;
          const next = typeof updater === "function" ? updater(prev) : updater;
          col[id] = next;
          enqueue(() => client.query(
            "INSERT INTO fs_records(collection, id, data) VALUES($1,$2,$3::jsonb) ON CONFLICT(collection,id) DO UPDATE SET data=excluded.data",
            [name, id, JSON.stringify(next)],
          ));
          return next;
        },
        first(predicate) {
          const col = ensureCollection(name);
          return Object.values(col).find(predicate) ?? null;
        },
        where(filters) {
          const col = ensureCollection(name);
          if (typeof filters === "function") return Object.values(col).filter(filters);
          return Object.values(col).filter((row) =>
            Object.entries(filters || {}).every(([k, v]) => row?.[k] === v),
          );
        },
      };
    },
    transaction(fn) {
      // In-memory atomic mutation, writes are enqueued asynchronously.
      return fn(db);
    },
    query(collection, predicate) {
      const col = ensureCollection(collection);
      return Object.values(col).filter(predicate);
    },
    first(collection, predicate) {
      const col = ensureCollection(collection);
      return Object.values(col).find(predicate) ?? null;
    },
    where(collection, filters) {
      const col = ensureCollection(collection);
      if (typeof filters === "function") return Object.values(col).filter(filters);
      return Object.values(col).filter((row) =>
        Object.entries(filters || {}).every(([k, v]) => row?.[k] === v),
      );
    },
    async flush() {
      await Promise.all([...pending]);
    },
    async close() {
      await Promise.all([...pending]);
      await client.end();
    },
  };

  return db;
}
