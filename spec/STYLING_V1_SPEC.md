# FastScript Styling Spec v1

## Status

- Version: `v1`
- Scope: design-time and compile-time styling contract for FastScript apps
- Audience: compiler/runtime implementers, AI generation systems, app developers
- Relationship to current system:
  - extends `docs/AI_CONTEXT_PACK_V1.md`
  - aligns with `src/style-system.mjs`
  - defines the permanent direction for styling across `web`, `mobile`, and later `desktop`

## 1. Purpose

FastScript styling must solve five problems at once:

1. keep generated UI output predictable for AI systems;
2. keep app code readable for humans;
3. support real production interfaces, not toy demos;
4. remain portable across multiple runtime targets;
5. prevent low-level CSS churn from becoming the main developer experience.

The permanent model is:

- developers express **design intent**
- FastScript owns the **styling vocabulary**
- the compiler maps that vocabulary to a target-specific backend

FastScript styling is therefore not "raw CSS everywhere" and not "Tailwind forever as the language identity." Tailwind may be used as an implementation backend on web, but FastScript owns the public styling contract.

## 2. Design Goals

FastScript styling v1 is designed to be:

1. **Finite**
   - AI should choose from a constrained, validated vocabulary.
2. **Semantic**
   - app code should describe layout, tone, spacing, and hierarchy, not CSS trivia.
3. **Composable**
   - primitives, variants, and tokens should layer without conflict.
4. **Portable**
   - the same styling intent should map cleanly to `web`, `mobile`, and later `desktop`.
5. **Themeable**
   - light, dark, and accessible variants must come from token substitution, not hand-editing every component.
6. **Escapable**
   - advanced teams still need a controlled escape hatch when primitives cannot fully express intent.

## 3. System Layers

FastScript styling v1 is made of seven layers:

1. design tokens
2. style primitives
3. layout primitives
4. variants
5. motion primitives
6. themes
7. compiler style adapters

These layers are ordered from "most shared" to "most target-specific."

## 4. Syntax

### 4.1 Syntax Philosophy

FastScript styling syntax must be:

1. short
2. explicit
3. readable in plain text
4. validatable without full CSS parsing

The preferred surface is **semantic props and style blocks**, not arbitrary inline CSS strings.

### 4.2 Preferred Element Syntax

```fs
export default fn Page() {
  return `
    <Stack gap="5" pad="6" surface="panel">
      <Heading size="2xl">Build faster</Heading>
      <Text tone="muted">
        One language, many targets.
      </Text>
      <Row gap="3">
        <Button tone="primary">Get Started</Button>
        <Button tone="ghost">Read Docs</Button>
      </Row>
    </Stack>
  `
}
```

### 4.3 Allowed Styling Surfaces

FastScript styling v1 supports these authoring surfaces:

1. semantic props on primitives
2. `style { ... }` blocks with finite values
3. generated utility classes
4. allowlisted custom classes
5. controlled backend escape hatches

### 4.4 Semantic Props

The preferred authoring surface is semantic props such as:

- `pad`
- `gap`
- `tone`
- `surface`
- `radius`
- `shadow`
- `size`
- `align`
- `justify`
- `cols`
- `enter`
- `hover`

Example:

```fs
<Card pad="5" radius="lg" shadow="md" surface="card">
  <Heading size="xl">FastScript</Heading>
  <Text tone="muted">Readable by humans. Predictable for AI.</Text>
</Card>
```

### 4.5 Style Block Syntax

The current finite `style { ... }` block remains supported and is part of the permanent contract for low-level but validated styling.

Example:

```fs
component Hero() {
  style {
    padding: 6
    gap: 4
    display: flex
    direction: column
    @md {
      padding: 8
    }
  }

  return `<section class="hero-shell"></section>`
}
```

Current v1 finite style rules include:

1. spacing properties:
   - `padding`, `margin`, `gap`, `top`, `right`, `bottom`, `left`
   - allowed values: `0..13`
2. colors:
   - `bg`, `text`, `border`
   - allowed format: `{color}-{shade}`
3. enums:
   - `size`
   - `weight`
   - `display`
   - `direction`
   - `align`
   - `justify`
4. breakpoints:
   - `@sm`
   - `@md`
   - `@lg`
   - `@xl`

The compiler must reject out-of-contract values.

### 4.6 Unsupported-by-Default Syntax

These remain disallowed by default:

1. raw inline style attributes
2. arbitrary hex colors inside route/component files
3. arbitrary breakpoint declarations
4. arbitrary CSS functions in style blocks
5. unbounded ad hoc class generation

## 5. Token Vocabulary

### 5.1 Token Role

Tokens are the canonical design vocabulary shared across all targets.

