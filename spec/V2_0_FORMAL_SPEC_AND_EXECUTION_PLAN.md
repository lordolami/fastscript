# FastScript v2.0 Formal Spec and Execution Plan

## Status
- Specification version: `2.0.0-draft`
- Product target: `FastScript v2.0`
- Audience: language/runtime implementers, Codex execution agents, maintainers, migration operators
- Primary purpose: define the exact FastScript `v2.0` destination, record what already exists in `v1`, and give an implementation-grade A-to-Z execution path

## 1. Purpose

FastScript `v2.0` is the point where FastScript stops being "a promising full-stack language on the JS ground" and becomes "a complete, normal, high-trust programming language that can replace authored JS/TS in real apps."

This document exists to prevent three failure modes:

1. building only surface syntax while leaving core language gaps underneath;
2. mistaking framework/runtime progress for language completeness;
3. forcing Codex to rediscover the destination every time work resumes.

This document is the canonical `v2.0` source of truth until superseded by a later formal version.

## 2. Product Definition

FastScript `v2.0` must be:

1. a full-stack programming language, not only a frontend layer;
2. same-host by default for pages, actions, APIs, auth, jobs, and database access;
3. deployable on normal infrastructure without vendor lock-in;
4. compatible with the JavaScript ecosystem;
5. simple enough for weaker AI systems and normal developers to use correctly;
6. fast to parse, typecheck, build, run, and ship;
7. capable of authored zero-JS application source in real products.

## 3. What v1 Already Has

The existing FastScript repo already ships meaningful `v1` capability. `v2.0` must build on this, not restart from zero.

### 3.1 Language and Compiler Baseline

Completed in `v1`:

1. real parser pipeline;
2. stable AST contract;
3. diagnostics with error codes;
4. formatter;
5. linter;
6. typecheck command and semantic checking;
7. compatibility mode and migration-oriented normalization;
8. `.fs` route/app compilation;
9. compatibility/export tooling for JS and TS targets.

Primary references:

1. `spec/LANGUAGE_V1_SPEC.md`
2. `docs/COMPILER_ERROR_CODES.md`
3. `src/fs-parser.mjs`
4. `src/typecheck.mjs`
5. `src/fs-formatter.mjs`
6. `src/fs-linter.mjs`

### 3.2 Runtime and Full-Stack Baseline

Completed in `v1`:

1. routing, layouts, middleware;
2. SSR, SSG, ISR, streaming;
3. auth/session primitives;
4. cache, jobs, storage, db, observability, scheduler, security;
5. deploy adapters for Node/Vercel/Cloudflare;
6. plugin and migration scaffolding;
7. VS Code grammar/LSP baseline.

Primary references:

1. `docs/ARCHITECTURE_OVERVIEW.md`
2. `src/server-runtime.mjs`
3. `src/build.mjs`
4. `src/deploy.mjs`
5. `src/auth.mjs`
6. `src/db*.mjs`
7. `src/jobs.mjs`
8. `src/storage.mjs`

### 3.3 Product and Ecosystem Baseline

Completed in `v1`:

1. docs site and search;
2. benchmark suite and public benchmark material;
3. starter templates and migration wizard;
4. edge/runtime parity docs;
5. reference apps and migration case studies.

Primary references:

1. `docs/DEPLOY_GUIDE.md`
2. `docs/INTEROP_RULES.md`
3. `docs/MIGRATION_CASE_STUDIES.md`
4. `docs/EDGE_RUNTIME_PARITY.md`
5. `spec/STABLE_RELEASE_CHECKLIST.md`

## 4. What v1 Does Not Yet Guarantee

FastScript `v1` still has foundational gaps that block true zero-JS authored apps and painless large-app migration.

### 4.1 The Main Proven Gap

The Yomiru migration stress test proved that FastScript still lacks a complete ambient runtime and standard-library model for normal application code.

Observed blockers include missing or incomplete support for:

