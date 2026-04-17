export default function Governance() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Open governance</p>
      <h1 class="h1">RFC &amp; Governance</h1>
      <p class="page-sub">How FastScript makes decisions, introduces language changes, and manages its versioning policy.</p>
    </div>

    <section class="reveal">
      <header class="sec-header">
        <p class="kicker">Process</p>
        <h2 class="h2">How decisions are made</h2>
      </header>
      <div class="how-grid">
        <div class="how-cell">
          <p class="how-num">01 &mdash; Discuss</p>
          <p class="how-title">Open a discussion</p>
          <p class="how-copy">Any community member can open a GitHub Discussion proposing a change. Lightweight changes (docs, non-breaking API additions) are handled here directly.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 &mdash; RFC</p>
          <p class="how-title">Write an RFC</p>
          <p class="how-copy">Significant language changes, new syntax forms, or breaking API changes require a formal RFC document submitted as a pull request to the <code class="ic">rfcs/</code> directory.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 &mdash; Merge</p>
          <p class="how-title">Maintainer review</p>
          <p class="how-copy">RFCs are open for community comment for a minimum of 14 days. A maintainer then accepts, requests revision, or closes with explanation.</p>
        </div>
      </div>
    </section>

    <section class="reveal">
      <header class="sec-header">
        <p class="kicker">Active &amp; recent RFCs</p>
        <h2 class="h2">Request for Comments</h2>
      </header>

      <div class="rfc-list">
        <div class="rfc-item">
          <p class="rfc-item-id">RFC-004</p>
          <p class="rfc-item-title">Streaming SSR protocol for .fs pages</p>
          <p class="rfc-item-copy">Defines the HTTP streaming response format and chunk protocol for server-rendered .fs pages.</p>
          <span class="rfc-item-status rfc-status-open">Open</span>
        </div>
        <div class="rfc-item">
          <p class="rfc-item-id">RFC-003</p>
          <p class="rfc-item-title">AI reliability mode compiler flags</p>
          <p class="rfc-item-copy">Introduces strict diagnostic rules for AI-generated .fs output, catching common hallucination patterns at compile time.</p>
          <span class="rfc-item-status rfc-status-open">Open</span>
        </div>
        <div class="rfc-item">
          <p class="rfc-item-id">RFC-002</p>
          <p class="rfc-item-title">Type-safe ctx.db inference</p>
          <p class="rfc-item-copy">Auto-infer return types for database query helpers based on schema definition files.</p>
          <span class="rfc-item-status rfc-status-accepted">Accepted</span>
        </div>
        <div class="rfc-item">
          <p class="rfc-item-id">RFC-001</p>
          <p class="rfc-item-title">ISR revalidation with cache tags</p>
          <p class="rfc-item-copy">Tag-based incremental static regeneration allowing targeted cache invalidation per page or data dependency.</p>
          <span class="rfc-item-status rfc-status-accepted">Accepted</span>
        </div>
      </div>
    </section>

    <section class="reveal">
      <header class="sec-header">
        <p class="kicker">Versioning</p>
        <h2 class="h2">Versioning policy</h2>
      </header>
      <div class="story-grid">
        <div class="story-cell">
          <p class="story-cell-title">Semantic versioning</p>
          <p class="story-cell-copy">FastScript follows SemVer. PATCH releases fix bugs without breaking changes. MINOR releases add features with backward compatibility. MAJOR releases may include breaking changes documented in the upgrade guide.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">LTS policy</p>
          <p class="story-cell-copy">Each stable major version receives 18 months of active maintenance and 6 months of security-only fixes. The current v4 line is actively maintained; v1, v1.1, v2, and v3 remain historical reference lines.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">Breaking changes</p>
          <p class="story-cell-copy">Breaking changes are always announced in a prior MINOR release with deprecation warnings. A migration guide is published alongside the breaking MAJOR release.</p>
        </div>
        <div class="story-cell">
          <p class="story-cell-title">Release cadence</p>
          <p class="story-cell-copy">PATCH releases are cut as needed. MINOR releases are targeted monthly. MAJOR releases are infrequent and announced at least 60 days in advance.</p>
        </div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Want to propose a change?</h2>
        <p class="cta-copy">Read the full RFC process in <code class="ic">docs/GOVERNANCE_VERSIONING_POLICY.md</code> then open a Discussion to start the conversation.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Start a discussion</a>
          <a class="btn btn-secondary btn-lg" href="https://github.com/lordolami/fastscript/blob/master/docs/GOVERNANCE_VERSIONING_POLICY.md" target="_blank" rel="noreferrer">Read governance doc</a>
        </div>
      </div>
    </section>
  `;
}
