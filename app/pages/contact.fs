export default function Contact() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Get in touch</p>
      <h1 class="h1">Contact and support</h1>
      <p class="page-sub">Use the right channel for questions, bugs, security concerns, and licensing. FastScript support stays tied to the active platform line and the public proof surfaces.</p>
    </div>

    <div class="contact-grid reveal">
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#128172;</div>
        <p class="contact-card-title">GitHub Discussions</p>
        <p class="contact-card-copy">Best for product questions, adoption help, and platform direction conversations.</p>
        <a class="btn btn-secondary btn-sm" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Open discussions &rarr;</a>
      </div>
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#128030;</div>
        <p class="contact-card-title">Bug reports</p>
        <p class="contact-card-copy">File a GitHub issue with a minimal reproduction and your FastScript version when something breaks the platform contract.</p>
        <a class="btn btn-secondary btn-sm" href="https://github.com/lordolami/fastscript/issues/new" target="_blank" rel="noreferrer">File an issue &rarr;</a>
      </div>
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#127926;</div>
        <p class="contact-card-title">Discord</p>
        <p class="contact-card-copy">Live chat for quick questions, community help, and shipping momentum.</p>
        <a class="btn btn-secondary btn-sm" href="https://discord.gg/fastscript" target="_blank" rel="noreferrer">Join Discord &rarr;</a>
      </div>
    </div>

    <section class="reveal">
      <header class="sec-header">
        <p class="kicker">Direct contact</p>
        <h2 class="h2">Email addresses</h2>
      </header>
      <div class="list-items">
        <div class="list-item"><div class="list-item-meta"><p class="list-item-version">Security</p></div><div class="list-item-body"><p class="list-item-copy"><a class="prose-link" href="mailto:security@fastscript.dev">security@fastscript.dev</a> - vulnerability disclosures only. See the <a class="prose-link" href="/security">security policy</a>.</p></div></div>
        <div class="list-item"><div class="list-item-meta"><p class="list-item-version">Privacy</p></div><div class="list-item-body"><p class="list-item-copy"><a class="prose-link" href="mailto:privacy@fastscript.dev">privacy@fastscript.dev</a> - privacy and data requests.</p></div></div>
        <div class="list-item"><div class="list-item-meta"><p class="list-item-version">Legal</p></div><div class="list-item-body"><p class="list-item-copy"><a class="prose-link" href="mailto:legal@fastscript.dev">legal@fastscript.dev</a> - licensing, trademark, and commercial platform questions.</p></div></div>
        <div class="list-item"><div class="list-item-meta"><p class="list-item-version">Press</p></div><div class="list-item-body"><p class="list-item-copy"><a class="prose-link" href="mailto:press@fastscript.dev">press@fastscript.dev</a> - media and partnership enquiries.</p></div></div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Support policy</h2>
        <p class="cta-copy">Bug reports against the latest stable line, v4.x, receive priority. Legacy lines remain available for historical reference, but the current platform contract lives in the active docs, support matrix, proof apps, and release artifacts.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/docs">Browse docs</a>
          <a class="btn btn-secondary btn-lg" href="/learn">Open /learn</a>
        </div>
      </div>
    </section>
  `;
}
