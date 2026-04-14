export default function Terms() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Legal</p>
      <h1 class="h1">Terms of Use</h1>
      <p class="page-sub">Last updated: April 2026. By using this website or the FastScript CLI, you agree to these terms.</p>
    </div>

    <div class="prose-section reveal">
      <h2 class="h2">Acceptance</h2>
      <p class="body-copy">These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the FastScript website (fastscript.dev), documentation, playground, and CLI toolchain (collectively, the &ldquo;Service&rdquo;). By accessing the Service, you agree to be bound by these Terms.</p>

      <h2 class="h2">Use of the service</h2>
      <p class="body-copy">You may use the Service for lawful purposes only. You agree not to:</p>
      <ul class="prose-list">
        <li>Reverse engineer, decompile, or attempt to extract source code where not already publicly available.</li>
        <li>Use the Service in any manner that could impair, disable, or overburden our infrastructure.</li>
        <li>Use automated tools to scrape the playground or documentation at a rate that degrades service for others.</li>
        <li>Publish false, misleading, or defamatory content through our community channels.</li>
      </ul>

      <h2 class="h2">Open-source software</h2>
      <p class="body-copy">The FastScript compiler, CLI, and runtime are released under the <a class="prose-link" href="/license">MIT License</a>. The MIT License governs your use of those software artefacts; these Terms govern your use of this website and associated hosted services.</p>

      <h2 class="h2">Playground &amp; hosted services</h2>
      <p class="body-copy">The in-browser playground executes code entirely in your browser with no server-side execution. We do not store or review playground code unless you explicitly share a permalink. We reserve the right to disable any shared playground link that violates these Terms.</p>

      <h2 class="h2">Intellectual property</h2>
      <p class="body-copy">The FastScript name, logo, and marketing copy are the property of Lakesbim Infotechnology. You may reference FastScript by name for educational, review, or compatibility purposes without prior permission. Commercial use of the logo or wordmark requires written consent.</p>

      <h2 class="h2">Disclaimer of warranties</h2>
      <p class="body-copy">The Service is provided &ldquo;as is&rdquo; without warranty of any kind. We make no guarantee of uptime, data integrity, or fitness for a particular purpose.</p>

      <h2 class="h2">Limitation of liability</h2>
      <p class="body-copy">Lakesbim Infotechnology shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, even if advised of the possibility of such damages.</p>

      <h2 class="h2">Changes to these terms</h2>
      <p class="body-copy">We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms. Significant changes will be announced in the <a class="prose-link" href="/changelog">Changelog</a>.</p>

      <h2 class="h2">Contact</h2>
      <p class="body-copy">Questions: <a class="prose-link" href="mailto:legal@fastscript.dev">legal@fastscript.dev</a></p>
    </div>
  `;
}
