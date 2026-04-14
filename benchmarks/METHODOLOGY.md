# FastScript Benchmark Methodology

1. Run protocol benchmark suite with repeated runs (`FASTSCRIPT_BENCH_RUNS`, default `10`).
2. Measure parse corpus timing across all `app/**/*.fs` modules.
3. Measure typecheck timing over full app path and record peak RSS.
4. Measure one cold build and repeated warm builds, with peak RSS tracking.
5. Discard one min and one max run when run count >= 5 for trimmed-mean reporting.
6. Record environment metadata (Node version, platform, CPU model/count, total memory).
7. Measure first-load gzip bundle sizes (router JS and styles CSS).
8. Emit hard-limit checks aligned to v2 quantified appendix thresholds.
9. Publish raw JSON output to `benchmarks/suite-latest.json`.
