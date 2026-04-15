# FastScript Compatibility-First Runtime Specification

Status: `working-spec`  
Version: `0.1.0`  
Date: `2026-04-15`

## 1. Purpose

This document defines the intended FastScript product contract for compatibility, conversion, trust, and speed.

It exists to remove ambiguity.

FastScript is not intended to win by forcing developers to adopt a visibly different coding style.

FastScript is intended to win by:

1. accepting normal JavaScript and TypeScript family code with minimal friction
2. preserving user code, user structure, and user design during conversion
3. running that code on a much faster runtime and toolchain
4. making speed the moat rather than syntax novelty

## 2. Product Thesis

FastScript should let developers:

1. write normal `js`, `jsx`, `ts`, and `tsx`
2. convert that codebase into `.fs` in one shot
3. keep coding in `.fs` with the same habits they already use
4. run the result directly on the FastScript runtime
5. receive meaningful speed gains without losing ownership of structure or output

FastScript is special because of the speed it gives the developer, not because it rewrites the developer's identity.

## 3. Core Promise

The FastScript promise is:

1. your code stays yours
2. your structure stays yours
3. your design stays yours
4. your copy stays yours
5. your behavior stays yours
6. FastScript only makes the project runnable on the FastScript runtime
7. FastScript speed comes from the runtime, compiler, and execution model, not from involuntary codebase mutation

## 4. Non-Negotiable Contract

FastScript strict conversion must:

1. never redesign the application
2. never rewrite copy or text content
3. never restyle the application
4. never reorganize the project structure unless explicitly requested
5. never mutate protected files
6. never silently infer a better architecture
7. never silently modernize code style
8. never silently change behavior
9. fail rather than guess when fidelity cannot be guaranteed

## 5. What `.fs` Is

`.fs` is:

1. the runtime-native FastScript source format
2. a compatibility-first language surface
3. a source container that must accept normal JS/TS family code
4. the file extension that signals the project can run directly on the FastScript runtime

That means valid authored JavaScript, TypeScript, JSX, and TSX saved as `.fs` should be treated as first-class source, not as migration leftovers.

`.fs` is not:

1. a forced syntax religion
2. a justification for rewriting user projects
3. a reason to touch visual output
4. a permission slip to restructure working code

## 6. Supported Source Surfaces

FastScript must support:

1. `js`
2. `jsx`
3. `ts`
4. `tsx`

FastScript should preserve:

1. comments
2. whitespace where possible
3. formatting where possible
4. statement ordering
5. module boundaries
6. file boundaries
7. import structure
8. export structure
9. JSX structure
10. CSS import usage
11. asset import usage
12. existing React patterns
13. existing React Native-style TSX syntax surfaces
14. existing CommonJS and ESM interop where required

## 7. Conversion Model

The primary conversion model is `rename-only`.

Strict conversion must do only the following:

1. rename eligible source files to `.fs`
2. rewrite import specifiers whose targets were renamed
3. update only the minimum metadata needed for the project to run on the FastScript runtime
4. emit a conversion manifest
5. validate the result

Strict conversion must not:

1. rewrite CSS
2. rewrite layout markup
3. rewrite text content
4. regenerate design output
5. re-architect the project
6. fold files together
7. split files apart
8. replace existing design systems
9. inject style changes
10. change framework semantics unless explicitly requested

## 8. Protected Files and Protected Zones

Protected files and zones are immutable during strict conversion.

Protected categories include:

1. stylesheets
2. design token files
3. static assets
4. copy/content files
5. layout structure
6. generated design output
7. brand assets
8. visual snapshots
9. any file explicitly marked protected by config

If a conversion requires touching a protected file, strict conversion must fail.

## 9. Fidelity Rules

Fidelity means the converted project must preserve:

1. rendered DOM structure
2. visual styling
3. copy and content
4. route behavior
5. API behavior
6. hydration behavior
7. application flow
8. import graph meaning
9. runtime side effects where intended

FastScript must include proof mechanisms for fidelity, including:

1. before/after file hash tracking
2. protected-file hash enforcement
3. DOM snapshot comparison
4. computed-style comparison
5. screenshot diff comparison
6. route output comparison
7. API contract comparison
8. hydration and interaction validation

If fidelity is not provable, the conversion is not complete.

