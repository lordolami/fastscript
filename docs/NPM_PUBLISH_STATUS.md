# npm Publish Status

## Current state

FastScript `v2.0.0` is release-aligned in the public repo:

- website/docs/changelog/support matrix match the `v2.0` line
- `npm run build` passes
- `npm run validate` passes
- `npm pack --dry-run` passes

## Why public npm publish is not complete yet

The public package still depends on the protected core via a local split:

- public package depends on `@fastscript/core-private` using `file:../fastscript-core-private`
- this preserves the current public/private repo boundary

An attempted private npm publish path was tested on `2026-04-14` with a scoped package model and failed with:

- `E402 Payment Required`
- npm response: `You must sign up for private packages`

That means the current npm account can publish the public `fastscript` package, but cannot publish the protected core as a restricted private npm package without enabling paid private-package support.

## Finish paths

### Path 1: keep the protected split

1. enable npm private-package support for the publishing account
2. publish the protected core as a restricted scoped package
3. point the public package dependency at that published version
4. publish `fastscript@2.0.0`

### Path 2: remove the protected split for npm distribution

1. ship the core inside the public npm package
2. accept that installable npm users will receive the implementation code
3. publish `fastscript@2.0.0` publicly without the private dependency boundary

## Recommended path

Path 1 keeps the intended public/private architecture intact.
