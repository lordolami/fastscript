export default function DocsV2() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Historical line v2.0</p>
        <h1 class="h1">FastScript v2.0 archive</h1>
        <p class="lead">This page preserves the ratified v2.0 line as historical context. The current public line is v3, while v2 remains available for ratification history, migration proof, and earlier release context.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Formal spec</p>
          <p class="docs-card-copy">Canonical v2.0 scope, principles, execution plan, and exit criteria for the archived ratification line.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/V2_0_FORMAL_SPEC_AND_EXECUTION_PLAN.md" target="_blank" rel="noreferrer">Open formal spec &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Execution tracker</p>
          <p class="docs-card-copy">Phase-by-phase completion record for the v2.0 implementation spine.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/V2_0_EXECUTION_TRACKER.md" target="_blank" rel="noreferrer">Open tracker &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Ratification record</p>
          <p class="docs-card-copy">Proof that the v2.0 language/runtime surface was reviewed, frozen, and signed off.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/V2_0_RATIFICATION_RECORD.md" target="_blank" rel="noreferrer">Open record &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Migration proof</p>
          <p class="docs-card-copy">Evidence pack showing the migration proof gates used to validate the v2.0 line before the v3 public-surface rewrite.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/V2_0_MIGRATION_PROOF_REPORT.md" target="_blank" rel="noreferrer">Open report &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">What v2.0 established</p>
          <h2 class="h2">Why this archive still matters.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Normal programming support</p>
            <p class="docs-card-copy">Ambient standard library, runtime globals, DOM/platform modeling, and stronger inference for ordinary application code.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Zero-JS authored apps</p>
            <p class="docs-card-copy">Authored application source can live in <code class="ic">.fs</code> without requiring a handwritten JS bridge layer for common runtime work.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Same-host full stack</p>
            <p class="docs-card-copy">Pages, APIs, middleware, jobs, and deploy outputs remain one app boundary instead of a forced frontend/backend split.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Frozen public line</p>
            <p class="docs-card-copy">The v2 ratification set the stage for the later v3 public promise around universal JS/TS in <code class="ic">.fs</code> and proof-backed speed messaging.</p>
          </div>
        </div>
      </section>
    </section>
  `;
}
