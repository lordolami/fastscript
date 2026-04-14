# Security Policy

FastScript is a protected commercial codebase built as part of a larger AI platform strategy. This repository is source-available for review and evaluation, but it is not released under a permissive open-source license.

## Supported Versions

| Version | Security fixes | Status |
| --- | --- | --- |
| v1.x | Yes | Active |
| v0.x | No | Archived |

## Reporting a Vulnerability

Do not open a public issue for security problems.

Report privately to:

- `security@fastscript.dev`
- `legal@fastscript.dev`

Include as much of the following as possible:

- affected component or file
- reproduction steps
- expected vs actual behavior
- impact assessment
- proof-of-concept if safe to share
- environment and version details

## Response Targets

- Acknowledgement target: within 48 hours
- Initial triage target: within 5 business days
- Critical issue patch target: as fast as reasonably possible, typically within 14 days

These are targets, not guarantees.

## Disclosure Rules

Until we confirm remediation and approve disclosure, do not publicly share:

- exploit steps
- working payloads
- bypass details
- private repository content
- internal platform details

## Product Security Scope

Security review may include:

- compiler and runtime behavior
- CLI and deploy adapters
- website and hosted docs/playground behavior
- auth/session flows
- upload, webhook, storage, and queue paths
- supply-chain and build artifacts

## Commercial and AI Restrictions

Without prior written permission, you may not use FastScript source or related materials to:

- build or ship a competing AI product
- train, fine-tune, improve, or benchmark a commercial AI model
- redistribute FastScript core code in commercial tooling

## Security Research Recognition

FastScript does not currently run a public paid bug bounty program.

At maintainer discretion, valid reports may receive:

- acknowledgement in release notes or a security advisory
- direct thanks in private communication
- follow-up contact for coordinated disclosure

## Legal

This policy complements, but does not replace:

- `LICENSE`
- website terms at `/terms`
- website license page at `/license`

For commercial licensing or legal questions:

- `legal@fastscript.dev`