1. `Array`
2. `Object`
3. `JSON`
4. `Math`
5. `Date`
6. `Promise`
7. `Set`
8. `Map`
9. `Error`
10. `Intl`
11. `Headers`
12. `FormData`
13. `URL`
14. `URLSearchParams`
15. `AbortController`
16. `globalThis`
17. `window`
18. `document`
19. `location`
20. `process`
21. `setTimeout`
22. `clearTimeout`
23. callback-heavy DOM patterns
24. method-chain inference for normal JS-style code

### 4.2 Consequence

FastScript `v1` can compile many `.fs` routes and APIs, but it cannot yet claim:

1. authored zero-JS app source in all normal cases;
2. seamless migration of large real-world JS/TS app modules into `.fs`;
3. complete "normal programming language on JS ground" parity.

## 5. v2.0 Success Definition

FastScript `v2.0` is complete when all of the following are true:

1. real app source can be authored entirely in `.fs` without JS bridge files;
2. ordinary JavaScript/TypeScript-style application code ports into `.fs` with low friction;
3. the compiler understands normal browser, server, edge, and shared runtime globals;
4. the typechecker catches real mistakes without punishing normal code;
5. FastScript remains simple, readable, and low-token for humans and weaker AI systems;
6. full-stack same-host development is first-class, not bolted on;
7. compatibility with the JS ecosystem remains strong;
8. performance claims remain real under the richer language surface.

## 6. Formal v2.0 Capability Surface

The `v2.0` destination is defined by the following required categories.

### 6.1 Language Core

FastScript `v2.0` must fully support:

1. variables and declarations;
2. functions and closures;
3. async/await;
4. object literals;
5. array literals;
6. destructuring;
7. spread/rest;
8. template strings;
9. optional chaining;
10. fallback-heavy application code;
11. modules and imports/exports;
12. higher-order functions;
13. error handling;
14. normal control flow;
15. expressive but simple application code.

### 6.2 Type System

FastScript `v2.0` must provide:

1. strong inference with low annotation burden;
2. accurate array/object/tuple inference;
3. union and nullability handling;
4. narrowing after guards and existence checks;
5. callback inference;
6. async/promise inference;
7. method-chain inference;
8. good error locality and readable diagnostics;
9. fewer false positives on ordinary code;
10. stable semantics across real projects.

### 6.3 Standard Library and Ambient Symbols

FastScript `v2.0` must ship a first-class ambient standard library including:

1. `String`
2. `Number`
3. `Boolean`
4. `Array`
5. `Object`
6. `JSON`
7. `Math`
8. `Date`
9. `Promise`
10. `Set`
11. `Map`
12. `Error`
13. `RegExp`
14. `URL`
15. `URLSearchParams`
16. `Intl`
17. `TextEncoder`
18. `TextDecoder`

These must include:

1. constructors;
2. static methods;
3. common instance methods;
4. target-aware availability metadata;
5. stable declaration/versioning policy.

### 6.4 Runtime Globals

FastScript `v2.0` must model:

1. universal globals;
2. browser-only globals;
3. server-only globals;
4. worker/edge globals.

Required names include:

1. `globalThis`
2. `console`
3. `setTimeout`
4. `clearTimeout`
5. `setInterval`
6. `clearInterval`
7. `queueMicrotask`
8. `fetch`
9. `Request`
10. `Response`
11. `Headers`
12. `FormData`
13. `AbortController`
14. `window`
15. `document`
16. `location`
17. `navigator`
18. `history`
19. `localStorage`
20. `sessionStorage`
21. `process`

### 6.5 DOM and Web Platform Modeling

FastScript `v2.0` must support normal browser programming patterns including:

1. `Event` and `CustomEvent`;
2. typed event targets;
3. element lookup and traversal;
4. form extraction;
5. common element properties;
6. DOM mutation and listener patterns;
7. hydration-aware browser code.

### 6.6 Interop

FastScript `v2.0` must retain:

1. JS import into FS;
2. FS import into JS;
3. JSON import;
4. dynamic import;
5. clean ESM behavior;
6. predictable export semantics;
7. mixed JS/FS project support during migration;
8. npm/library compatibility.

