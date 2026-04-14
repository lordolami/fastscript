import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { createJobQueue } from "../src/jobs.mjs";

const dir = resolve(".tmp-jobs-tests");
rmSync(dir, { recursive: true, force: true });
const q = createJobQueue({ dir });

const job = q.enqueue("a", { n: 1 }, { delayMs: 0, maxAttempts: 2, backoffMs: 1, dedupeKey: "a:1" });
const duplicate = q.enqueue("a", { n: 1 }, { delayMs: 0, maxAttempts: 2, backoffMs: 1, dedupeKey: "a:1" });
assert.equal(duplicate.id, job.id);

assert.equal(q.peekReady(10).length >= 1, true);
q.fail(job);
assert.equal(q.list().length, 1);
q.fail(job, "boom");
assert.equal(q.list().length, 0);
assert.equal(q.deadLetter().length, 1);
assert.equal(String(q.deadLetter()[0].error).includes("boom"), true);

console.log("test-jobs pass");
