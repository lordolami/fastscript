export default function Security() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Trust &amp; Safety</p>
      <h1 class="h1">Security Policy</h1>
      <p class="page-sub">How FastScript handles vulnerability disclosures, incident response, and supply-chain security.</p>
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

      <h2 class="h2">Responsible disclosure</h2>
      <p class="body-copy">If you discover a vulnerability, please <strong>do not open a public GitHub issue</strong>. Instead, use one of the following private channels:</p>
      <ul class="prose-list">
        <li>Email: <a class="prose-link" href="mailto:security@fastscript.dev">security@fastscript.dev</a></li>
        <li>GitHub private security advisory: <a class="prose-link" href="https://github.com/lordolami/fastscript/security/advisories/new" target="_blank" rel="noreferrer">Report a vulnerability</a></li>
      </ul>
      <p class="body-copy">We will acknowledge your report within <strong>48 hours</strong> and aim to release a patch within <strong>14 days</strong> for critical issues.</p>

      <h2 class="h2">Incident response</h2>
      <p class="body-copy">Our incident playbook is documented in <code class="ic">docs/INCIDENT_PLAYBOOK.md</code>. In short:</p>
      <div class="how-grid">
        <div class="how-cell">
          <p class="how-num">01 &mdash; Triage</p>
          <p class="how-title">Assess severity</p>
          <p class="how-copy">Classify using CVSS 3.1. P0 critical issues trigger immediate response and patch within 24h.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 &mdash; Patch</p>
          <p class="how-title">Fix &amp; verify</p>
          <p class="how-copy">Develop fix on private branch. Run QA gate. Request CVE from GitHub if applicable.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 &mdash; Disclose</p>
          <p class="how-title">Publish advisory</p>
          <p class="how-copy">Release patched version, publish security advisory, notify reporter, update CHANGELOG.</p>
        </div>
      </div>

      <h2 class="h2">Supply-chain &amp; SBOM</h2>
      <p class="body-copy">FastScript minimises third-party dependencies. A software bill of materials (SBOM) in SPDX format is generated on each release and attached to the GitHub release. The production runtime has <strong>zero npm dependencies at runtime</strong> — only devDependencies used at build time.</p>

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

      <h2 class="h2">Bug bounty</h2>
      <p class="body-copy">FastScript does not currently run a paid bug bounty programme. We do recognise researchers in our security advisories and, for critical findings, may offer acknowledgment and swag at maintainer discretion.</p>
    </div>
  `;
}
