import { performance } from "node:perf_hooks";
import { runBuild } from "../src/build.mjs";

const SAMPLE_MS = 10;

let peakRss = process.memoryUsage().rss;
const timer = setInterval(() => {
  const rss = process.memoryUsage().rss;
  if (rss > peakRss) peakRss = rss;
}, SAMPLE_MS);

const t0 = performance.now();
await runBuild();
const t1 = performance.now();
clearInterval(timer);

const out = {
  ms: t1 - t0,
  peakRssMb: peakRss / (1024 * 1024),
};

process.stdout.write(`${JSON.stringify(out)}\n`);