### 6.7 Full-Stack and Deployment

FastScript `v2.0` must continue to provide and harden:

1. pages;
2. layouts;
3. middleware;
4. API routes;
5. server actions;
6. loaders;
7. auth/session;
8. db/storage/jobs/webhooks;
9. same-host one-app architecture;
10. deploy-anywhere portability.

### 6.8 Tooling and DX

FastScript `v2.0` must provide:

1. editor-first experience;
2. robust diagnostics;
3. formatter and linter discipline;
4. migration tooling;
5. docs/reference completeness;
6. compatibility reports;
7. performance visibility.

## 7. Non-Negotiable v2.0 Principles

The following are mandatory and must win tradeoffs unless explicitly waived in a formal RFC:

1. normal programming first;
2. same-host full-stack by default;
3. authored `.fs` as the primary source language;
4. JS ecosystem compatibility;
5. simple readable syntax;
6. low hallucination surface for AI generation;
7. performance discipline;
8. no regressions into framework-only thinking;
9. no requirement for authored JS bridges in finished apps;
10. deploy-anywhere portability.

## 8. Non-Goals

The following are not required to declare `v2.0` complete:

1. inventing a brand-new JS-incompatible ecosystem;
2. replacing JavaScript runtime output with a non-JS runtime;
3. building mobile/desktop targets before the core language is complete;
4. introducing complexity only to imitate advanced type-system features from other languages;
5. solving every possible future target before the web/server core is truly finished.

## 9. Codex Implementation Contract

Codex working on FastScript `v2.0` must follow these rules:

1. treat this document as the execution source of truth;
2. prioritize language/runtime completeness over surface novelty;
3. prefer reducing authored JS in app source rather than adding more bridge files;
4. do not claim `v2.0` parity unless validation and migration proofs confirm it;
5. update specs/tests/docs together when semantics change;
6. preserve performance discipline while extending the language;
7. keep the syntax simple even when adding power.

## 10. A-to-Z Execution Plan

This section defines the exact implementation sequence Codex should follow.

### A. Freeze the Current Truth

Codex must:

1. keep `spec/LANGUAGE_V1_SPEC.md` as the stable v1 baseline;
2. treat this document as the v2.0 delta contract;
3. preserve all current passing validation/build behavior before adding new capability.

Acceptance:

1. current `npm run validate` still passes before each major phase starts;
2. no existing benchmark/proof material is silently invalidated.

### B. Add an Ambient Standard Library Layer

Codex must implement a standard-library declaration/model layer inside the compiler/typechecker for:

1. primitive constructors;
2. collections;
3. promises;
4. dates/math/json/errors;
5. common static and instance methods.

Primary code targets:

1. `src/typecheck.mjs`
2. `src/fs-parser.mjs` if syntax hooks are needed
3. `src/fs-diagnostics.mjs`
4. a new standard-library declaration file/module under `src/`

Acceptance:

1. `.fs` files can reference standard library names without `unknown symbol` errors;
2. methods like `Array.from`, `Array.isArray`, `Object.entries`, `Promise.all`, `Date.now`, `JSON.parse`, and `Math.max` typecheck correctly.

### C. Add Runtime-Aware Global Environments

Codex must model:

1. universal globals;
2. browser globals;
3. server globals;
4. worker/edge globals.

Primary code targets:

1. `src/typecheck.mjs`
2. `src/env.mjs`
3. `src/validation.mjs`

Acceptance:

1. `globalThis`, timers, `fetch`, `Headers`, `FormData`, and `process` resolve correctly in the right runtime modes;
2. incorrect runtime use yields targeted diagnostics rather than generic unknown-symbol errors.

### D. Add DOM and Web API Modeling

Codex must model the DOM/web APIs needed by real app code, including:

1. `Event` and common event targets;
2. element lookup/manipulation patterns;
3. `FormData`;
4. browser-side request/response handling.

Acceptance:

1. browser-facing `.fs` modules using `querySelector`, `closest`, `FormData`, `location`, and event callbacks validate cleanly when legal.

