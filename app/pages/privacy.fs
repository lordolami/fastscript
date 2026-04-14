export default function Privacy() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Legal</p>
      <h1 class="h1">Privacy Policy</h1>
      <p class="page-sub">Last updated: April 2026. This policy covers fastscript.dev and the FastScript CLI.</p>
    </div>

    <div class="prose-section reveal">
      <h2 class="h2">What we collect</h2>
      <div class="compare-table compare-table-3">
        <div class="compare-header">
          <div class="compare-col-head">Data</div>
          <div class="compare-col-head is-ours">Collected?</div>
          <div class="compare-col-head">Purpose</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Page views (aggregated)</div>
          <div class="compare-cell is-ours"><span class="check">&#10003;</span> Yes</div>
          <div class="compare-cell">Understand which docs pages are most useful</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">IP address</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> No</div>
          <div class="compare-cell">&mdash;</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Cookies / tracking pixels</div>
          <div class="compare-cell"><span class="cross">&#10007;</span> No</div>
          <div class="compare-cell">&mdash;</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">CLI install telemetry</div>
          <div class="compare-cell"><span class="partial">~</span> Opt-in only</div>
          <div class="compare-cell">Anonymous error rates to improve compiler</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Email (newsletter)</div>
          <div class="compare-cell"><span class="partial">~</span> If you subscribe</div>
          <div class="compare-cell">Send release notes. Unsubscribe any time.</div>
        </div>
      </div>

      <h2 class="h2">Analytics</h2>
      <p class="body-copy">This site uses privacy-friendly, cookieless analytics. No personal data is stored. No cross-site tracking. Aggregate stats only (page URL, referrer domain, device type).</p>

      <h2 class="h2">CLI telemetry</h2>
      <p class="body-copy">The FastScript CLI does <strong>not</strong> phone home by default. If you opt in to telemetry (via <code class="ic">fastscript config --telemetry=true</code>), only the following is sent: FastScript version, Node.js major version, OS type, and anonymised error codes. No file contents, paths, or environment variables are ever transmitted.</p>

      <h2 class="h2">Data retention</h2>
      <p class="body-copy">Aggregate analytics are retained for 12 months, then purged. Newsletter emails are stored until you unsubscribe, at which point they are permanently deleted within 30 days.</p>

      <h2 class="h2">Your rights</h2>
      <p class="body-copy">Depending on your jurisdiction, you may have the right to access, correct, or delete data we hold about you. Contact us at <a class="prose-link" href="mailto:privacy@fastscript.dev">privacy@fastscript.dev</a> to exercise any of these rights.</p>

      <h2 class="h2">Contact</h2>
      <p class="body-copy">Questions about this policy: <a class="prose-link" href="mailto:privacy@fastscript.dev">privacy@fastscript.dev</a></p>
    </div>
  `;
}
