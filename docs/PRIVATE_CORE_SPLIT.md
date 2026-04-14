# FastScript Private Core Split

This repository is the public-facing FastScript surface.

The protected source of truth for sensitive compiler/runtime/platform code now lives in:

`https://github.com/lordolami/fastscript-core-private`

## Public repo role

This repo remains the home for:

- website and docs experience
- examples and templates
- language spec and migration guidance
- benchmark summaries
- public-safe developer onboarding
- thin bridge modules for private core integration

## Private repo role

The private core repo owns:

- build pipeline internals
- deploy/runtime adapters
- parser and typechecker internals
- auth/storage/webhook internals
- operational security and incident documents

## Current extraction model

The following public files are now bridge modules that re-export from the private package:

- `src/build.mjs`
- `src/deploy.mjs`
- `src/server-runtime.mjs`
- `src/fs-parser.mjs`
- `src/typecheck.mjs`
- `src/auth.mjs`
- `src/storage.mjs`
- `src/webhook.mjs`

The public repo depends on the private package:

- `@fastscript/core-private`

This means the public surface stays stable while the protected implementation lives in the private repo.
