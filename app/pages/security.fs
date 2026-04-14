export default function Security() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Trust &amp; Safety</p>
      <h1 class="h1">Security Policy</h1>
      <p class="page-sub">How FastScript handles private vulnerability disclosure, supported versions, product security, and restricted commercial use.</p>
    </div>

    <div class="prose-section reveal">
      <h2 class="h2">Supported versions</h2>
      <div class="compare-table">
        <div class="compare-header">
          <div class="compare-col-head">Version</div>
          <div class="compare-col-head is-ours">Security fixes</div>
          <div class="compare-col-head">Status</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">v1.x (current stable)</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Yes</div>
          <div class="compare-cell">Active</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">v0.x (legacy pre-stable)</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> No</div>
          <div class="compare-cell">Archived</div>
        </div>
      </div>

      <h2 class="h2">Private disclosure only</h2>
      <p class="body-copy">If you discover a vulnerability, do not open a public GitHub issue or public advisory before remediation. Report privately instead:</p>
      <ul class="prose-list">
        <li>Email: <a class="prose-link" href="mailto:security@fastscript.dev">security@fastscript.dev</a></li>
        <li>Legal / commercial coordination: <a class="prose-link" href="mailto:legal@fastscript.dev">legal@fastscript.dev</a></li>
      </ul>
      <p class="body-copy">Acknowledgement target: <strong>within 48 hours</strong>. Initial triage target: <strong>within 5 business days</strong>. Critical fix target: <strong>typically within 14 days</strong>.</p>

      <h2 class="h2">Incident response</h2>
      <p class="body-copy">Our incident playbook is documented in <code class="ic">docs/INCIDENT_PLAYBOOK.md</code>. In short:</p>
      <div class="how-grid">
        <div class="how-cell">
          <p class="how-num">01 &mdash; Triage</p>
          <p class="how-title">Assess severity</p>
          <p class="how-copy">Validate the report, isolate the affected component, and classify impact and exploitability.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 &mdash; Patch</p>
          <p class="how-title">Fix &amp; verify</p>
          <p class="how-copy">Develop the patch privately, run the full QA gate, and verify deploy/runtime behavior before release.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 &mdash; Disclose</p>
          <p class="how-title">Publish advisory</p>
          <p class="how-copy">Release the fix, document impact, notify the reporter, and publish the final advisory once users can patch safely.</p>
        </div>
      </div>

      <h2 class="h2">Supply-chain and build security</h2>
      <p class="body-copy">FastScript keeps the runtime surface small and continuously checks build determinism, deploy adapters, and interop boundaries. SBOM generation and proof-pack publishing are part of the release flow.</p>

      <h2 class="h2">Security headers</h2>
      <p class="body-copy">Every FastScript deployment auto-sets the following headers via the built-in middleware:</p>
      <div class="code-block">
        <div class="code-block-head"><span class="code-block-file">default security headers</span></div>
        <div class="code-block-body">Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()</div>
      </div>

      <h2 class="h2">Commercial and AI restrictions</h2>
      <p class="body-copy">FastScript is source-available, not permissively open-source. Without prior written permission, you may not use repository contents to build a competing compiler, framework, hosted developer platform, or AI product, and you may not use the codebase to train or improve a commercial AI model.</p>

      <h2 class="h2">Recognition policy</h2>
      <p class="body-copy">FastScript does not currently run a public paid bug bounty program. Valid reports may be acknowledged in release notes or private correspondence at maintainer discretion.</p>
    </div>
  `;
}
