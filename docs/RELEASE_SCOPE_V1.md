# FastScript v1 Scope Freeze

## Included in v1
- Formal FastScript Language v1 specification and compatibility contract
- Full parser/CST diagnostics pipeline with source-map coverage
- Semantic type checker with scope/symbol/type inference baseline
- AST/CST-safe formatter and linter with idempotence/autofix guarantees
- Conformance fixtures and snapshot regression harness
- Node runtime (`dev`, `build`, `start`)
- `.fs` + `.js` app routing and API handling
- Auth/session, file DB, jobs, storage core
- Plugin hooks (contract v1)
- Local no-billing quality gate (`qa:all`, hooks)
- Design token constraints and style validation
- Language website core routes (`/`, `/docs`, `/learn`, `/examples`, `/benchmarks`, `/showcase`, `/changelog`)

## Deferred Beyond v1
- Production-grade managed adapters for all edge/serverless providers
- Advanced LSP intelligence beyond starter diagnostics
- Enterprise-only requirements from long-range roadmap

## Freeze Status
- v1 scope locked on `2026-04-14` during stable release `v0.1.2`.
- Only the "Included in v1" items are eligible for stable patch changes.
- Non-v1 work is frozen until roadmap planning (Master TODO item 9) is completed.
