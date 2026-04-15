# FastScript v3.0.0 Final Release Notes

## Summary

FastScript v3 makes `.fs` the public universal JS/TS container for the FastScript runtime.

This release aligns the language/runtime, website, docs, proof pack, and release discipline around a single contract:

- write normal JavaScript, TypeScript, JSX, or TSX in `.fs`
- use FastScript syntax as optional sugar, not a requirement
- treat valid JS/TS failures in `.fs` as compatibility bugs
- back speed claims with benchmark discipline, proof artifacts, and release gates

## What shipped

- v3 public surface rewrite across homepage, docs, roadmap, changelog, benchmarks, and supporting pages
- `/docs/v3` promoted to the current docs track and `/docs/latest` aligned to v3
- JS/TS syntax proof and `.fs` parity proof elevated into release discipline
- npm packaging flow aligned to the v3 public line
- stronger source-available and proprietary-core positioning across release-facing materials

## Current proof-backed metrics

- build time: `702.98ms`
- first-load JS gzip: `2.71KB`
- interop matrix: `13/13` passing
- JS/TS syntax proof: pass
- `.fs` parity proof: pass

## Product position

FastScript v3 is the active public line.

The public repo is source-available and installable, but the main language/runtime remains proprietary. Repository and runtime contents may not be used to train, fine-tune, improve, or evaluate a commercial AI coding product without written permission.

That protected language/runtime core is also the foundation for the next FastScript AI coding assistant line.

## Release evidence

- `docs/PROOF_PACK.md`
- `.fastscript/proofs/js-ts-syntax-proof.json`
- `.fastscript/proofs/fs-parity-matrix.json`
- `benchmarks/latest-proof-pack.md`
