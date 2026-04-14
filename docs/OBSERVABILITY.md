# FastScript Observability

## Built-in Signals
- Structured request logs with request IDs.
- Trace events per request span.
- File-backed metrics store (`.fastscript/metrics.json`):
- counters (`requests_total`, status counters, error counters)
- timing aggregates (`request_duration_ms`)

## Metrics Endpoint
- Enable with `METRICS_PUBLIC=1`
- Read snapshot at `/__metrics`

## SLO Baseline (v1)
- Availability: 99.5%
- p95 request duration: < 500ms
- 5xx rate: < 1%

## Alert Baseline
- 5xx rate over threshold for 5 minutes
- request latency p95 over threshold for 10 minutes
- job dead-letter growth unexpected spike