## 10. Idempotency

FastScript conversion must be idempotent.

That means:

1. running strict conversion twice should not continue changing files
2. a second conversion run on an already converted tree should produce no meaningful diff
3. any repeated drift indicates a compiler or converter bug

## 11. Runtime Identity

FastScript wins through runtime performance and execution design.

The runtime must be optimized for:

1. startup time
2. build time
3. warm rebuild time
4. route latency
5. low memory churn
6. payload minimization
7. SSR throughput
8. static asset efficiency
9. weak-network delivery

The runtime, compiler, and caching system are the moat.

The converter is an adoption bridge.

## 12. Runtime Compatibility Contract

FastScript runtime compatibility must be treated as part of the product promise.

The runtime must preserve:

1. JavaScript evaluation semantics where supported
2. TypeScript-authored structure where applicable
3. JSX and TSX rendering semantics
4. ESM semantics
5. CommonJS interoperability where required
6. dynamic import semantics
7. environment variable access patterns
8. module side-effect ordering
9. route and request lifecycle expectations
10. React-compatible rendering and hydration expectations for supported surfaces

If the runtime cannot preserve compatibility for a construct in strict mode, FastScript must:

1. report it explicitly
2. classify it as unsupported or blocked
3. fail rather than silently reinterpret the construct

## 13. Ecosystem Compatibility Contract

FastScript must interoperate with the JavaScript ecosystem as a first-class platform concern.

That includes:

1. npm package resolution
2. package `exports` handling
3. package `imports` handling
4. `package.json` fields required for runtime behavior
5. monorepo support
6. workspace support
7. symlink-aware resolution
8. path alias support
9. mixed ESM and CommonJS graphs where required
10. external package asset resolution where required

Compatibility should be judged by whether a real project can preserve its identity and still run, not by whether a synthetic parser demo works.

## 14. Protected Scope Beyond Files

Protection is not only file-based.

FastScript strict conversion must support protected scopes including:

1. protected files
2. protected directories
3. protected markup regions
4. protected generated outputs
5. protected config keys
6. protected asset groups
7. protected design regions identified by configuration

If any protected scope would be altered by strict conversion, the conversion must fail.

## 15. Validation and Proof Discipline

FastScript must prove preservation, not merely assume it.

Validation must cover:

1. file hash integrity
2. dependency graph integrity
3. route output integrity
4. DOM integrity
5. computed style integrity
6. screenshot integrity
7. hydration integrity
8. API contract integrity
9. import graph integrity
10. repeated-run idempotency

Validation must be recorded in machine-readable form and human-readable form.

## 16. Observability and Debuggability

FastScript must not trade trust for speed.

The platform must provide:

1. source maps
2. stable stack traces
3. request timing
4. route timing
5. build timing
6. startup timing
7. cache metrics
8. memory metrics
9. CPU profiling hooks
10. heap profiling hooks
11. trace capture
12. structured logs
13. error overlays in development
14. diagnostics that explain why a conversion or runtime behavior failed

If developers cannot inspect and debug FastScript behavior, adoption trust will collapse.

## 17. Security and Permission Model

FastScript must define explicit runtime boundaries for:

1. file access
2. environment access
3. network access
4. subprocess execution
5. dynamic imports
6. plugin or extension access

The runtime must:

1. make permission failures explicit
2. support secure defaults
3. avoid invisible privilege assumptions
4. make policy configurable where necessary

## 18. Toolchain Completeness

FastScript must be a usable workflow, not just a conversion demo.

The complete toolchain must include:

1. conversion
2. development server
3. production build
4. startup runner
5. validation runner
6. benchmark runner
7. type checking
8. tracing
9. profiling
10. diagnostics
11. configuration management
12. manifest parsing and inspection

The toolchain should be consistent, documented, and automatable.

## 19. Benchmark Discipline

FastScript speed claims must follow a strict benchmark discipline.

Same-app benchmark requirements include:

1. same application
2. same machine
3. same network conditions
4. same compression policy where possible
5. same source-map policy where possible
6. same minification policy where possible
7. same viewport conditions where visual delivery is compared

Benchmark categories must include:

1. cold build time
2. warm build time
3. startup time
4. first request latency
5. route p50
6. route p95
7. output size
8. memory usage
9. low-bandwidth behavior
10. weak-device behavior

