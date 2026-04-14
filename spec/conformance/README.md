# FastScript Conformance Suite

## Layout
- Fixtures: `spec/conformance/fixtures/*.fs`
- Golden snapshot: `spec/conformance/snapshots.json`
- Harness: `scripts/test-conformance.mjs`

## Commands
- Validate snapshots: `npm run test:conformance`
- Regenerate snapshots after intentional language/tooling change: `npm run test:conformance:update`

## What is covered
- Parser acceptance + diagnostics code stability
- Rewriter/codegen output
- Source-map source linkage
- Formatter idempotence for each fixture
- Reparse compatibility of normalized output
