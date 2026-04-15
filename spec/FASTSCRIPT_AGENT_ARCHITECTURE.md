# FastScript Agent Architecture

## Goal

Define the architecture required for the FastScript coding agent to become a full builder, developer, migration, and export system.

## 1. Core Model Strategy

The agent architecture should treat FastScript as:

1. the internal reasoning language
2. the canonical authored language
3. the compiler validation target
4. the exporter source

This means the architecture should not optimize for raw target-language chaos first.

## 2. Core Layers

### Layer A: FastScript language/runtime substrate

Already established enough to support the next layer:

1. stable syntax
2. stable semantics
3. stable compiler
4. strong diagnostics
5. strong validation
6. export targets
7. same-host full-stack primitives
8. predictable project structure

### Layer B: Agent runtime loop

The agent runtime loop must support:

1. read files
2. plan changes
3. write files
4. run build
5. run validate
6. inspect diagnostics
7. patch failures
8. repeat until proof passes

### Layer C: Exporter/adapters

The export layer must support:

1. JS output
2. TS output
3. deploy-target outputs
4. scaffold outputs where supported
5. future mobile outputs
6. future desktop outputs

### Layer D: Evaluation and scoring

The eval layer must score:

1. syntax correctness
2. validation correctness
3. test pass rate
4. deploy success
5. prompt alignment
6. UI quality
7. responsiveness
8. migration fidelity
9. export fidelity

## 3. Product Modes

### Builder mode

Input:

1. prompt
2. optional brand/style intent
3. optional target template

Output:

1. full FastScript app
2. validated build
3. preview deploy
4. optional export

### Developer mode

Input:

1. repo
2. task
3. constraints

Output:

1. code changes
2. explanations
3. validation results
4. optional deploy

### Migration mode

Input:

1. JS/TS codebase
2. migration target
3. structural constraints

Output:

1. `.fs` migration slices
2. preserved route structure
3. preserved UI
4. reduced authored JS over time

## 4. Internal Flow

The internal flow should be:

1. task interpretation
2. FastScript-first plan generation
3. file-level implementation
4. compiler validation
5. test/eval pass
6. export/deploy
7. explanation and artifact delivery

## 5. Why FastScript Improves Agent Architecture

FastScript reduces reasoning entropy through:

1. one authored language
2. one route structure
3. one same-host full-stack mental model
4. one compiler-backed validation loop
5. one export source

This makes the agent faster and more reliable than reasoning directly in a fragmented ecosystem.

## 6. Long-Term Architecture Extensions

The architecture should later extend to:

1. mobile target adapters
2. desktop target adapters
3. richer export lanes
4. multi-language paired mapping
5. multi-agent collaboration
6. shared design systems
7. marketplace/template generation

## 7. Non-Negotiable Constraints

1. FastScript remains the internal canonical layer
2. validation remains part of the default loop
3. same-host architecture remains first-class
4. exports must not degrade FastScript’s internal speed advantage
5. the system must remain usable by both prompt builders and developers