FastScript must not rely on incomparable marketing numbers to justify performance claims.

## 20. Network and Delivery Performance Standard

FastScript must optimize not only server speed, but also user-perceived performance.

The platform should optimize for:

1. minimal first payload size
2. minimal client JavaScript
3. minimal request waterfalls
4. strong immutable asset caching
5. stale-while-revalidate where appropriate
6. route-level bundles
7. image optimization
8. font subsetting
9. HTML-first rendering
10. low-bandwidth responsiveness

FastScript should treat 2G and weak-device usability as a design standard, not as an afterthought.

## 21. Trust Workflow

FastScript must have an explicit trust workflow.

Strict conversion should support:

1. dry run
2. diff preview
3. protected file list
4. blocked file list
5. conversion manifest
6. validation report
7. fidelity report
8. rollback information

The user must be able to inspect what FastScript intends to do before trusting it with a project.

## 22. Non-Creative Conversion Policy

Strict conversion is not a creative rewrite system.

Strict conversion must not:

1. improve architecture by guessing
2. modernize code style by guessing
3. replace framework patterns by guessing
4. refactor layout structure by guessing
5. edit design by guessing
6. edit copy by guessing

Any such action belongs outside strict conversion and must be explicitly requested as a different operation class.

## 23. AI Boundary

FastScript may use AI internally for assistance, but AI must not be part of strict conversion by default.

The AI boundary is:

1. AI-assisted migration is optional
2. AI-assisted rewriting is opt-in
3. AI must not touch protected scopes by default
4. AI must not silently change user intent
5. AI suggestions must remain explainable

The compatibility-first promise depends on deterministic non-creative conversion, not on AI improvisation.

## 24. Release and Regression Discipline

FastScript must enforce release discipline through:

1. versioned compatibility guarantees
2. reproducible builds
3. regression test suites
4. benchmark regression tracking
5. fidelity regression tracking
6. ratified specification updates
7. clear deprecation policy

Performance without release discipline is not enough to earn long-term trust.

## 25. Canonical Product Direction

FastScript should be understood as:

1. a compatibility-first source format
2. a high-performance runtime
3. a high-performance compiler and toolchain
4. a trust-preserving migration path from JS and TS ecosystems

FastScript should not be positioned as:

1. a syntax novelty product
2. a creative rewrite engine
3. an aesthetic ideology
4. a system that demands users abandon their existing way of writing code

## 26. Success Condition

FastScript succeeds when a developer can say:

1. I kept my code
2. I kept my structure
3. I kept my design
4. I kept my workflow
5. I changed almost nothing
6. my app now runs faster

That is the actual proof of FastScript.

## 27. Performance Philosophy

FastScript performance must prioritize:

1. same-app comparisons
2. low-bandwidth real-world delivery
3. low-device real-world responsiveness
4. reduced client JavaScript
5. reduced request waterfalls
6. reduced output size
7. reduced server work per request
8. aggressive precomputation
9. aggressive caching
10. native or WASM acceleration for CPU-heavy paths

FastScript should be optimized so that the same application:

1. builds faster
2. starts faster
3. serves faster
4. ships fewer bytes
5. feels faster on bad networks

## 28. 2G and Weak-Network Standard

FastScript must treat low-bandwidth performance as a first-class target.

The platform should optimize for:

1. tiny first payloads
2. minimal client runtime
3. fewer round trips
4. route-level bundle isolation
5. critical HTML first
6. critical CSS first
7. lite mode where appropriate
8. image optimization
9. font subsetting
10. strong immutable asset caching

FastScript must not assume fiber, Wi-Fi, or high-end desktop hardware.

## 29. Compiler Responsibilities

The FastScript compiler must:

1. parse compatibility-mode `.fs`
2. preserve meaning from JS/TS family input
3. build a dependency graph quickly
4. support incremental compilation
5. support cache-by-hash compilation
6. produce route manifests
7. produce asset manifests
8. split outputs by route where appropriate
9. tree-shake unused code
10. push as much work as possible to compile time
11. produce useful source maps
12. expose diagnostics that explain what changed and why

## 30. Runtime Optimization Surface

FastScript should use native and WASM acceleration where useful for:

