# FastScript Compatibility Matrix

- Generated: 2026-04-16T00:10:39.928Z
- Current stable line: `3.0.x`
- Governance track: FastScript `4.0` compatibility system
- Product contract: If a feature or ecosystem pattern is marked proven, it must have automated coverage and release gates must fail when that proof regresses.
- Proven means: linked automated coverage and CI-enforced release discipline

## Status Legend
- `proven`: linked automated coverage exists and release gates fail on regression
- `supported`: intended support surface with some proof or operational confidence, but not yet fully governed as `proven`
- `partial`: some known working coverage exists, but not enough to claim full contract safety
- `planned`: visible compatibility lane targeted for future proof coverage
- `blocked`: explicitly unsupported or blocked pending design/runtime work

## Summary
- Registry entries: 34
- Proven entries: 32
- JS/TS syntax proof cases: 8
- .fs parity cases: 18
- Interop cases: 17

## ECMAScript Syntax
| Feature | Status | Proof | Notes |
|---|---|---|---|
| Modern ECMAScript syntax in .fs | proven | `js-ts-syntax-proof:js-modern-module`, `js-ts-syntax-proof:js-comments-strings-regex`, `fs-parity:ecmascript-modern-class` | Covers module syntax, classes, private fields, static blocks, generators, and async generators. |
| Future TC39 and TypeScript additions | planned | - | 4.0 establishes the governed system that future additions plug into. |

## TypeScript Syntax Erasure
| Feature | Status | Proof | Notes |
|---|---|---|---|
| TypeScript type erasure in .fs | proven | `js-ts-syntax-proof:ts-types`, `js-ts-syntax-proof:ts-namespace-and-declare`, `fs-parity:typescript-types-and-generics` | Covers interfaces, type aliases, generics, namespaces, and declaration shapes. |
| TypeScript decorators | partial | - | Keep visible as an explicit compatibility lane instead of implying support. |

## JSX / TSX
| Feature | Status | Proof | Notes |
|---|---|---|---|
| JSX and TSX authoring in .fs | proven | `js-ts-syntax-proof:jsx-component`, `js-ts-syntax-proof:tsx-page`, `fs-parity:tsx-component-surface`, `script:test:authored-ts-in-fs` | Covers typed component props, TSX page modules, and authored .fs TSX. |

## FastScript Sugar
| Feature | Status | Proof | Notes |
|---|---|---|---|
| FastScript sugar remains optional | proven | `fs-parity:fastscript-sugar-compatible` | Sugar support is maintained without making it the required authoring model. |

## Modules And Interop
| Feature | Status | Proof | Notes |
|---|---|---|---|
| Dynamic import and require in .fs | proven | `js-ts-syntax-proof:js-dynamic-and-require`, `fs-parity:module-interop-patterns`, `fs-parity:commonjs-interop` | Includes mixed ESM/CommonJS usage inside authored .fs modules. |
| Import assertion and multiline import shapes | proven | `js-ts-syntax-proof:multiline-import-assertion-shape` | Current proof covers multiline assertion-like import shapes in migration input. |
| Scoped package subpath exports | proven | `interop:scoped-subpath-fs`, `interop:conditioned-subpath-fs`, `script:test:ecosystem-compatibility-contract` | Covers scoped package subpath exports, export-condition subpaths, and workspace-linked packages. |
| Dual-mode package resolution | proven | `interop:dual-mode-fs`, `script:test:ecosystem-compatibility-contract` | Covers modern export-condition resolution. |
| CommonJS package interop | proven | `interop:node-cjs-npm-fs`, `fs-parity:commonjs-interop`, `script:test:ecosystem-compatibility-contract` | Covers require-driven compatibility and bundling against npm CommonJS packages. |
| Node built-in module imports | proven | `interop:node-builtins-fs` | Current proof covers node:crypto and node:path. |
| Real npm package bundling | proven | `interop:real-acorn-js`, `interop:real-astring-js`, `interop:real-acorn-walk-js` | Current proof uses real installed dependencies instead of synthetic package mocks alone. |

## Runtime Targets
| Feature | Status | Proof | Notes |
|---|---|---|---|
| Node HTTP runtime target | proven | `script:test:runtime-contract`, `script:smoke:start` | Covers app routing, API routes, and production adapter serving. |

