# FastScript Multi-Target App Plan

## Purpose
FastScript should become one language that developers can learn once and use across:

1. web
2. server
3. mobile
4. desktop
5. shared libraries

The goal is not to create a different language for every platform.
The goal is one FastScript core language with multiple runtime targets.

## Current Position
FastScript is already strongest on:

1. web
2. full-stack server work
3. deploy adapters for Node, Vercel, and Cloudflare

This is the base layer. New targets should grow outward from this foundation instead of replacing it.

## Core Rule
FastScript must keep:

1. one syntax
2. one module model
3. one state model
4. one CLI family
5. one mental model

Platform-specific behavior should be handled by adapters and target runtimes, not by inventing separate languages.

## Platform Expansion Order
The recommended order is:

1. web and server stabilization
2. mobile target
3. desktop target
4. package and library mode
5. deeper native-runtime work later

This order gives the fastest path to real-world usefulness without overbuilding too early.

## First New Target: Mobile
The first mobile target should be:

- FastScript -> React Native / Expo

### Why This Is The Right First Mobile Target
1. Fastest route to real iOS and Android apps
2. Large ecosystem and tooling base
3. Lets FastScript prove itself outside the browser quickly
4. Avoids building a phone runtime from scratch too early
5. Supports the larger vision of one language across product surfaces

## Mobile Design Principles
The mobile target should preserve:

1. `.fs` source files
2. FastScript module imports and exports
3. `fn`
4. `state`
5. `~`
6. shared logic and utility modules

The mobile target should change:

1. renderer backend
2. navigation backend
3. style output layer
4. device API adapters
5. build output shape

## Mobile Runtime Shape
FastScript mobile should compile to a React Native / Expo compatible target.

That means the source language stays FastScript while the generated output is mobile-runtime-friendly JavaScript.

## Proposed Mobile Primitive Surface
FastScript mobile should expose a small, stable primitive set such as:

1. `Screen`
2. `View`
3. `Text`
4. `Image`
5. `Scroll`
6. `Pressable`
7. `Input`
8. `Stack`
9. `Row`
10. `Column`

These should compile to native mobile primitives through the target adapter.

## Shared Logic Across Web And Mobile
The following should remain shared:

1. utility modules
2. validation modules
3. domain logic
4. fetch and API client logic
5. auth client helpers where appropriate
6. data transforms
7. formatting helpers
8. app state patterns

The goal is to let teams share logic while swapping only the rendering layer and platform adapters.

## Navigation Direction
FastScript mobile should keep a route-like app structure, but the backend implementation should map to a proven mobile navigation system.

Recommended first direction:

- FastScript route model -> Expo Router or React Navigation adapter

This keeps FastScript familiar while using stable mobile navigation under the hood.

## Styling Direction
FastScript mobile should not depend on browser CSS assumptions.

Recommended rule:

1. keep FastScript styling constrained
2. compile mobile styles to React Native style objects
3. preserve the FastScript authoring model where possible
4. avoid raw CSS as the mobile baseline

## Device APIs To Support Later
After the mobile target is established, the following adapters become important:

1. storage
2. camera
3. notifications
4. haptics
5. location
6. secure store / keychain
7. file access
8. share sheet

These should be exposed through FastScript abstractions, not direct platform-specific authoring only.

## Second New Target: Desktop
The recommended desktop path is:

1. FastScript -> Electron first
2. Tauri-style lighter packaging later

### Why Desktop Comes After Mobile
1. Mobile gives wider immediate startup/product value
2. Desktop becomes easier once shared runtime APIs are stable
3. FastScript can reuse large parts of the web/full-stack foundation

## Desktop Design Principles
FastScript desktop should preserve:

1. `.fs` source
2. shared business logic
3. same module model
4. same state model

Desktop-specific adapters should cover:

1. window shell
2. IPC
3. filesystem access
4. tray and menu hooks
5. local packaging

## Shared Runtime API Strategy
To make FastScript feel like one language everywhere, we eventually need shared abstractions for:

1. storage
2. fetch/network
3. validation
4. configuration
5. auth/session client contracts
6. logging and diagnostics
7. cache semantics where possible

These should behave consistently even if the underlying platform changes.

## Future CLI Shape
This is not an implementation commitment yet, but the platform direction should allow:

1. `fastscript create my-app --target web`
2. `fastscript create my-app --target mobile`
3. `fastscript create my-app --target desktop`
4. `fastscript build --target mobile`
5. `fastscript build --target desktop`
6. `fastscript dev --target mobile`

## Project Structure Direction
Possible long-term structure:

1. `apps/web`
2. `apps/mobile`
3. `apps/desktop`
4. `packages/shared`
5. `packages/ui`
6. `packages/runtime`

This allows one codebase with shared modules and target-specific apps.

## Definition Of Success
FastScript succeeds as a multi-target language when a developer can:

1. learn FastScript once
2. build a website
3. build a backend
4. build a mobile app
5. build a desktop app
6. publish shared libraries

without switching languages or re-learning the platform model from scratch.

## Not Building Yet
This document is a design and direction lock, not an implementation step.

The next practical work should be:

1. keep the website and current web/server stack stable
2. define the target system formally
3. rewrite one TypeScript script into `.fs` as a proving exercise
4. then begin mobile target architecture in implementation phases