1. parsing
2. hashing
3. compression
4. diffing
5. serialization
6. deserialization
7. search
8. ranking
9. manifest lookup
10. route planning

WASM is part of the optimization stack, not the entire speed story.

## 31. Toolchain Expectations

FastScript must provide a complete developer toolchain, including:

1. convert
2. build
3. start
4. dev
5. validate
6. benchmark
7. profile
8. trace
9. typecheck
10. diagnostics

FastScript should be trusted as a full workflow, not just a runtime demo.

## 32. Debugging and Observability

FastScript must not trade debuggability for speed.

The platform must support:

1. source maps
2. stack traces
3. route timing
4. compile timing
5. cache metrics
6. memory metrics
7. CPU profiling
8. heap profiling
9. tracing
10. regression detection

Developers must be able to see where the speed comes from and where regressions enter.

## 33. Security and Permissions

FastScript must define a runtime security model for:

1. file access
2. network access
3. environment access
4. subprocess access
5. dynamic import access
6. plugin or extension access

Security behavior must be explicit.

The runtime must not rely on invisible privilege assumptions.

## 34. Ecosystem Compatibility

FastScript must interoperate with the JavaScript ecosystem.

That includes:

1. npm package resolution
2. ESM support
3. CommonJS interop
4. package exports and imports
5. monorepo workflows
6. workspace links
7. path aliases
8. mixed module graphs where necessary

Compatibility is part of the product, not a side quest.

## 35. AI and Internal Canonical Syntax

FastScript may maintain a deeper internal canonical representation for:

1. compiler optimization
2. AI training
3. internal transformations
4. analysis

That internal form must not be forced on end users.

Public `.fs` should remain compatibility-first.

AI-specific or compiler-specific syntax may exist internally, but user adoption must not depend on learning it.

## 36. Benchmarking Standard

FastScript performance claims must be based on same-app benchmarking.

Required benchmark categories include:

1. cold build time
2. warm build time
3. startup time
4. first request latency
5. steady-state route p50
6. steady-state route p95
7. production output size
8. memory usage
9. weak-network rendering behavior
10. weak-device behavior

Claims must be compared against:

1. the same app
2. the same machine
3. the same network conditions
4. the same source-map policy
5. the same compression/minification policy where possible

FastScript should never rely on non-comparable marketing benchmarks.

## 37. Conversion Output Contract

A successful strict conversion run must emit:

1. a conversion manifest
2. a list of converted files
3. a list of untouched files
4. a list of protected files
5. a list of blocked files
6. file hashes before and after
7. a summary of import rewrites
8. a validation report
9. a fidelity report

The user must always be able to see what changed.

## 38. Failure Policy

FastScript strict conversion must fail when:

1. a protected file would need to change
2. a non-target file changed unexpectedly
3. rendering changed beyond allowed thresholds
4. a route contract changed unexpectedly
5. a required import target cannot be resolved
6. compatibility semantics cannot be preserved
7. the converter is unsure

Failure is preferred to silent mutation.

## 39. Product Positioning

FastScript should be described as:

1. a compatibility-first source format
2. a high-performance runtime
3. a high-performance compiler and toolchain
4. a trust-preserving migration path from JS/TS ecosystems

FastScript should not be described primarily as:

1. a syntax novelty
2. a rewrite engine
3. an aesthetic coding philosophy
4. an excuse to redesign user projects

## 40. Long-Term Direction

FastScript should eventually support broader source ecosystems, but the foundation must remain:

1. preserve user ownership
2. preserve project identity
3. maximize compatibility
4. earn trust through proof
5. make speed the reason to stay

The first proof of FastScript is not that it can invent a new coding style.

The first proof of FastScript is that it can take a real project, preserve it, and make it much faster.

## 41. Codex Instruction

Any coding agent working on FastScript must follow this rule:

1. do not treat conversion as creative rewriting
2. do not touch user design during strict conversion
3. do not touch user copy during strict conversion
4. do not touch user structure during strict conversion
5. do not touch protected files during strict conversion
6. assume compatibility-first behavior unless explicitly told otherwise
7. treat any fidelity drift as a bug, not as an acceptable tradeoff
8. optimize the runtime and toolchain, not the user's identity

This document is the canonical trust and product contract for compatibility-first FastScript work until superseded by a ratified revision.