## Framework Patterns
| Feature | Status | Proof | Notes |
|---|---|---|---|
| Framework-style build corpus | proven | `fs-parity:framework-build-corpus` | Covers a small build corpus with pages, dynamic routes, and API modules. |
| Node and Express-style handler patterns | proven | `fs-parity:node-express-style`, `fs-parity:node-request-mutation-mixed-modules`, `script:test:runtime-contract` | Includes handler-style modules, params access, request mutation, mixed ESM/CJS helpers, and path/env-adjacent server code. |
| Node middleware chains, error handlers, and env-aware server flow | proven | `fs-parity:node-middleware-error-chain` | Covers sequential middleware, error handling, and process.env usage in server code. |
| React and TSX ecosystem interop | proven | `interop:react-core-fs`, `interop:react-dom-server-fs` | Current proof covers createElement plus react-dom client/server import surfaces. |
| React hooks, context, and lazy module patterns | proven | `fs-parity:react-hooks-context-lazy`, `fs-parity:react-composed-hooks-shared-helper` | Covers useState, createContext/useContext, lazy-loaded module flow, and composed hook/shared-helper patterns. |
| Next-style pages, links, and route-adjacent modules | proven | `interop:next-link-fs`, `interop:next-navigation-fs`, `fs-parity:next-page-style-tsx`, `fs-parity:next-route-shared-lib-style` | Covers page-style TSX modules, next/link and next/navigation imports, plus shared-lib route-adjacent patterns. |
| Vue-adjacent script and composable patterns | proven | `interop:vue-core-fs`, `interop:vue-router-fs`, `fs-parity:vue-script-setup-adjacent`, `fs-parity:vue-app-utility-module` | Current proof covers Vue createApp/h interop, vue-router module usage, typed composable-style modules, and app-adjacent utility helpers. |
| Vue composables and store-adjacent helpers | proven | `fs-parity:vue-composable-store-adjacent` | Covers ref/computed-based composables and store-like helper return shapes. |
| Svelte store interop | proven | `interop:svelte-store-fs` | Current proof covers writable store usage. |
| Preact interop | proven | `interop:preact-core-fs` | Current proof covers core Preact render flow. |
| SolidJS signal interop | proven | `interop:solid-core-fs` | Current proof covers createSignal/createMemo usage. |
| Next-style layout and metadata exports | proven | `fs-parity:next-layout-metadata-style` | Covers metadata-like exports, generated metadata, and layout-style wrappers. |
| Strict TypeScript product-shaped .fs apps | proven | `script:test:agency-ops` | Covers the Agency Ops proving-ground app: strict TypeScript authoring, dashboard routes, session bootstrap, work-item flow, assignment workflow, billing, jobs, and Cloudflare-ready generation. |
| Authenticated dashboard assignment and workload flows | proven | `script:test:agency-ops` | Covers assignment-capable work-item APIs, seeded assignee state, workload views, and authenticated dashboard mutation flow in Agency Ops. |
| Authenticated billing reminder and follow-up flows | proven | `script:test:agency-ops` | Covers invoice reminder queue/send actions, due and overdue invoice visibility, reminder history, and billing-to-ops follow-up flow in Agency Ops. |

## Tooling
| Feature | Status | Proof | Notes |
|---|---|---|---|
| CLI, lint, format, and typecheck stability | proven | `script:qa:gate` | Governed through the full repo quality gate. |
| VS Code language tooling | proven | `script:test:vscode-language` | Smoke-tested LSP and syntax integration. |
| Proof and benchmark discipline | proven | `script:test:benchmark-discipline`, `script:test:release-discipline` | Keeps proof pack claims tied to generated artifacts and release gates. |

## Deployment Adapters
| Feature | Status | Proof | Notes |
|---|---|---|---|
| Node, Vercel, and Cloudflare deploy adapters | proven | `script:test:deploy-adapters` | Current proof covers Node/PM2, Vercel, and Cloudflare adapter generation. |
| Manual deployment to custom Node and container platforms | proven | `script:smoke:start`, `script:test:agency-ops` | Covers the dist-manifest-driven production start path for custom Node/container hosts such as Cloud Run, ECS/EC2, or Oracle compute. |

## Compatibility Request Lane
If valid JS/TS, a framework pattern, or a real migration case fails in `.fs`, treat it as a FastScript compatibility bug and report it through the compatibility intake workflow.
