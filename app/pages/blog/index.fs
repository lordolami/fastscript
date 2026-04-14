const POSTS = [{
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
  title: "How we got the client runtime down to 1.8KB",
  date: "April 12, 2026",
  excerpt: "Most frameworks ship 80-140KB of JavaScript to the browser by default. Here is the architectural decision that made 1.8KB possible."
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
        <p class="lead">Technical deep-dives on language design, runtime architecture, performance, and the thinking behind every major decision.</p>
      </header>

      <div class="blog-grid">${cards}</div>
    </section>
  `;
}
