# FastScript Security Architecture

FastScript publishes its security architecture publicly and keeps exploit-sensitive operational detail private.

## Public platform contract

FastScript v4.1 now treats the following as public security guarantees:

1. runtime-scope enforcement for browser, server, and edge boundaries
2. explicit runtime permissions policy through `fastscript.permissions.json`
3. secure-by-default scaffolds for new apps
4. secret-exposure validation on obvious public/browser paths
5. CSRF/session protections for authenticated flows
6. webhook signature verification and replay protection primitives
7. deploy-header and env-schema baseline checks
8. security-readiness reporting as tooling output

## Why this stays public

Teams need to understand what FastScript enforces, what it checks, and how security readiness is meant to work in production. That knowledge is part of the platform contract.

## What stays private

Sensitive exploit-path analysis, abuse playbooks, and implementation-specific threat notes remain in protected internal material.

For coordinated access or disclosure:

- `security@fastscript.dev`
- `legal@fastscript.dev`
