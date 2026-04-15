# FastScript Agent Data, Eval, and Training Plan

## 1. Principle

The FastScript agent should not be trained on prompt volume alone.

It should be trained and evaluated on validated structured examples.

The main advantage of FastScript is that data can be:

1. smaller and cleaner
2. more regular
3. compiler-verifiable
4. easier to score automatically

## 2. Required Data Types

### A. Prompt -> FastScript

Examples where natural language becomes:

1. page
2. dashboard
3. ecommerce storefront
4. admin panel
5. full-stack product

### B. Broken FastScript -> Fixed FastScript

Examples for:

1. syntax repair
2. type repair
3. runtime-scope repair
4. validation repair
5. deploy repair

### C. FastScript -> Export Target

Examples for:

1. FastScript -> JS
2. FastScript -> TS
3. FastScript -> deploy adapter outputs
4. later FastScript -> mobile and desktop targets

### D. JS/TS -> FastScript

Examples for:

1. route migration
2. API migration
3. middleware migration
4. mixed project migration

### E. Repo + Task -> Patch

Examples where the model:

1. reads a codebase
2. applies a task
3. modifies files
4. validates result

### F. Error -> Repair

Examples where the model reads:

1. compiler errors
2. validation failures
3. runtime issues
4. deploy failures

and repairs them.

## 3. Data Quality Rules

Every training example should be tagged by:

1. task type
2. product type
3. UI complexity
4. full-stack surface used
5. whether it passed build
6. whether it passed validate
7. whether it passed tests
8. whether it deployed

## 4. Evaluation System

The eval system must score:

1. valid FastScript generation
2. build success
3. validate success
4. test success
5. deploy success
6. prompt alignment
7. responsive UI quality
8. migration fidelity
9. export quality
10. repair success rate

## 5. Training Stages

### Stage 1: orchestration-first

Use existing strong models with:

1. FastScript prompting
2. FastScript validation loop
3. repair loop
4. early evals

### Stage 2: specialized adaptation

Use:

1. high-quality FastScript datasets
2. paired migration/export datasets
3. repair/eval loops

Target:

1. stronger FastScript generation
2. stronger repair
3. lower token cost

### Stage 3: serious coding-agent model

Use:

1. repo-scale data
2. task-to-patch data
3. prompt-to-full-app data
4. export and deploy data

### Stage 4: broader general coding reach

Expand through:

1. FastScript-first reasoning
2. paired mapping into broader target languages
3. larger-scale structured training

## 6. Data Scale Guidance

The initial system does not need one million random prompts.

The preferred path is:

1. `5,000 - 20,000` elite examples for early specialization
2. `50,000 - 200,000` validated examples for serious FastScript tuning
3. larger-scale corpora only after evals and product fit justify them

## 7. Why This Is A Moat

FastScript makes it possible to create:

1. cleaner datasets
2. lower-noise corpora
3. compiler-filtered examples
4. structured export pairs
5. stronger automated eval loops

That is a major advantage over raw ecosystem-chaos training.
