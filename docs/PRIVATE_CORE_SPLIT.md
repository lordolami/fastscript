# FastScript Private Core Split

This repository is the public-facing FastScript surface.

A separate private workspace now exists at:

`C:\Users\Codechef\Desktop\fastscript-core-private`

## Already mirrored to private workspace

- compiler and parser core
- typechecker core
- deploy/runtime adapters
- auth/storage/webhook internals
- backup/restore/secret-rotation scripts
- incident, threat, observability, rollout, proof-pack, and SBOM docs

## Public repo role

This public repo remains the home for:

- website and docs experience
- examples and templates
- language spec and migration guidance
- benchmark summaries
- public-safe developer onboarding

## Next hard split

The next real extraction step is dependency inversion so public packages consume private-core modules rather than defining those modules inline in this repo.

