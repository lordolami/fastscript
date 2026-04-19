# Changelog

## Unreleased
- Release branch work for the next public line.

## v5.0.1 - 2026-04-19
- Convert FastScript from a trial-first launch into a paid product with a public interactive workflow demo and a gated operator console
- Tighten the public website, nav, footer, padding, mobile behavior, and platform demo flow so the product reads cleanly for buyers and YC
- Fix billing/session continuity for paid access, rerun the full quality gate, and cut the patch line required for a fresh npm release

## v5.0.0 - 2026-04-19
- Expand FastScript from the initial experiments-and-evals center into a permanent platform console with datasets, training jobs, checkpoints, specialization, models, deployments, workspaces, audit, incidents, costs, and grounded commands
- Shorten and sharpen the public launch story so FastScript leads as the structured substrate for AI-system workflows while the full-stack TypeScript platform remains the proof
- Upgrade `/learn`, docs, proof surfaces, public bundles, and npm release preparation to the `5.0.0` launch line

## v4.1.0 - 2026-04-17
- Ratify FastScript as a security-first TypeScript platform line with secure-by-default scaffolds, explicit runtime permissions policy, and validator-backed security-readiness reporting
- Fail validation on missing production policy, non-secure preset use, obvious secret exposure, missing env-schema security keys, and missing deploy-header baseline
- Upgrade the Team Dashboard SaaS and Agency Ops proof apps, `/learn`, homepage, docs, and security surfaces so trust is visible in both tooling and public proof

## v4.0.2 - 2026-04-17
- Fix the template-literal normalization path so built docs and public pages stop dropping characters like `<` from closing tags or deleting copy inside emitted HTML
- Align the active public release surfaces to the `4.0.2` hotfix line while keeping the FastScript-only platform IA intact
- Fix GitHub license/archive links, strengthen the public blog story, and regenerate search, support, compatibility, and package artifacts from the repaired source state

## v4.0.1 - 2026-04-17
- Fix the generated Cloudflare worker SSR shell so deployed FastScript pages carry the v4 title and runtime description instead of the stale generic FastScript metadata
- Apply the public metadata rewrite consistently across both build outputs and deploy-adapter outputs so npm, GitHub source, and the live site ship the same v4 shell contract

## v4.0.0 - 2026-04-17
- Ratify FastScript as the complete TypeScript full-stack platform instead of a compatibility-only line
- Align the public website, docs, changelog, README, and package metadata to the v4 platform-only contract
- Elevate `/learn` into a first-class proof surface and formalize Team Dashboard SaaS plus Agency Ops as the two canonical proof apps
- Keep FastScript-only public IA while moving Studio and Agent references to footer-only external coming-soon links
- Refresh proof-pack, support-matrix, and docs-search generation inputs for the v4 release story

## v3.1.1 - 2026-04-17
- Fix the Cloudflare deploy runtime-update path so stale browser caches stop surfacing one-off FastScript runtime errors after a new worker ships
- Make the browser service worker treat router and manifest assets as volatile control-plane files instead of cache-first forever assets
- Teach the client router to refresh its manifest state and retry dynamic imports before falling back to a hard reload

## v3.0.8 - 2026-04-16
- Stop caching SSR HTML at the runtime layer so plain root requests stop serving stale deploy shells while cache-busted requests are already fresh
- Keep the `3.0.7` production-shell and logical-manifest fixes intact while applying the no-store policy across Cloudflare and Node HTML responses
- Re-publish npm and redeploy the root FastScript worker from the final no-stale-HTML source state

## v3.0.7 - 2026-04-16
- Reconcile the final production shell so root deploys emit `isDevMode = false` in shipped HTML while preserving dev-only HMR behavior
- Keep the logical `fastscript-manifest.json` plus hashed `asset-manifest.json` contract intact and make the repeated-build fingerprint path deterministic, including sourcemap handling
- Re-ship the proof, benchmark, docs-search, API reference, SBOM, npm package, and root Cloudflare worker from one final green release state

## v3.0.6 - 2026-04-16
- Remove asset multi-hash drift at the source by keeping `fastscript-manifest.json` logical and using `asset-manifest.json` as the only hash lookup layer
- Make browser hydration, Node SSR, Cloudflare worker deploys, and build-time SSG all resolve route/layout/api modules through the asset manifest instead of embedding hashed module ids in the app graph
- Add regression coverage that rebuilds twice, proves there are no `foo.hash1.hash2.js` outputs, and re-sync the benchmark baseline plus release artifacts from the cleaned contract

