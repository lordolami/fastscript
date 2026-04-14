# FastScript Benchmark Methodology

1. Build each sample app in production mode.
2. Measure gzip size for router/core JS and CSS bundles.
3. Measure cold start, p95 render, and API throughput under identical hardware.
4. Publish scripts and raw output for reproducibility.
