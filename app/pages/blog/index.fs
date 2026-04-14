const POSTS = [{
  slug: "fastscript-v0-1-5-platform-hardening",
  title: "FastScript v0.1.5: Platform hardening without losing speed",
  excerpt: "How we shipped LSP intelligence, deploy adapter reliability, and interop expansion in one integrated release.",
  date: "April 2026",
  tag: "Release",
  read: "8 min"
}, {
  slug: "why-route-priority-matters",
  title: "Why route priority logic matters in real products",
  excerpt: "Static and dynamic route conflicts are subtle. Here is the scoring strategy FastScript now uses across runtimes.",
  date: "April 2026",
  tag: "Routing",
  read: "7 min"
}, {
  slug: "interop-without-lock-in",
  title: "Interop without lock-in: the FastScript compatibility stance",
  excerpt: "Use npm and existing modules while migrating incrementally to .fs where it brings leverage.",
  date: "April 2026",
  tag: "Interop",
  read: "9 min"
}];
export default function BlogIndex() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Blog</p>
        <h1 class="section-title">Engineering notes from the FastScript build lane.</h1>
        <p class="section-copy">Release debriefs, architecture decisions, and production lessons from building a language + runtime platform that stays practical.</p>
      </header>

      <div class="blog-list">
        ${POSTS.map(post => `
          <article class="blog-item">
            <span class="blog-meta">${post.tag} - ${post.date} - ${post.read}</span>
            <h2 class="blog-title"><a href="/blog/${post.slug}">${post.title}</a></h2>
            <p class="blog-excerpt">${post.excerpt}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
