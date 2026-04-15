# npm Publish Status

## Current state

FastScript `v3.0.1` is the current patch-release target in the public repo:

- website/docs/changelog/support matrix match the `v3.0.x` public line
- `npm run build` passes
- `npm run validate` passes
- `npm run pack:check` validates the generated public npm bundle
- the release bundle is prepared from the v3 public surface, not the repo root
- npm-facing README and package metadata now point at the governed compatibility matrix and broader ecosystem proof posture

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

## v3 launch packaging checklist

- bump `package.json` to `3.0.0`
- prepare `.release/npm-public`
- run `npm run pack:check`
- publish npm package from `.release/npm-public`
- publish matching GitHub release/tag with the same v3 proof-pack summary
- keep npm-facing copy aligned with the current support matrix, proof pack, and website compatibility story
