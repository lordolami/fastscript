const POSTS = {
  "fastscript-v0-1-5-platform-hardening": {
    title: "FastScript v0.1.5: Platform hardening without losing speed",
    tag: "Release",
    date: "April 2026",
    read: "8 min",
    intro: "v0.1.5 focused on removing sharp edges: better editor confidence, stronger deploy defaults, and wider interop guarantees.",
    sections: [{
      title: "Editor confidence first",
      body: "The VS Code toolkit now resolves imports, exposes references, shows quick fixes, and links directly to relative modules. Syntax scopes were expanded to make template tags and events readable at a glance."
    }, {
      title: "Deploy adapters as production artifacts",
      body: "Vercel and Cloudflare outputs now include stronger caching/security defaults and explicit env templates. Adapter generation is tested as part of the core suite."
    }, {
      title: "Compatibility surface expanded",
      body: "Interop matrix now validates additional framework shims and package shapes, including scoped subpaths and dual-mode exports."
    }],
    code: "npm run qa:all\nfastscript deploy --target vercel"
  },
  "why-route-priority-matters": {
    title: "Why route priority logic matters in real products",
    tag: "Routing",
    date: "April 2026",
    read: "7 min",
    intro: "When static and dynamic routes overlap, deterministic matching rules decide whether your app is reliable or brittle.",
    sections: [{
      title: "Specific must outrank generic",
      body: "A static path like /docs/reference should always win over /docs/:slug and /docs/:slug*. FastScript now enforces that scoring in build and runtime layers."
    }, {
      title: "Same logic everywhere",
      body: "The same priority model is used in node runtime, generated Cloudflare worker, and client router hydration runtime so behavior stays consistent."
    }, {
      title: "Type-aware follow-through",
      body: "Route metadata feeds type generation, so route contracts and loader data remain aligned with matching behavior."
    }],
    code: "export type FastScriptRouteContext<P> = {\n  path: P\n  params: FastScriptRouteParams[P]\n  data: FastScriptRouteLoaderData[P]\n}"
  },
  "interop-without-lock-in": {
    title: "Interop without lock-in: the FastScript compatibility stance",
    tag: "Interop",
    date: "April 2026",
    read: "9 min",
    intro: "A language only wins adoption if teams can move incrementally. FastScript is designed for migration by composition, not rewrites.",
    sections: [{
      title: "Existing libraries stay valid",
      body: "FastScript consumes npm modules from ESM, CJS, scoped packages, and subpath exports, reducing migration fear."
    }, {
      title: "Proof over promises",
      body: "Compatibility is verified through a matrix that runs in CI and produces reports used by proof-pack publishing."
    }, {
      title: "Own the source, keep optionality",
      body: "You can choose where .fs gives you leverage while preserving the ability to operate inside the JavaScript ecosystem."
    }],
    code: "npm run test:interop-matrix\nnpm run interop:report"
  }
};
export async function load(ctx) {
  const slug = String(ctx.params.slug || "");
  const post = POSTS[slug] || null;
  const related = Object.keys(POSTS).filter(key => key !== slug).slice(0, 2).map(key => ({
    slug: key,
    title: POSTS[key].title
  }));
  return {
    post,
    slug,
    related
  };
}
export default function BlogPost({post, slug, related}) {
  if (!post) {
    return `
      <section class="section not-found">
        <p class="not-code">404</p>
        <h1 class="not-title">No article for slug: ${slug}</h1>
        <p class="not-copy">This post does not exist yet.</p>
        <div class="not-links">
          <a class="btn btn-primary" href="/blog">Back to blog</a>
          <a class="btn btn-ghost" href="/">Home</a>
        </div>
      </section>
    `;
  }
  return `
    <article class="section blog-post">
      <header class="section-head">
        <p class="section-kicker">${post.tag}</p>
        <h1 class="section-title">${post.title}</h1>
        <div class="blog-post-meta">
          <span class="blog-meta">${post.date}</span>
          <span class="blog-meta">${post.read}</span>
          <span class="blog-meta">/blog/${slug}</span>
        </div>
        <p class="section-copy">${post.intro}</p>
      </header>

      <section class="blog-post-content">
        ${post.sections.map(section => `<section><h2>${section.title}</h2><p>${section.body}</p></section>`).join("")}
        <pre>${post.code}</pre>
      </section>

      <section class="section">
        <header class="section-head">
          <p class="section-kicker">Related</p>
        </header>
        <div class="docs-grid">
          ${related.map(item => `<article class="docs-card"><h3 class="docs-title">${item.title}</h3><a class="docs-arrow" href="/blog/${item.slug}">Read article -></a></article>`).join("")}
        </div>
      </section>
    </article>
  `;
}