## v3.0.2 - 2026-04-15
- Elevate `startup-mvp` into the Team Dashboard SaaS baseline and make it the first official FastScript greenfield product starting point
- Publish the dedicated baseline guide at `/docs/team-dashboard-saas` and promote it across docs, adoption, examples, showcase, and README surfaces
- Harden the reference app and proof flow around validator-safe class handling, token-safe example styling, CSRF/session-correct mutation flow, and the real dev/start runtime port behavior
- Keep the public contract aligned to `.fs` as a universal JS/TS container, `/docs/support` as the governed compatibility source of truth, and Team Dashboard SaaS as the first greenfield baseline on the `3.0.x` line

## v3.0.1 - 2026-04-15
- Broaden the governed ecosystem proof surface across Next-style route/layout/shared-module patterns
- Deepen React hooks/context/shared-helper, Node middleware/error/mixed-module, and Vue composable/app-utility coverage
- Expand npm/package interop proof to next/navigation, react-dom/server, vue-router, and export-condition subpath cases
- Refresh website/docs/README/npm-facing copy to align with the governed support matrix and current proof-backed public contract

## v3.0.0 - 2026-04-15
- Launch FastScript v3 as the active public line with `.fs` positioned as a universal JS/TS container
- Publish v3 website/docs alignment, `/docs/v3` latest-track routing, and proof-backed benchmark messaging
- Elevate JS/TS syntax proof and `.fs` parity proof into release discipline and proof-pack publishing
- Refresh the proprietary/source-available product story and position the next FastScript AI assistant wave on the roadmap

## v2.0.0 - 2026-04-14
- Ratify the FastScript v2.0 language/runtime surface and freeze the public spec pack
- Complete ambient runtime, standard library, DOM/platform, inference, and zero-JS authored app proof gates
- Publish the v2.0 execution tracker, ratification record, migration proof report, and performance protocol report
- Freeze the public/private repository boundary and exclude Yomiru proof artifacts from the public release tree

## v0.1.0 - 2026-04-13
- FastScript JS-first full-stack core

## v0.1.1 - 2026-04-13
- release prep

## v0.1.2-rc.0 - 2026-04-14
- Cut release candidate artifact and publish RC notes
- Add rollback drill and soak window automation scripts
- Capture release evidence pack for steps 1-6

## v0.1.2 - 2026-04-14
- Promote RC to stable and publish final release notes
- Finalize formal sign-off, blocker audit, and v1 scope freeze records
- Complete Master TODO steps 1-8 with evidence links
## v3.0.3 - 2026-04-16
- Refresh generated compatibility, proof, API reference, support matrix, SBOM, benchmark, and docs-search artifacts from code-truth outputs
- Restore the full release gate to green by regenerating the compatibility matrix inputs consumed by `test:core`
- Re-verify parser, typecheck, runtime-scope, ambient runtime, DOM, inference, zero-authored-JS, conformance, and release-discipline coverage through `test:core`, `qa:gate`, and `qa:all`
- Ship the language/compiler/parser foundation as a stabilized `3.0.3` patch release with no public bridge-surface breakage
## v3.0.4 - 2026-04-16
- Align the published npm package with the final foundation-grade source state after the post-publish site/meta fixes
- Refresh the public release line to `3.0.4`, including homepage meta shell, changelog surface, benchmark baseline, and regenerated proof/search artifacts
- Re-run `qa:gate`, `qa:all`, pack verification, root deploy, and live boundary smoke checks from the final release state
## v3.0.5 - 2026-04-16
- Stabilize runtime updates so deployed FastScript apps auto-refresh themselves when a new service worker version activates
- Repair the production Node SSR/runtime contract by resolving emitted route modules through the asset manifest instead of assuming unhashed `dist/pages/*.js` paths
- Resync the release line, regenerated proof/search/support artifacts, benchmark baselines, npm package, and root Cloudflare deploy from one final source state
## v3.0.6 - 2026-04-16
- release prep
## v3.0.7 - 2026-04-16
- release prep
## v3.0.8 - 2026-04-16
- release prep
## v3.1.0 - 2026-04-17
- Make `.fs` a rename-only adoption path for ordinary JS/TS/JSX/TSX, with FastScript syntax remaining optional sugar
- Switch the default compiler and loader posture to compatibility-first, remove default style and primitive enforcement gates, and keep migration/reporting rename-first with exact incompatibility output
- Stabilize release proof by isolating smoke ports, aligning support/docs/example wording to ordinary TypeScript in `.fs`, and regenerating compatibility/search/API artifacts from the final contract


## v3.1.1 - 2026-04-17
- release prep
