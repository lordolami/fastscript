export default function DocsPrimitives() {
  return `
    <section class="docs-v11-page">
      <header class="sec-header">
        <p class="kicker">Styling primitives</p>
        <h1 class="h1">Primitive-first UI authoring in FastScript.</h1>
        <p class="lead">Build interfaces with Box, Stack, Row, Text, Heading, Button, semantic props, and token-backed variants inside the FastScript v4.1 platform instead of raw CSS trivia.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Preferred primitives</p>
          <p class="docs-card-copy">Start with Box, Stack, Row, Grid, Text, Heading, Button, Card, Panel, and Input. These compile into stable web markup plus generated primitive CSS.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Semantic props</p>
          <p class="docs-card-copy">Use pad, gap, radius, shadow, surface, tone, size, weight, align, justify, cols, enter, hover, level, and as.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Validation</p>
          <p class="docs-card-copy">Primitive props are validated against the design token system. Invalid semantic values fail style validation before shipping.</p>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Example</p>
          <h2 class="h2">Write design intent, not CSS trivia.</h2>
        </header>
        <div class="code-pair">
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">hero.fs</span>
              <span class="code-block-lang">.fs</span>
            </div>
            <div class="code-block-body">&lt;Screen pad="6" surface="panel"&gt;
  &lt;Container&gt;
    &lt;Stack gap="5" pad="6" radius="lg" shadow="soft" surface="card"&gt;
      &lt;Text tone="primary" size="sm" weight="semibold"&gt;FastScript&lt;/Text&gt;
      &lt;Heading size="3xl"&gt;Build once, ship anywhere.&lt;/Heading&gt;
      &lt;Text tone="muted" size="lg"&gt;
        Full-stack .fs apps with a permanent styling contract.
      &lt;/Text&gt;
      &lt;Row gap="3"&gt;
        &lt;Button tone="primary" size="lg"&gt;Get started&lt;/Button&gt;
        &lt;Button tone="ghost" href="/docs"&gt;Read docs&lt;/Button&gt;
      &lt;/Row&gt;
    &lt;/Stack&gt;
  &lt;/Container&gt;
&lt;/Screen&gt;</div>
          </div>
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">rendered html</span>
              <span class="code-block-lang">SSR</span>
            </div>
            <div class="code-block-body">&lt;main data-classes=&quot;fs-box fs-screen fs-pad-6 fs-surface-panel&quot;&gt;
  &lt;div data-classes=&quot;fs-box fs-container&quot;&gt;
    &lt;div data-classes=&quot;fs-box fs-stack fs-gap-5 fs-pad-6 fs-radius-lg fs-shadow-soft fs-surface-card&quot;&gt;
      &lt;p data-classes=&quot;fs-text fs-text-size-sm fs-tone-primary fs-weight-semibold&quot;&gt;FastScript&lt;/p&gt;
      &lt;h2 data-classes=&quot;fs-heading fs-heading-size-3xl&quot;&gt;Build once, ship anywhere.&lt;/h2&gt;
      &lt;p data-classes=&quot;fs-text fs-text-size-lg fs-tone-muted&quot;&gt;...&lt;/p&gt;
      &lt;div data-classes=&quot;fs-box fs-row fs-gap-3&quot;&gt;...&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/main&gt;</div>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Available now</p>
          <p class="docs-card-copy">Box, Stack, Row, Grid, Section, Container, Screen, Card, Panel, Text, Heading, Code, Label, Badge, Link, Button, Input, Textarea, Select, Spacer, Loader, Checkbox, Radio, Switch, Field, Alert, and Empty.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Use with tokens</p>
          <p class="docs-card-copy">Tokens live in <code class="ic">app/design/tokens.json</code>. Primitive CSS is generated into <code class="ic">app/styles.generated.css</code>.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Spec</p>
          <p class="docs-card-copy">The permanent source of truth for the styling model is the Styling v1 spec in the repository.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/master/spec/STYLING_V1_SPEC.md" target="_blank" rel="noreferrer">Open spec &#8594;</a>
        </div>
      </section>
    </section>
  `;
}