They define:

1. color roles
2. spacing scale
3. radius scale
4. typography roles
5. elevation
6. border roles
7. motion timing
8. breakpoints

### 5.2 Token Categories

FastScript styling v1 standardizes the following token namespaces:

1. `color.*`
2. `space.*`
3. `radius.*`
4. `text.*`
5. `border.*`
6. `shadow.*`
7. `motion.*`
8. `breakpoint.*`

### 5.3 Core Color Roles

Color tokens must be semantic, not page-specific.

Minimum role set:

1. `color.bg`
2. `color.surface`
3. `color.surfaceAlt`
4. `color.text`
5. `color.textMuted`
6. `color.border`
7. `color.primary`
8. `color.secondary`
9. `color.accent`
10. `color.success`
11. `color.warning`
12. `color.error`

For scale-based systems, shaded token families are allowed:

- `primary-50..900`
- `secondary-50..900`
- `accent-50..900`
- `neutral-50..900`
- `success-50..900`
- `warning-50..900`
- `error-50..900`

### 5.4 Spacing Scale

Spacing values must resolve from a bounded scale.

The current finite scale is:

- `0..13`

Compiler/runtime adapters may expose friendly aliases later:

- `xs`
- `sm`
- `md`
- `lg`
- `xl`

but scale resolution must still map to canonical token values.

### 5.5 Typography Roles

Typography must be tokenized by role, not repeated by page.

Minimum typography roles:

1. `text.caption`
2. `text.body`
3. `text.label`
4. `text.title`
5. `text.display`
6. `text.code`

Each typography role may contain:

1. `size`
2. `line`
3. `weight`
4. `tracking`

### 5.6 Theme Token Override Model

Themes do not change component structure.
Themes override token values.

Example direction:

```fs
theme dark {
  color.bg = "#050505"
  color.text = "#ffffff"
}

theme light {
  color.bg = "#ffffff"
  color.text = "#111111"
}
```

## 6. Primitive List

### 6.1 Primitive Philosophy

Primitives are the stable, readable building blocks AI should prefer when generating FastScript UI.

They should express intent such as:

- container
- stack
- row
- section
- heading
- body text
- action
- form control

### 6.2 Layout Primitives

Core layout primitives:

1. `Box`
2. `Stack`
3. `Row`
4. `Grid`
5. `Section`
6. `Spacer`
7. `Container`
8. `Screen`

Recommended meaning:

1. `Box`
   - generic styled container
2. `Stack`
   - vertical layout
3. `Row`
   - horizontal layout
4. `Grid`
   - responsive column layout
5. `Section`
   - semantic page segment
6. `Spacer`
   - explicit flexible separation
7. `Container`
   - width-constrained wrapper
8. `Screen`
   - top-level route or mobile screen wrapper

### 6.3 Typography Primitives

Core typography primitives:

1. `Heading`
2. `Text`
3. `Code`
4. `Label`
5. `Badge`

### 6.4 Action and Form Primitives

Core action/form primitives:

1. `Button`
2. `Input`
3. `Textarea`
4. `Select`
5. `Checkbox`
6. `Radio`
7. `Switch`
8. `Field`

### 6.5 Surface and Feedback Primitives

Core surface/feedback primitives:

1. `Card`
2. `Panel`
3. `Modal`
4. `Drawer`
5. `Tooltip`
6. `Toast`
7. `Alert`
8. `Empty`
9. `Loader`

### 6.6 Media and Navigation Primitives

Core media/navigation primitives:

1. `Image`
2. `Avatar`
3. `Icon`
4. `Link`
5. `Tabs`
6. `Breadcrumbs`
7. `Nav`
8. `Pagination`

## 7. Variant Rules

### 7.1 Why Variants Exist

Variants are the main way FastScript keeps styling finite while still being expressive.

Instead of hand-authoring one-off class combinations, components expose validated variant axes.

### 7.2 Standard Variant Axes

FastScript styling v1 reserves these common axes:

1. `tone`
2. `size`
3. `surface`
4. `intent`
5. `state`
6. `density`
7. `elevation`

### 7.3 Example Variant Usage

```fs
<Button tone="primary" size="lg">Get Started</Button>
<Button tone="ghost" size="md">Read Docs</Button>
<Card surface="elevated" radius="lg">...</Card>
<Text tone="muted" size="sm">Stable by default.</Text>
```

### 7.4 Variant Contract

Variant values must be:

1. predefined
2. documented
3. type-checkable
4. target-portable

Recommended canonical values:

- `tone`: `primary | secondary | accent | success | warning | error | muted | ghost`
- `size`: `xs | sm | md | lg | xl`
- `surface`: `plain | subtle | panel | card | elevated | inverted`
- `state`: `default | hover | active | disabled | loading | selected`

