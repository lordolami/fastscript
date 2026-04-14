# npm Publish Status

## Current state

FastScript `v2.0.0` is release-aligned in the public repo:

- website/docs/changelog/support matrix match the `v2.0` line
- `npm run build` passes
- `npm run validate` passes
- `npm pack --dry-run` passes

## Packaging model

FastScript now uses a self-contained public npm packaging model:

- source development still uses the public/private repo split
- the public npm release is generated in `.release/npm-public`
- that generated release bundles `@fastscript/core-private` inside the published tarball
- npm users do not need access to a second private registry package
- `npm run pack:check` validates the generated public release instead of packing the repo root directly

## Why this replaced the old plan

An attempted private npm publish path was tested on `2026-04-14` with a scoped package model and failed with:

- `E402 Payment Required`
- npm response: `You must sign up for private packages`

Because FastScript distribution is not the product moat, the package model was changed so npm installation stays easy while the business moat remains in the wider AI/model/platform layer.
