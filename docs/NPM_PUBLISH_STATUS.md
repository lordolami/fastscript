# npm Publish Status

## Current state

FastScript `v4.0.2` is the current public release target in the repo:

- website, docs, changelog, and support surfaces align to the v4 platform line
- `/learn` is treated as a first-class proof surface
- `npm run build` must pass
- `npm run validate` must pass
- `npm run pack:check` validates the generated public npm bundle
- the release bundle is prepared from the public release surface, not packed directly from the repo root
- npm-facing README and package metadata now point at the complete TypeScript platform contract, the canonical proof apps, and the governed support matrix

## Packaging model

FastScript uses a self-contained public npm packaging model:

- source development still uses the public/private repo split
- the public npm release is generated in `.release/npm-public`
- that generated release bundles `@fastscript/core-private` inside the published tarball
- npm users do not need access to a second private registry package
- `npm run pack:check` validates the generated public release instead of packing the repo root directly

## v4.0.2 packaging checklist

- bump `package.json` and `package-lock.json` to `4.0.2`
- prepare `.release/npm-public`
- run `npm run pack:check`
- publish the npm package from `.release/npm-public`
- publish the matching GitHub release and tag with the same v4 proof summary
- keep npm-facing copy aligned with the current support matrix, proof pack, website platform story, and canonical reference apps
