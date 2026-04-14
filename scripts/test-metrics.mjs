import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { createMetricsStore } from "../src/metrics.mjs";

const dir = resolve(".tmp-metrics-tests");
rmSync(dir, { recursive: true, force: true });

const metrics = createMetricsStore({ dir, name: "test" });
metrics.inc("requests_total", 1);
metrics.inc("requests_total", 2);
metrics.observe("request_duration_ms", 10);
metrics.observe("request_duration_ms", 30);

const snap = metrics.snapshot();
assert.equal(snap.counters.requests_total, 3);
assert.equal(snap.timings.request_duration_ms.count, 2);
assert.equal(snap.averages.request_duration_ms, 20);

console.log("test-metrics pass");
