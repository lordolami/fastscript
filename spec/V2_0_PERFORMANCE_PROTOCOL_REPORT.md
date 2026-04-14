# FastScript v2.0 Performance Protocol Report

Date: `2026-04-14`  
Source: `benchmarks/suite-latest.json` (`generatedAt: 2026-04-14T21:12:07.175Z`)

## Protocol

- Runs: `10` per timing metric
- Outlier policy: discard `1` min and `1` max, report trimmed mean
- Environment captured: Node/platform/CPU/memory metadata
- Corpora executed:
- `repo-app` (`./`)
- `yomiru` (`./yomiru`)
- `example-startup-mvp` (`./examples/startup-mvp`)
- `example-fullstack` (`./examples/fullstack`)
- Reported metrics:
- parse/typecheck timing series (+ min/max/median/p95/trimmed mean)
- build cold + warm timings
- bundle snapshot (`js`, `css`, routes)
- peak RSS (`typecheck`, `build`)
- hard-limit checks

## Current Results Summary

- `repo-app`
- Typecheck errors/warnings: `0/0`
- Build cold: `1572.84ms`
- Build warm (trimmed mean): `1103.44ms`
- JS bundle: `4138 bytes` (`< 5KB` hard limit)
- Hard-limit checks: pass

- `yomiru`
- Typecheck errors/warnings: `0/0`
- Build cold: `1007.31ms`
- Build warm: captured in suite output (trimmed timing stats available)
- Build error: `null`
- Hard-limit checks: pass

- `example-startup-mvp`
- Typecheck errors/warnings: `0/0`
- Build timings and memory captured in suite output
- Hard-limit checks: pass for measured metrics

- `example-fullstack`
- Typecheck errors/warnings: `0/0`
- Build timings and memory captured in suite output
- Hard-limit checks: pass for measured metrics

## Acceptance Mapping (Phase N)

- Implemented:
- standardized 10-run protocol
- outlier handling + trimmed statistics
- environment/hardware capture
- multi-corpus execution
- memory-peak collection (including subprocess builds for non-repo corpora)

- Status:
- Phase N is completed and evidence-backed in the current snapshot.
- All configured corpora now report successful build timing + hard-limit status in the latest suite snapshot.
