# FastScript Website Lock

- Effective date: `2026-04-14`
- Website status: `locked for platform planning`
- Release line: `v0.1.2`
- Live deployment: `https://fastscript-app.plain-water-cd0f.workers.dev`
- Cloudflare version id: `2289f51b-2508-4303-a866-b3de62f98842`

## Locked Surface
- homepage
- docs hub
- quickstart
- examples
- benchmarks
- showcase
- blog
- changelog
- devs/about
- contact
- contribute
- governance
- license
- privacy
- roadmap
- security
- terms
- playground aliases: `/docs/playground` and `/playground`

## Lock Rules
- No redesign work while platform planning is active.
- Only bug fixes, release-critical copy fixes, broken route fixes, and deployment regressions may touch website files.
- New roadmap content is allowed only when it reflects already-approved platform direction.
- Any future visual overhaul must happen as a separate tracked initiative after mobile/desktop planning is approved.

## Verified Baseline
- All primary public routes return `200`.
- `/playground` and `/docs/playground` both resolve.
- `/api/hello` returns `200`.
- `/api/docs-search?q=deploy` returns live results.
- Hero copy button is wired through layout hydration and delegated click handling.
- Docs search no longer depends on runtime filesystem access in Cloudflare.

## Locked Focus Shift
The website is now considered stable enough for planning work to move to:

1. FastScript mobile target
2. FastScript desktop target
3. Shared runtime/app APIs across targets

## Recovery
- Local backup snapshots live under `.backups/`
- Release freeze source of truth remains:
  - `docs/RELEASE_SCOPE_V1.md`
  - `spec/releases/v0.1.2/SCOPE_FREEZE.md`
