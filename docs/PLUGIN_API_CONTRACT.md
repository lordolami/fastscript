# FastScript Plugin API Contract

## Contract
- API version: `1`
- Runtime loads plugin configs from (first-class):
- `fastscript.plugins.fs`
- `fastscript.plugins.js`
- `fastscript.plugins.mjs`
- `fastscript.plugins.cjs`
- `app/plugins.fs`
- `app/plugins.js`
- `app/plugins.mjs`
- `app/plugins.cjs`

## Hook Surface
- `middleware(ctx, next)`
- `onBuildStart(ctx)`
- `onBuildEnd(ctx)`
- `onRequestStart(ctx)`
- `onRequestEnd(ctx)`

## Plugin Shape
```js
export default {
  name: "my-plugin",
  apiVersion: 1,
  setup(api) {
    api.hooks.middleware(async (ctx, next) => next());
    api.hooks.onBuildStart(async (ctx) => {});
    api.hooks.onBuildEnd(async (ctx) => {});
    api.hooks.onRequestStart(async (ctx) => {});
    api.hooks.onRequestEnd(async (ctx) => {});
  }
}
```

## Direct Hook Shorthand
```js
export default {
  name: "direct-hooks",
  apiVersion: 1,
  middleware: async (ctx, next) => next(),
  onBuildStart: async (ctx) => {},
  onBuildEnd: async (ctx) => {},
  onRequestStart: async (ctx) => {},
  onRequestEnd: async (ctx) => {},
}
```

## Runtime Guarantees
- Hook failures are isolated and logged.
- Hook execution uses timeout protection (`PLUGIN_TIMEOUT_MS`, default `2500`).
- Version mismatch is rejected with warning.
- Plugin middleware is inserted after core security middleware and before app middleware.

## Stability
- Breaking changes require major version bump.