### E. Improve Inference for Normal Code

Codex must improve:

1. callback inference;
2. method chain inference;
3. promise combinator inference;
4. object/array shape inference;
5. narrowing after common guard patterns.

Acceptance:

1. large ordinary app modules no longer fail due to callback- or collection-related typechecker gaps;
2. diagnostic count drops materially on real migration fixtures.

### F. Add Better Runtime-Scoped Diagnostics

Codex must distinguish:

1. unknown symbol;
2. known browser-only symbol in server context;
3. known server-only symbol in browser context;
4. unsupported migration pattern;
5. unsupported callback inference path.

Acceptance:

1. migration errors become actionable and specific;
2. Yomiru-style modules fail with meaningful guidance when they still cannot compile.

### G. Convert the Remaining API `.js` Source

Codex must remove remaining authored `.js` in `app/api` for FastScript-owned apps where the language surface now allows it.

Acceptance:

1. all authored API route source in migrated apps can be `.fs`;
2. no regression in build or runtime behavior.

### H. Convert Data/State Helper Modules

Codex must target helper/data modules next:

1. `site-data`
2. `user-data`
3. `sports-data`
4. `admin-tools-data`
5. similar stateful logic helpers

Acceptance:

1. these modules can be authored in `.fs`;
2. in-memory stores, collections, and serialization patterns validate correctly.

### I. Convert Runtime Adapters Where Legitimate

Codex must convert non-render helpers such as:

1. AWS request helpers;
2. runtime adapters;
3. environment-aware request utilities;
4. safe DB loader helpers

only once the relevant globals and promise/callback modeling are stable.

Acceptance:

1. adapters compile in `.fs` without custom JS shims;
2. runtime-specific behavior remains correct.

### J. Convert Render/Interaction Modules

Only after steps B-I are stable, Codex must convert the heavy app-facing renderer/interactivity modules:

1. `yomiru.js`
2. `public-router.js`
3. `public-live-data.js`
4. `admin-dashboard.js`
5. `admin-logs.js`
6. `admin-sections.js`
7. `sports-home.js`
8. `sports-router.js`

Acceptance:

1. these modules validate as `.fs`;
2. the migrated app no longer requires authored JS under `app/`;
3. UI behavior remains unchanged.

### K. Prove Zero-JS Authored App Capability

Codex must prove that a real migrated app can be authored with:

1. `.fs` pages;
2. `.fs` API routes;
3. `.fs` helpers and render logic;
4. no authored `.js` bridge files under the app source tree.

Generated output may still be JS.

Acceptance:

1. source tree audit shows no authored `.js` under `app/` for the migrated proof app;
2. the proof app builds, validates, and runs.

### L. Lock Interop and Migration Contracts

Codex must update:

1. `docs/INTEROP_RULES.md`
2. `docs/LANGUAGE_V1_MIGRATION.md`
3. migration wizard/codemod docs

to reflect the richer ambient runtime and zero-JS authored app target.

Acceptance:

1. docs match compiler reality;
2. mixed migration remains supported without ambiguity.

### M. Add Conformance Fixtures for Every New Surface

Codex must add new fixtures and regression tests for:

1. standard library usage;
2. runtime globals;
3. DOM APIs;
4. promise combinators;
5. callback-heavy app code;
6. mixed migration cases.

Acceptance:

1. new conformance fixtures live under `spec/conformance/fixtures`;
2. snapshots/regression tests cover each new capability.

### N. Preserve Performance

Every phase must measure impact on:

1. parse time;
2. typecheck time;
3. build time;
4. runtime size;
5. first-load JS.

Acceptance:

1. no silent performance cliff;
2. performance regressions are documented and justified.

### O. Keep the Syntax Simple

Codex must not solve these gaps by turning FastScript into a verbose or framework-shaped language.

Acceptance:

1. no syntax inflation for common code;
2. ordinary JS-style programming remains readable and direct.

### P. Keep Same-Host as the Default Mental Model

