export const COMPATIBILITY_REPORT = {
  "generatedAt": "2026-04-15T18:50:40.654Z",
  "governanceTrack": "4.0",
  "stableLine": "3.0.x",
  "packageVersion": "3.0.0",
  "contract": "If a feature or ecosystem pattern is marked proven, it must have automated coverage and release gates must fail when that proof regresses.",
  "summary": {
    "entries": 30,
    "byStatus": {
      "proven": 28,
      "partial": 1,
      "planned": 1
    },
    "byCategory": {
      "ecmascript": 2,
      "modules-interop": 7,
      "typescript": 2,
      "jsx-tsx": 1,
      "fastscript-sugar": 1,
      "framework-patterns": 12,
      "runtime-targets": 1,
      "deployment-adapters": 1,
      "tooling": 3
    },
    "provenEntries": 28
  },
  "artifacts": {
    "jsTsSyntaxCases": 8,
    "fsParityCases": 14,
    "interopCases": 13
  },
  "entries": [
    {
      "id": "ecmascript-modern-syntax",
      "category": "ecmascript",
      "feature": "Modern ECMAScript syntax in .fs",
      "status": "proven",
      "contractNote": "Modern JS syntax should parse and normalize inside .fs without forcing a rewrite.",
      "proofIds": [
        "artifact:js-ts-syntax-proof:js-modern-module",
        "artifact:js-ts-syntax-proof:js-comments-strings-regex",
        "artifact:fs-parity:ecmascript-modern-class"
      ],
      "docsNote": "Covers module syntax, classes, private fields, static blocks, generators, and async generators.",
      "proofDetails": [
        {
          "id": "artifact:js-ts-syntax-proof:js-modern-module",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "js-modern-module"
        },
        {
          "id": "artifact:js-ts-syntax-proof:js-comments-strings-regex",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "js-comments-strings-regex"
        },
        {
          "id": "artifact:fs-parity:ecmascript-modern-class",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "ecmascript-modern-class"
        }
      ]
    },
    {
      "id": "js-dynamic-import-and-require",
      "category": "modules-interop",
      "feature": "Dynamic import and require in .fs",
      "status": "proven",
      "contractNote": "Dynamic import and CommonJS-style require should remain usable in compatibility-first .fs code.",
      "proofIds": [
        "artifact:js-ts-syntax-proof:js-dynamic-and-require",
        "artifact:fs-parity:module-interop-patterns",
        "artifact:fs-parity:commonjs-interop"
      ],
      "docsNote": "Includes mixed ESM/CommonJS usage inside authored .fs modules.",
      "proofDetails": [
        {
          "id": "artifact:js-ts-syntax-proof:js-dynamic-and-require",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "js-dynamic-and-require"
        },
        {
          "id": "artifact:fs-parity:module-interop-patterns",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "module-interop-patterns"
        },
        {
          "id": "artifact:fs-parity:commonjs-interop",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "commonjs-interop"
        }
      ]
    },
    {
      "id": "typescript-type-erasure",
      "category": "typescript",
      "feature": "TypeScript type erasure in .fs",
      "status": "proven",
      "contractNote": "Type-only TS syntax should erase cleanly when authored directly in .fs.",
      "proofIds": [
        "artifact:js-ts-syntax-proof:ts-types",
        "artifact:js-ts-syntax-proof:ts-namespace-and-declare",
        "artifact:fs-parity:typescript-types-and-generics"
      ],
      "docsNote": "Covers interfaces, type aliases, generics, namespaces, and declaration shapes.",
      "proofDetails": [
        {
          "id": "artifact:js-ts-syntax-proof:ts-types",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "ts-types"
        },
        {
          "id": "artifact:js-ts-syntax-proof:ts-namespace-and-declare",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "ts-namespace-and-declare"
        },
        {
          "id": "artifact:fs-parity:typescript-types-and-generics",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "typescript-types-and-generics"
        }
      ]
    },
    {
      "id": "tsx-jsx-authoring",
      "category": "jsx-tsx",
      "feature": "JSX and TSX authoring in .fs",
      "status": "proven",
      "contractNote": "React-style JSX/TSX should compile directly in .fs with normal typed component authoring.",
      "proofIds": [
        "artifact:js-ts-syntax-proof:jsx-component",
        "artifact:js-ts-syntax-proof:tsx-page",
        "artifact:fs-parity:tsx-component-surface",
        "script:test:authored-ts-in-fs"
      ],
      "docsNote": "Covers typed component props, TSX page modules, and authored .fs TSX.",
      "proofDetails": [
        {
          "id": "artifact:js-ts-syntax-proof:jsx-component",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "jsx-component"
        },
        {
          "id": "artifact:js-ts-syntax-proof:tsx-page",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "tsx-page"
        },
        {
          "id": "artifact:fs-parity:tsx-component-surface",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "tsx-component-surface"
        },
        {
          "id": "script:test:authored-ts-in-fs",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "fastscript-sugar-optional",
      "category": "fastscript-sugar",
      "feature": "FastScript sugar remains optional",
      "status": "proven",
      "contractNote": "fn, state, and ~ should remain optional language sugar on top of JS/TS-first .fs authoring.",
      "proofIds": [
        "artifact:fs-parity:fastscript-sugar-compatible"
      ],
      "docsNote": "Sugar support is maintained without making it the required authoring model.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:fastscript-sugar-compatible",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "fastscript-sugar-compatible"
        }
      ]
    },
    {
      "id": "import-assertion-shapes",
      "category": "modules-interop",
      "feature": "Import assertion and multiline import shapes",
      "status": "proven",
      "contractNote": "Supported import assertion shapes should survive compatibility-first conversion into .fs.",
      "proofIds": [
        "artifact:js-ts-syntax-proof:multiline-import-assertion-shape"
      ],
      "docsNote": "Current proof covers multiline assertion-like import shapes in migration input.",
      "proofDetails": [
        {
          "id": "artifact:js-ts-syntax-proof:multiline-import-assertion-shape",
          "status": "pass",
          "kind": "artifact",
          "artifact": "js-ts-syntax-proof",
          "label": "multiline-import-assertion-shape"
        }
      ]
    },
    {
      "id": "framework-build-corpus",
      "category": "framework-patterns",
      "feature": "Framework-style build corpus",
      "status": "proven",
      "contractNote": "Representative page, route, and API module shapes should build cleanly as .fs projects.",
      "proofIds": [
        "artifact:fs-parity:framework-build-corpus"
      ],
      "docsNote": "Covers a small build corpus with pages, dynamic routes, and API modules.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:framework-build-corpus",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "framework-build-corpus"
        }
      ]
    },
    {
      "id": "node-server-patterns",
      "category": "framework-patterns",
      "feature": "Node and Express-style handler patterns",
      "status": "proven",
      "contractNote": "Common Node/server request-handler shapes should work directly in .fs.",
      "proofIds": [
        "artifact:fs-parity:node-express-style",
        "script:test:runtime-contract"
      ],
      "docsNote": "Includes handler-style modules, params access, and path/env-adjacent server code.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:node-express-style",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "node-express-style"
        },
        {
          "id": "script:test:runtime-contract",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "node-middleware-and-error-flow",
      "category": "framework-patterns",
      "feature": "Node middleware chains, error handlers, and env-aware server flow",
      "status": "proven",
      "contractNote": "Middleware chains, error bubbling, and environment-aware server modules should remain valid .fs patterns.",
      "proofIds": [
        "artifact:fs-parity:node-middleware-error-chain"
      ],
      "docsNote": "Covers sequential middleware, error handling, and process.env usage in server code.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:node-middleware-error-chain",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "node-middleware-error-chain"
        }
      ]
    },
    {
      "id": "react-tsx-interop",
      "category": "framework-patterns",
      "feature": "React and TSX ecosystem interop",
      "status": "proven",
      "contractNote": "React-style modules and TSX authoring should work without forcing a framework rewrite.",
      "proofIds": [
        "artifact:interop:react-core-fs"
      ],
      "docsNote": "Current proof covers createElement/react-dom client import surfaces.",
      "proofDetails": [
        {
          "id": "artifact:interop:react-core-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "react-core-fs"
        }
      ]
    },
    {
      "id": "react-hooks-context-and-lazy",
      "category": "framework-patterns",
      "feature": "React hooks, context, and lazy module patterns",
      "status": "proven",
      "contractNote": "React-style hook and lazy-module workflows should remain valid authored .fs patterns.",
      "proofIds": [
        "artifact:fs-parity:react-hooks-context-lazy"
      ],
      "docsNote": "Covers useState, createContext/useContext, and lazy-loaded module flow.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:react-hooks-context-lazy",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "react-hooks-context-lazy"
        }
      ]
    },
    {
      "id": "next-style-modules",
      "category": "framework-patterns",
      "feature": "Next-style pages, links, and route-adjacent modules",
      "status": "proven",
      "contractNote": "Next-style module shapes should be accepted as syntax and framework-adjacent source in .fs.",
      "proofIds": [
        "artifact:interop:next-link-fs",
        "artifact:fs-parity:next-page-style-tsx"
      ],
      "docsNote": "Covers page-style TSX modules and next/link-like imports.",
      "proofDetails": [
        {
          "id": "artifact:interop:next-link-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "next-link-fs"
        },
        {
          "id": "artifact:fs-parity:next-page-style-tsx",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "next-page-style-tsx"
        }
      ]
    },
    {
      "id": "vue-style-modules",
      "category": "framework-patterns",
      "feature": "Vue-adjacent script and composable patterns",
      "status": "proven",
      "contractNote": "Vue-style script modules and composable helpers should work as normal .fs source.",
      "proofIds": [
        "artifact:interop:vue-core-fs",
        "artifact:fs-parity:vue-script-setup-adjacent"
      ],
      "docsNote": "Current proof covers Vue createApp/h interop and typed composable-style modules.",
      "proofDetails": [
        {
          "id": "artifact:interop:vue-core-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "vue-core-fs"
        },
        {
          "id": "artifact:fs-parity:vue-script-setup-adjacent",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "vue-script-setup-adjacent"
        }
      ]
    },
    {
      "id": "vue-composables-and-store-helpers",
      "category": "framework-patterns",
      "feature": "Vue composables and store-adjacent helpers",
      "status": "proven",
      "contractNote": "Composable and store-helper patterns should remain valid .fs source, not migration-only compatibility.",
      "proofIds": [
        "artifact:fs-parity:vue-composable-store-adjacent"
      ],
      "docsNote": "Covers ref/computed-based composables and store-like helper return shapes.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:vue-composable-store-adjacent",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "vue-composable-store-adjacent"
        }
      ]
    },
    {
      "id": "svelte-store-interop",
      "category": "framework-patterns",
      "feature": "Svelte store interop",
      "status": "proven",
      "contractNote": "Store-centric ecosystem imports should bundle cleanly from .fs.",
      "proofIds": [
        "artifact:interop:svelte-store-fs"
      ],
      "docsNote": "Current proof covers writable store usage.",
      "proofDetails": [
        {
          "id": "artifact:interop:svelte-store-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "svelte-store-fs"
        }
      ]
    },
    {
      "id": "preact-interop",
      "category": "framework-patterns",
      "feature": "Preact interop",
      "status": "proven",
      "contractNote": "Preact h/render APIs should remain accessible from .fs modules.",
      "proofIds": [
        "artifact:interop:preact-core-fs"
      ],
      "docsNote": "Current proof covers core Preact render flow.",
      "proofDetails": [
        {
          "id": "artifact:interop:preact-core-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "preact-core-fs"
        }
      ]
    },
    {
      "id": "solid-interop",
      "category": "framework-patterns",
      "feature": "SolidJS signal interop",
      "status": "proven",
      "contractNote": "Signal-style frameworks should import and bundle from .fs without compatibility rewrites.",
      "proofIds": [
        "artifact:interop:solid-core-fs"
      ],
      "docsNote": "Current proof covers createSignal/createMemo usage.",
      "proofDetails": [
        {
          "id": "artifact:interop:solid-core-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "solid-core-fs"
        }
      ]
    },
    {
      "id": "package-subpath-exports",
      "category": "modules-interop",
      "feature": "Scoped package subpath exports",
      "status": "proven",
      "contractNote": "Subpath export resolution should work for .fs imports against modern packages.",
      "proofIds": [
        "artifact:interop:scoped-subpath-fs",
        "script:test:ecosystem-compatibility-contract"
      ],
      "docsNote": "Covers scoped package subpath exports and workspace-linked packages.",
      "proofDetails": [
        {
          "id": "artifact:interop:scoped-subpath-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "scoped-subpath-fs"
        },
        {
          "id": "script:test:ecosystem-compatibility-contract",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "package-dual-mode",
      "category": "modules-interop",
      "feature": "Dual-mode package resolution",
      "status": "proven",
      "contractNote": "Dual-mode ESM/CJS package exports should resolve correctly from .fs.",
      "proofIds": [
        "artifact:interop:dual-mode-fs",
        "script:test:ecosystem-compatibility-contract"
      ],
      "docsNote": "Covers modern export-condition resolution.",
      "proofDetails": [
        {
          "id": "artifact:interop:dual-mode-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "dual-mode-fs"
        },
        {
          "id": "script:test:ecosystem-compatibility-contract",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "package-commonjs",
      "category": "modules-interop",
      "feature": "CommonJS package interop",
      "status": "proven",
      "contractNote": "CommonJS packages should remain consumable from .fs through compatibility interop.",
      "proofIds": [
        "artifact:interop:node-cjs-npm-fs",
        "artifact:fs-parity:commonjs-interop",
        "script:test:ecosystem-compatibility-contract"
      ],
      "docsNote": "Covers require-driven compatibility and bundling against npm CommonJS packages.",
      "proofDetails": [
        {
          "id": "artifact:interop:node-cjs-npm-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "node-cjs-npm-fs"
        },
        {
          "id": "artifact:fs-parity:commonjs-interop",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "commonjs-interop"
        },
        {
          "id": "script:test:ecosystem-compatibility-contract",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "package-node-builtins",
      "category": "modules-interop",
      "feature": "Node built-in module imports",
      "status": "proven",
      "contractNote": "Node built-ins should be importable from .fs wherever the runtime target allows them.",
      "proofIds": [
        "artifact:interop:node-builtins-fs"
      ],
      "docsNote": "Current proof covers node:crypto and node:path.",
      "proofDetails": [
        {
          "id": "artifact:interop:node-builtins-fs",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "node-builtins-fs"
        }
      ]
    },
    {
      "id": "package-real-npm",
      "category": "modules-interop",
      "feature": "Real npm package bundling",
      "status": "proven",
      "contractNote": "Real ecosystem packages should bundle from .fs without relying only on toy fixtures.",
      "proofIds": [
        "artifact:interop:real-acorn-js",
        "artifact:interop:real-astring-js",
        "artifact:interop:real-acorn-walk-js"
      ],
      "docsNote": "Current proof uses real installed dependencies instead of synthetic package mocks alone.",
      "proofDetails": [
        {
          "id": "artifact:interop:real-acorn-js",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "real-acorn-js"
        },
        {
          "id": "artifact:interop:real-astring-js",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "real-astring-js"
        },
        {
          "id": "artifact:interop:real-acorn-walk-js",
          "status": "pass",
          "kind": "artifact",
          "artifact": "interop",
          "label": "real-acorn-walk-js"
        }
      ]
    },
    {
      "id": "runtime-target-node",
      "category": "runtime-targets",
      "feature": "Node HTTP runtime target",
      "status": "proven",
      "contractNote": "The core Node runtime path should remain a release-blocking supported target.",
      "proofIds": [
        "script:test:runtime-contract",
        "script:smoke:start"
      ],
      "docsNote": "Covers app routing, API routes, and production adapter serving.",
      "proofDetails": [
        {
          "id": "script:test:runtime-contract",
          "status": "configured",
          "kind": "script"
        },
        {
          "id": "script:smoke:start",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "deployment-adapters",
      "category": "deployment-adapters",
      "feature": "Node, Vercel, and Cloudflare deploy adapters",
      "status": "proven",
      "contractNote": "Core deployment adapters are part of the governed compatibility surface.",
      "proofIds": [
        "script:test:deploy-adapters"
      ],
      "docsNote": "Current proof covers Node/PM2, Vercel, and Cloudflare adapter generation.",
      "proofDetails": [
        {
          "id": "script:test:deploy-adapters",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "tooling-core",
      "category": "tooling",
      "feature": "CLI, lint, format, and typecheck stability",
      "status": "proven",
      "contractNote": "The core toolchain should remain stable under release gates, not just the parser.",
      "proofIds": [
        "script:qa:gate"
      ],
      "docsNote": "Governed through the full repo quality gate.",
      "proofDetails": [
        {
          "id": "script:qa:gate",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "tooling-vscode",
      "category": "tooling",
      "feature": "VS Code language tooling",
      "status": "proven",
      "contractNote": "The editor surface should stay aligned with the compatibility contract.",
      "proofIds": [
        "script:test:vscode-language"
      ],
      "docsNote": "Smoke-tested LSP and syntax integration.",
      "proofDetails": [
        {
          "id": "script:test:vscode-language",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "proof-and-benchmark-discipline",
      "category": "tooling",
      "feature": "Proof and benchmark discipline",
      "status": "proven",
      "contractNote": "Public performance and proof claims must stay under automated discipline.",
      "proofIds": [
        "script:test:benchmark-discipline",
        "script:test:release-discipline"
      ],
      "docsNote": "Keeps proof pack claims tied to generated artifacts and release gates.",
      "proofDetails": [
        {
          "id": "script:test:benchmark-discipline",
          "status": "configured",
          "kind": "script"
        },
        {
          "id": "script:test:release-discipline",
          "status": "configured",
          "kind": "script"
        }
      ]
    },
    {
      "id": "typescript-decorators",
      "category": "typescript",
      "feature": "TypeScript decorators",
      "status": "partial",
      "contractNote": "Decorator support is not yet a governed proven guarantee.",
      "proofIds": [],
      "docsNote": "Keep visible as an explicit compatibility lane instead of implying support.",
      "proofDetails": []
    },
    {
      "id": "next-layout-and-metadata",
      "category": "framework-patterns",
      "feature": "Next-style layout and metadata exports",
      "status": "proven",
      "contractNote": "Next-style layout and metadata-like exports are part of the governed compatibility surface.",
      "proofIds": [
        "artifact:fs-parity:next-layout-metadata-style"
      ],
      "docsNote": "Covers metadata-like exports, generated metadata, and layout-style wrappers.",
      "proofDetails": [
        {
          "id": "artifact:fs-parity:next-layout-metadata-style",
          "status": "pass",
          "kind": "artifact",
          "artifact": "fs-parity",
          "label": "next-layout-metadata-style"
        }
      ]
    },
    {
      "id": "future-tc39-and-ts-additions",
      "category": "ecmascript",
      "feature": "Future TC39 and TypeScript additions",
      "status": "planned",
      "contractNote": "New language additions should be incorporated into the compatibility matrix as they stabilize.",
      "proofIds": [],
      "docsNote": "4.0 establishes the governed system that future additions plug into.",
      "proofDetails": []
    }
  ]
};
export default COMPATIBILITY_REPORT;
