# FastScript Language v2.0 Specification

Status: `ratified`  
Version: `2.0.0`  
Date: `2026-04-14`

## 1. Scope

This document defines the FastScript v2 language/runtime surface currently ratified by implementation and tests in this repository snapshot.

It supersedes ad-hoc interpretation and is intended to be read with:

1. `spec/V2_0_FORMAL_SPEC_AND_EXECUTION_PLAN.md`
2. `spec/V2_0_EXECUTION_TRACKER.md`

## 2. Core Language

FastScript source modules (`.fs`) use JS-compatible module syntax plus FastScript declaration forms:

1. `fn` declarations
2. `state` declarations
3. reactive `~` declarations

Compiler normalization emits JavaScript-compatible output while preserving diagnostics/source mapping.

## 3. Type System and Diagnostics

Typechecker provides:

1. semantic analysis over `.fs` modules;
2. symbol/type diagnostics with stable error codes;
3. context-aware runtime availability diagnostics.

Key codes in active use:

1. `FS4101` unknown symbol
2. `FS4102` immutable assignment/update
3. `FS4103` type mismatch
4. `FS4104` argument-count mismatch
5. `FS4105` return mismatch
6. `FS4106` non-callable invocation
7. `FS4107` operator operand mismatch
8. `FS4201` symbol unavailable in current runtime context

## 4. Runtime Context Model

File-context rules:

1. `app/pages/*.fs` => `universal + browser + server`
2. `app/api/*.fs` => `universal + server`
3. `*.client.fs` => `universal + browser`
4. `*.server.fs` => `universal + server`
5. `*.edge.fs` => `universal + edge`
6. default => `universal`

If a symbol is outside allowed context, emit `FS4201` with available-context hint.

## 5. Ambient Standard Library Baseline

Ambient global symbols modeled include:

1. primitives/constructors: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Promise`, `Set`, `Map`, `Error`, `RegExp`
2. web/runtime objects: `URL`, `URLSearchParams`, `Intl`, `TextEncoder`, `TextDecoder`
3. runtime globals: `globalThis`, `fetch`, `Request`, `Response`, `Headers`, `FormData`, `AbortController`, `AbortSignal`, timers, streams, `crypto`
4. context-specific globals: `window`, `document`, `location`, `navigator`, `history`, `localStorage`, `sessionStorage`, `indexedDB`, `self`, `process`, `Buffer`, `__dirname`, `__filename`, `require`, `module`, `exports`

Common static/instance methods are modeled for core migration surfaces and covered by v2 tests/fixtures.

## 6. DOM/Web API Baseline

Modeled baseline includes:

1. events/listeners/dispatch patterns
2. selector and lookup APIs
3. common element/document/window mutation and property access patterns
4. form extraction via `FormData`

This baseline is targeted at normal application code patterns and hydration-side logic.

## 7. Inference Baseline

Current inference baseline includes:

1. callback paths (`map`, `filter`, `reduce`, etc.)
2. method-chain flow on common collection/string paths
3. object/array destructuring improvements
4. guard/nullability-safe compile paths
5. targeted higher-order combinator propagation for common wrapper patterns

## 8. Conformance and Proof Hooks

v2 regression coverage is anchored in:

1. `spec/conformance/fixtures` (>=50 fixtures in current snapshot)
2. dedicated v2 scripts (`test:v2:*`)
3. `npm run validate` and `npm run test:conformance`

## 9. Compatibility

v1-valid `.fs` syntax remains supported; v2 extends ambient/runtime/type coverage without requiring authored JS bridge files for proof app source trees.

## 10. Ratification Notes

This specification is ratified for FastScript `v2.0.0`.

Ratification record: `spec/V2_0_RATIFICATION_RECORD.md`  
Execution proof tracker: `spec/V2_0_EXECUTION_TRACKER.md`