Codex must ensure new full-stack capabilities continue to reinforce:

1. one app boundary;
2. same-host page and action flows;
3. no required frontend/backend split.

Acceptance:

1. docs/examples/specs continue to teach same-host first.

### Q. Ship an Updated Formal Language Spec

Codex must publish a formal `v2.0` language/runtime specification once the implementation stabilizes.

Acceptance:

1. `spec/LANGUAGE_V2_SPEC.md` or equivalent exists;
2. this draft is replaced by a ratified spec.

## 11. Exit Criteria for Declaring v2.0 Complete

FastScript `v2.0` may be declared complete only when all of the following are true:

1. authored zero-JS app source is proven on at least one real migration case;
2. ambient standard library/runtime support covers ordinary app code;
3. browser/server/edge runtime scopes are formally modeled;
4. migration tooling/docs reflect the real compiler behavior;
5. conformance coverage exists for the new language surface;
6. build/validate remain green;
7. performance remains within target expectations;
8. the language still reads simply.

## 12. Immediate Next Work

The first implementation slice after this spec is adopted must be:

1. ambient standard library layer;
2. runtime global environment layer;
3. callback/promise/collection inference improvements;
4. Yomiru migration reconversion test on the previously blocked render modules.

## 13. Canonical Rule

If any implementation choice conflicts with the original FastScript direction, choose the option that makes FastScript more:

1. normal;
2. simple;
3. fast;
4. same-host;
5. compatible;
6. zero-JS authored;
7. understandable by both humans and weaker AI systems.

## 14. Quantified Appendices (Execution-Critical)

These appendices formalize missing definitions needed to execute phases A-Q without ambiguity.

### 14.1 Standard Library Method Matrix

This matrix is normative for Phase B and conformance coverage in Phase M.

