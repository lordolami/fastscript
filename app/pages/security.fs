export default function Security() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Security-first platform</p>
      <h1 class="h1">FastScript security contract</h1>
      <p class="page-sub">FastScript v4.1 makes security part of the platform itself: runtime boundaries, explicit permissions policy, validator-backed readiness, and release discipline that is visible in tooling and proof apps.</p>
    </div>

    <div class="prose-section reveal">
      <h2 class="h2">What FastScript now enforces</h2>
      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Runtime scopes</p>
          <p class="docs-card-copy"><code class="ic">FS4201</code> keeps browser, server, and edge context violations visible instead of letting them hide behind ambiguous runtime behavior.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Explicit permissions policy</p>
          <p class="docs-card-copy">New apps now emit <code class="ic">fastscript.permissions.json</code> with the secure preset so production policy is declared, versioned, and validated.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Secret exposure checks</p>
          <p class="docs-card-copy">Security readiness now fails when obvious secret-like env values are referenced from browser/public page surfaces or clear API response paths.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Deployment baseline</p>
          <p class="docs-card-copy">Secure headers, env schema expectations, webhook secret paths, and session-sensitive config are treated as production readiness concerns, not afterthoughts.</p>
        </div>
      </div>

      <h2 class="h2">How the trust loop works</h2>
      <div class="how-grid">
        <div class="how-cell">
          <p class="how-num">01 - Declare</p>
          <p class="how-title">Policy and env are explicit</p>
          <p class="how-copy">Apps declare their runtime policy, env schema, and sensitive configuration instead of relying on tribal knowledge.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">02 - Validate</p>
          <p class="how-title">Security readiness is enforced</p>
          <p class="how-copy"><code class="ic">fastscript validate</code> now includes security readiness checks for permissions, secret exposure, env schema, and deploy baseline requirements.</p>
        </div>
        <div class="how-cell">
          <p class="how-num">03 - Prove</p>
          <p class="how-title">Reference apps stay honest</p>
          <p class="how-copy">The Team Dashboard SaaS and Agency Ops proof apps exercise auth, CSRF, webhook verification, and secure deploy expectations as living evidence.</p>
        </div>
      </div>

      <h2 class="h2">Platform protections</h2>
      <ul class="prose-list">
        <li>Runtime scope diagnostics for browser, server, and edge misuse</li>
        <li>Secure-by-default runtime permissions preset</li>
        <li>Security headers and CSP baseline via platform middleware</li>
        <li>CSRF/session protections for authenticated flows</li>
        <li>Webhook signature verification and replay protection primitives</li>
        <li>Rate limit, request quota, and abuse guard middleware</li>
        <li>Tooling-generated security readiness reporting</li>
      </ul>

      <h2 class="h2">Supported versions</h2>
      <div class="compare-table compare-table-3">
        <div class="compare-header">
          <div class="compare-col-head">Version</div>
          <div class="compare-col-head is-ours">Security fixes</div>
          <div class="compare-col-head">Status</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">v4.1.x</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Yes</div>
          <div class="compare-cell">Active</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">v4.0.x</div>
          <div class="compare-cell"><span class="partial">~</span> Limited</div>
          <div class="compare-cell">Previous stable line</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">v0.x-v3.x</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> No</div>
          <div class="compare-cell">Archived</div>
        </div>
      </div>

      <h2 class="h2">Private disclosure only</h2>
      <p class="body-copy">If you discover a vulnerability, do not open a public issue or advisory before remediation. Report privately instead:</p>
      <ul class="prose-list">
        <li>Email: <a class="prose-link" href="mailto:security@fastscript.dev">security@fastscript.dev</a></li>
        <li>Legal / commercial coordination: <a class="prose-link" href="mailto:legal@fastscript.dev">legal@fastscript.dev</a></li>
      </ul>
      <p class="body-copy">Acknowledgement target: <strong>within 48 hours</strong>. Initial triage target: <strong>within 5 business days</strong>. Critical fix target: <strong>typically within 14 days</strong>.</p>

      <h2 class="h2">Threat model note</h2>
      <p class="body-copy">FastScript now publishes a public security architecture overview and keeps sensitive operational threat detail private. That split is deliberate: teams need to understand the platform contract, while exploit-sensitive implementation notes should stay out of the public repo.</p>

      <h2 class="h2">Commercial and AI restrictions</h2>
      <p class="body-copy">FastScript is source-available, not permissively open-source. Without prior written permission, you may not use repository contents to build a competing compiler, language runtime, hosted developer platform, or AI product, and you may not use the codebase to train or improve a commercial AI model.</p>
    </div>
  `;
}
