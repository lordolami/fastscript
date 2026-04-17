const POSTS = [{
  slug: "why-were-training-ai-on-a-structured-language",
  title: "Why we're training AI on a structured language, not ecosystem chaos",
  date: "April 17, 2026",
  excerpt: "General coding models learn from messy public code. FastScript gives us a controlled language and runtime surface that stays simpler for machine reasoning, validation, and future training loops."
}, {
  slug: "why-fastscript-studio-replaces-agency-sprawl",
  title: "Why FastScript Studio is pointed at agency replacement",
  date: "April 17, 2026",
  excerpt: "Most agencies stitch together people, frameworks, QA rituals, and deploy handoffs. The Studio thesis is that one controlled FastScript stack can collapse that service chain into a software factory."
}, {
  slug: "the-validator-ships-certainty",
  title: "The validator: why FastScript ships certainty, not probability",
  date: "April 17, 2026",
  excerpt: "Generation alone is not enough. FastScript is built around validate, inspect, repair, and prove, so the public release story stays tied to artifacts instead of wishful output."
}, {
  slug: "why-we-built-fastscript",
  title: "Why we built FastScript instead of using an existing framework",
  date: "April 14, 2026",
  excerpt: "Every major framework we evaluated forced a trade-off we were not willing to make: speed, control, or deployment freedom. So we built our own."
}, {
  slug: "fs-language-v1-spec",
  title: "Introducing the FastScript Language v1 specification",
  date: "April 13, 2026",
  excerpt: "The v1 spec locks the parser, diagnostic codes, formatter output, and compatibility guarantees for the first stable FastScript language baseline."
}, {
  slug: "1-8kb-runtime",
  title: "How FastScript keeps the client footprint at 2.71KB",
  date: "April 12, 2026",
  excerpt: "Most frameworks ship 80-140KB of JavaScript to the browser by default. Here is the architecture and proof discipline behind FastScript’s current 2.71KB first-load footprint."
}, {
  slug: "deploy-adapter-architecture",
  title: "One codebase, three deploy adapters: Node, Vercel, Cloudflare",
  date: "April 11, 2026",
  excerpt: "We generate hardened deploy artifacts for three platforms from a single .fs codebase without any per-platform logic branches in user code."
}];
export default function BlogIndex() {
  const cards = POSTS.map(p => `
    <a class="blog-card" href="/blog/${p.slug}">
      <p class="blog-card-date">${p.date}</p>
      <p class="blog-card-title">${p.title}</p>
      <p class="blog-card-excerpt">${p.excerpt}</p>
    </a>
  `).join("");
  return `
    <section class="blog-index">
      <header class="sec-header">
        <p class="kicker">Blog</p>
        <h1 class="h1">From the FastScript team.</h1>
        <p class="lead">Founding notes, runtime architecture, validator discipline, AI-training strategy, and the product decisions shaping FastScript into a real platform company.</p>
      </header>

      <div class="blog-grid">${cards}</div>
    </section>
  `;
}
