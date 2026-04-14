# FastScript Repo Boundary Strategy

FastScript is source-available for review and evaluation, but the long-term platform strategy requires a clear boundary between material that can be shared publicly and material that should remain protected.

## Public-safe material

- documentation intended for developers
- examples and templates
- release notes and benchmark reports
- migration guides
- non-sensitive website copy

## Protected material

- compiler/runtime internals that create durable platform advantage
- AI generation workflows, prompts, evals, and training assets
- commercial deployment platform logic
- enterprise-only features and private integrations
- internal ops, keys, rollout procedures, and sensitive support paths

## Operational model

1. Keep the canonical product repo protected by the FastScript Source-Available License v1.
2. Export only approved public material into a separate public docs/examples bundle when needed.
3. Do not publish private platform code, AI assets, or internal ops material in public mirrors.
4. Keep branding, trademarks, and commercial rights reserved.

## Tooling

Use `npm run public:bundle` to create a reviewable public bundle from the approved allowlist in `scripts/prepare-public-docs-bundle.mjs`.