1. `Array`
- Static: `from`, `isArray`, `of`
- Mutating: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`
- Non-mutating: `concat`, `slice`, `join`, `toString`, `toLocaleString`
- Iteration: `forEach`, `map`, `filter`, `reduce`, `reduceRight`, `find`, `findIndex`, `findLast`, `findLastIndex`, `some`, `every`, `includes`, `indexOf`, `lastIndexOf`, `flat`, `flatMap`
- Property: `length`

2. `Object`
- Static: `keys`, `values`, `entries`, `assign`, `create`, `defineProperty`, `defineProperties`, `freeze`, `seal`, `preventExtensions`, `isFrozen`, `isSealed`, `isExtensible`, `getPrototypeOf`, `setPrototypeOf`, `getOwnPropertyDescriptor`, `getOwnPropertyDescriptors`, `getOwnPropertyNames`, `getOwnPropertySymbols`, `hasOwn`, `fromEntries`
- Instance: `hasOwnProperty`, `isPrototypeOf`, `propertyIsEnumerable`, `toString`, `valueOf`, `toLocaleString`

3. `String`
- Static: `fromCharCode`, `fromCodePoint`, `raw`
- Instance: `charAt`, `charCodeAt`, `codePointAt`, `concat`, `endsWith`, `includes`, `indexOf`, `lastIndexOf`, `localeCompare`, `match`, `matchAll`, `normalize`, `padEnd`, `padStart`, `repeat`, `replace`, `replaceAll`, `search`, `slice`, `split`, `startsWith`, `substring`, `toLowerCase`, `toLocaleLowerCase`, `toUpperCase`, `toLocaleUpperCase`, `trim`, `trimStart`, `trimEnd`, `trimLeft`, `trimRight`
- Property: `length`

4. `Number`
- Static: `isFinite`, `isInteger`, `isNaN`, `isSafeInteger`, `parseFloat`, `parseInt`, `EPSILON`, `MAX_SAFE_INTEGER`, `MIN_SAFE_INTEGER`, `MAX_VALUE`, `MIN_VALUE`, `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`
- Instance: `toExponential`, `toFixed`, `toPrecision`, `toString`, `valueOf`, `toLocaleString`

5. `Boolean`
- Instance: `toString`, `valueOf`

6. `JSON`
- Static: `parse`, `stringify`

7. `Math`
- Static: `abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atan2`, `atanh`, `cbrt`, `ceil`, `clz32`, `cos`, `cosh`, `exp`, `expm1`, `floor`, `fround`, `hypot`, `imul`, `log`, `log10`, `log1p`, `log2`, `max`, `min`, `pow`, `random`, `round`, `sign`, `sin`, `sinh`, `sqrt`, `tan`, `tanh`, `trunc`
- Constants: `E`, `LN10`, `LN2`, `LOG10E`, `LOG2E`, `PI`, `SQRT1_2`, `SQRT2`

8. `Date`
- Static: `now`, `parse`, `UTC`
- Instance: `getDate`, `getDay`, `getFullYear`, `getHours`, `getMilliseconds`, `getMinutes`, `getMonth`, `getSeconds`, `getTime`, `getTimezoneOffset`, `getUTCDate`, `getUTCDay`, `getUTCFullYear`, `getUTCHours`, `getUTCMilliseconds`, `getUTCMinutes`, `getUTCMonth`, `getUTCSeconds`, `setDate`, `setFullYear`, `setHours`, `setMilliseconds`, `setMinutes`, `setMonth`, `setSeconds`, `setTime`, `setUTCDate`, `setUTCFullYear`, `setUTCHours`, `setUTCMilliseconds`, `setUTCMinutes`, `setUTCMonth`, `setUTCSeconds`, `toDateString`, `toISOString`, `toJSON`, `toLocaleDateString`, `toLocaleString`, `toLocaleTimeString`, `toString`, `toTimeString`, `toUTCString`, `valueOf`

9. `Promise`
- Static: `all`, `allSettled`, `any`, `race`, `resolve`, `reject`
- Instance: `then`, `catch`, `finally`

10. `Set`
- Constructor: `new Set(iterable?)`
- Instance: `add`, `clear`, `delete`, `has`, `forEach`, `entries`, `keys`, `values`, `[Symbol.iterator]`
- Property: `size`

11. `Map`
- Constructor: `new Map(iterable?)`
- Instance: `set`, `get`, `has`, `delete`, `clear`, `forEach`, `entries`, `keys`, `values`, `[Symbol.iterator]`
- Property: `size`

12. `Error`
- Constructors: `Error`, `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`
- Instance: `name`, `message`, `stack`

13. `RegExp`
- Constructor: `new RegExp(pattern, flags?)`
- Instance: `exec`, `test`, `toString`
- Properties: `source`, `flags`, `global`, `ignoreCase`, `multiline`, `sticky`, `unicode`, `dotAll`, `lastIndex`

14. `URL`
- Constructor: `new URL(url, base?)`
- Static: `createObjectURL`, `revokeObjectURL`
- Instance: `toString`, `toJSON`
- Properties: `href`, `origin`, `protocol`, `username`, `password`, `host`, `hostname`, `port`, `pathname`, `search`, `searchParams`, `hash`

15. `URLSearchParams`
- Constructor: `new URLSearchParams(init?)`
- Instance: `append`, `delete`, `get`, `getAll`, `has`, `set`, `sort`, `toString`, `forEach`, `entries`, `keys`, `values`, `[Symbol.iterator]`

16. `Intl`
- Required namespaces: `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.Collator`, `Intl.PluralRules`, `Intl.RelativeTimeFormat`, `Intl.ListFormat`, `Intl.Locale`

17. `TextEncoder`
- Constructor: `new TextEncoder()`
- Instance: `encode`, `encodeInto`
- Property: `encoding`

18. `TextDecoder`
- Constructor: `new TextDecoder(label?, options?)`
- Instance: `decode`
- Properties: `encoding`, `fatal`, `ignoreBOM`

### 14.2 Runtime Environment Model

Scopes:

1. `universal`
2. `browser`
3. `worker`
4. `server`
5. `edge`

Runtime symbol availability matrix is normative:

1. Universal in all scopes: `globalThis`, `console`, timers, `queueMicrotask`, `fetch`, `Request`, `Response`, `Headers`, `FormData`, `AbortController`, `AbortSignal`, `Blob`, `File`, `ReadableStream`, `WritableStream`, `TransformStream`, `crypto`
2. Browser-only: `window`, `document`, `location`, `history`, `localStorage`, `sessionStorage`
3. Browser+Worker: `navigator`, `indexedDB`
4. Browser+Worker+Edge: `self`
5. Server-only: `process`, `Buffer`, `__dirname`, `__filename`, `require`, `module`, `exports`

Diagnostic contract:

1. use context-aware compile-time checks when file context is known;
2. emit `FS4201` for unavailable symbol-in-context errors with:
- message: `Symbol '{name}' is not available in {context} context`
- hint: `This symbol is only available in: {available_contexts}`

Context detection rules:

1. `app/pages/*.fs` => universal + browser + server
2. `app/api/*.fs` => universal + server
3. `*.client.fs` => universal + browser
4. `*.server.fs` => universal + server
5. `*.edge.fs` => universal + edge
6. default => universal

### 14.3 DOM Coverage Scope (Phase D)

Included baseline:

1. Events: `Event`, `CustomEvent`, `EventTarget`, add/remove/dispatch, common event types (`MouseEvent`, `KeyboardEvent`, `FocusEvent`, `InputEvent`, `SubmitEvent`)
2. Element lookup: `querySelector`, `querySelectorAll`, `getElementById`, `getElementsByClassName`, `getElementsByTagName`, `closest`, `matches`
3. Element props: `id`, `className`, `classList`, `textContent`, `innerHTML`, `outerHTML`, `value`, `checked`, `disabled`, `dataset`, `style`, `attributes`
4. Traversal: child/parent/sibling APIs listed in this appendix request
5. Mutation: append/remove/replace/insert APIs, attribute APIs, classList APIs
6. Document APIs: create element/text/fragment, `body`, `head`, `documentElement`, `title`, `cookie`, `readyState`
7. Form APIs: `FormData`, `form.elements`, `form.submit`, `form.reset`, field value/checked/files
8. Window APIs: location fields, history navigation/state, storage, scrolling, viewport dimensions, open/close

Explicitly excluded from v2.0 requirement:

1. Shadow DOM / Web Components
2. Canvas / WebGL
3. WebRTC / Web Audio
4. Observer APIs (Intersection/Mutation/Resize)
5. Service Worker and Worker constructor modeling depth
6. IndexedDB beyond basic availability checks
7. WebSocket depth beyond availability checks

### 14.4 Inference Test Corpus (Phase E)

Required patterns that must validate with correct inference:

1. callback inference (`map`, `filter` callback args/returns)
2. promise combinator inference (`Promise.all`)
3. method chaining (`map` -> `filter` -> `reduce`)
4. object shape inference
5. array shape inference (including unions)
6. destructuring inference (object + array)
7. async/await inference
8. guard narrowing (`typeof`, `Array.isArray`)
9. nullability (`?.`, `??`)
10. higher-order function inference

Success criteria:

1. all required patterns typecheck without errors;
2. inferred types match expected outcomes;
3. avoid `unknown` fallback for these common patterns;
4. Yomiru-module diagnostic count drops by >60%.

### 14.5 Performance Regression Bounds (Phase N)

Acceptable ranges relative to v1 baseline:

1. parse time: +20% max
2. typecheck time: +40% max
3. warm build: +30% max
4. cold build: +30% max
5. client first-load JS gzip: +25% max
6. typecheck memory peak: +50% max
7. build memory peak: +50% max

Hard limits:

1. parse <= 100ms per file
2. typecheck <= 500ms for 100 files
3. build <= 2s warm, <= 5s cold
4. client bundle <= 5KB gzip
5. memory <= 500MB peak

Measurement protocol:

1. standardized hardware documented;
2. average of 10 runs, outliers discarded;
3. reference corpus = Yomiru + 2 real apps;
4. benchmark suite output must publish results.

### 14.6 Migration Equivalence Tests (Phases G-J)

For each converted module:

1. Compilation equivalence (original JS and converted FS both compile; generated JS semantically equivalent)
2. Type safety (converted FS typechecks; no untracked `any/unknown` escape usage)
3. Runtime equivalence (unit/integration/smoke pass)
4. Behavioral equivalence (API, HTML, side effects)

Coverage targets:

1. API routes: 100% endpoint coverage
2. pages: 100% route coverage
3. helpers: >=80% function coverage
4. render modules: visual regression coverage

Proof artifacts:

1. before/after comparison report
2. test pass/fail matrix
3. performance comparison
4. bundle-size comparison

### 14.7 Reference "Normal Code" Corpus

Normative corpus:

1. Yomiru app (primary migration proof target)
2. FastScript examples (`examples/fullstack`, `examples/startup-mvp`)
3. common JS patterns (Express-style middleware, React-style no-JSX module patterns, utility patterns, async API-client patterns)

Not required as v2.0 normal-code parity targets:

1. advanced metaprogramming (`Proxy`/`Reflect`)
2. advanced Symbol/weak-ref/shared-memory/atomics/WASM/eval legacy edge patterns

Normal-code validation rule:

1. if a pattern appears in >=3 popular npm packages (>1M downloads/week) and runs on modern browsers without transpilation, treat as normal.

### 14.8 Rollback Strategy

Phase E checkpoint policy:

1. week 4: investigate if Yomiru diagnostic reduction <30%
2. week 6: rollback decision if reduction <15%
3. rollback decision if inference work causes >50% performance regression

Rollback options:

1. `v2.0-lite` (ship B/C/D, defer full E)
2. `v2.0-staged` (`v2.0.0` for B/C/D, `v2.1.0` for E)
3. `v2.0-deferred` (only if fundamental blocker exists)

Trigger conditions:

1. any phase blocked >4 weeks
2. performance regression >2x acceptable bounds
3. fundamental architectural conflict
4. Yomiru proof conversion fails

### 14.9 Compatibility Guarantees

Guaranteed compatible:

1. all valid v1 `.fs` syntax
2. v1 compiler flags
3. v1 runtime APIs
4. v1 deploy targets
5. v1 file conventions

Compatible with warnings:

1. more-specific inference may surface stricter diagnostics where v1 was permissive

Breaking changes policy:

1. none planned for v2.0;
2. if unavoidable, automated codemod and migration guidance required.

Deprecation policy:

1. no v1 feature deprecations in v2.0;
2. deprecations require 2 major versions notice and migration path.

Migration path requirement:

1. `fastscript migrate --from v1 --to v2` support;
2. automated where possible, with documented manual steps for remainder.

### 14.10 Quantified Exit Criteria

Section 11 is declared complete only when these thresholds are met:

1. Zero-authored-JS proof app:
- Yomiru `app/` contains 0 authored `.js` files
- pages/APIs/helpers are `.fs`
- build + run green

2. Ambient coverage:
- all symbols in 14.1 + 14.2 modeled
- Yomiru typechecks with <10 diagnostics
- >=95% Yomiru symbol resolution without `unknown`

3. Runtime scope model:
- 5 scopes implemented and tested
- context-aware diagnostics (`FS4201`) active

4. Migration/docs parity:
- `docs/INTEROP_RULES.md` updated
- `docs/LANGUAGE_V1_MIGRATION.md` updated
- migration wizard reflects v2 behavior
- docs examples compile

5. Conformance:
- >=50 new fixtures
- inference corpus (14.4) covered
- stdlib/runtime coverage fixtures added

6. Build/test gates:
- `npm run validate`, `npm run test:core`, `npm run test:conformance` all pass

7. Performance:
- all bounds in 14.5 met

8. Simplicity:
- no new primary syntax forms beyond current core
- docs examples remain concise
- migrated `.fs` LOC stays <=110% of original `.js`
- readability reviewed by >=2 reviewers
