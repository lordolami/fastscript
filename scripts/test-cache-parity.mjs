import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { createFileCache, createMemoryCache } from "../src/cache.mjs";

const dir = resolve(".tmp-cache-parity");
rmSync(dir, { recursive: true, force: true });

const cases = [
  { name: "memory", cache: createMemoryCache() },
  { name: "file", cache: createFileCache({ dir }) },
];

for (const { name, cache } of cases) {
  await cache.setWithTags("a", { ok: true }, { ttlMs: 5000, tags: ["alpha"] });
  const row = await cache.get("a");
  assert.deepEqual(row, { ok: true }, `${name}: get failed`);
  const invalidated = await cache.invalidateTag("alpha");
  assert.equal(invalidated >= 1, true, `${name}: invalidateTag failed`);
  const empty = await cache.get("a");
  assert.equal(empty, null, `${name}: expected null after invalidate`);
}

console.log("test-cache-parity pass");