### 7.5 Variant Composition

Variant composition must be deterministic.

Order of application:

1. base primitive styles
2. theme tokens
3. component-level default variants
4. user-selected variants
5. responsive overrides
6. explicit escape-hatch overrides

## 8. Compiler Mapping

### 8.1 Compiler Role

The compiler is responsible for mapping FastScript styling intent to the current backend target.

FastScript app code should not need to change just because the style backend changes.

### 8.2 Web Mapping

Primary web mapping in v1:

1. semantic props -> generated utility classes and/or tokenized CSS
2. style blocks -> validated CSS variable-backed output
3. variants -> generated class recipes
4. themes -> token swaps via root variables and theme selectors

Tailwind may be used as an implementation backend, but the FastScript contract remains:

- semantic props
- finite style blocks
- token vocabulary
- component variants

### 8.3 Mobile Mapping

Planned mobile mapping:

1. semantic layout props -> React Native flexbox style objects
2. token-based spacing -> numeric RN values
3. typography roles -> RN text style objects
4. variants -> generated style recipes
5. themes -> token sets for mobile runtime

Mobile must not depend on CSS-only features.

### 8.4 Desktop Mapping

Desktop mapping is planned after mobile.

Likely targets:

1. Electron
2. Tauri

The same semantic styling contract should continue to work with target-specific adapters.

### 8.5 Escape Hatch Mapping

Escape hatches must exist, but be deliberately lower-level than the default system.

Suggested precedence:

1. FastScript-native style props and variants
2. target-native escape hatch
3. raw backend styling only when absolutely necessary

Examples:

1. web:
   - `class=""`
2. mobile:
   - `nativeStyle={...}`

Escape hatches are supported for power, not promoted as the primary authoring model.

## 9. AI Generation Rules

### 9.1 AI Objective

AI systems generating FastScript UI should optimize for:

1. validity
2. consistency
3. readability
4. portability
5. theme safety

### 9.2 Priority Order for AI

When generating styles, AI should use this priority order:

1. primitive semantic props
2. documented variants
3. finite `style { ... }` blocks
4. generated utility classes
5. escape hatch styling only if required

### 9.3 AI Must Prefer

AI should prefer:

1. `Stack`, `Row`, `Grid`, `Box`, `Card`, `Text`, `Heading`, `Button`
2. token names over hardcoded values
3. `tone`, `size`, and `surface` variants over one-off styling
4. layout props over raw flex/grid syntax
5. theme-safe semantic color roles

### 9.4 AI Must Avoid

AI should avoid:

1. raw inline CSS
2. arbitrary color literals in route/component files
3. inventing undocumented variant values
4. mixing too many styling layers in one component
5. turning every component into utility-class soup

### 9.5 AI Fallback Rule

If a design cannot be expressed by documented primitives or variants:

1. use a finite `style { ... }` block if possible
2. otherwise use the platform escape hatch minimally
3. do not invent new syntax silently

### 9.6 AI Output Quality Rule

Generated FastScript code should read like hand-authored product code, not like an unstructured utility dump.

## 10. Migration Path

FastScript styling becomes permanent in stages.

### Stage 1

Current foundation:

1. design tokens in `app/design/tokens.json`
2. generated utility classes in `app/styles.generated.css`
3. finite `style { ... }` validation in `src/style-system.mjs`

### Stage 2

Introduce first-class primitives:

1. `Box`
2. `Stack`
3. `Row`
4. `Grid`
5. `Text`
6. `Heading`
7. `Button`
8. `Card`

### Stage 3

Introduce official variants:

1. `tone`
2. `size`
3. `surface`
4. `state`

### Stage 4

Switch AI generation defaults from raw utility output to primitive-first generation.

### Stage 5

Map the same contract to mobile adapters.

### Stage 6

Extend the same contract to desktop targets.

## 11. Source-of-Truth Rules

Until later revisions replace it, the styling source of truth is:

1. this spec: `spec/STYLING_V1_SPEC.md`
2. AI implementation guardrails: `docs/AI_CONTEXT_PACK_V1.md`
3. current validator/runtime implementation: `src/style-system.mjs`

If implementation and spec diverge:

1. compiler behavior must not silently expand beyond the documented contract
2. new styling capabilities must land through spec updates
3. AI rules must be updated alongside compiler changes

## 12. Summary

FastScript styling v1 is the permanent direction for a multi-target style system:

1. semantic syntax
2. finite tokens
3. validated primitives
4. controlled variants
5. compiler-mapped output backends
6. AI-safe generation rules

The key principle is:

**developers write design intent once, and FastScript maps it to the right styling backend everywhere.**
