export default function Roadmap() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">What&rsquo;s coming</p>
      <h1 class="h1">Roadmap</h1>
      <p class="page-sub">The FastScript public roadmap across web, server, mobile, desktop, tooling, and ecosystem work. Items move from Planned &rarr; In Progress &rarr; Done as development advances.</p>
    </div>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#9679; In Progress &mdash; post-v3.0</h2>
      <div class="roadmap-list">
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">VS Code Extension</p>
            <p class="roadmap-copy">Syntax highlighting, diagnostics, hover types, and go-to-definition for <code class="ic">.fs</code> files. LSP-backed.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Streaming SSR</p>
            <p class="roadmap-copy">HTTP streaming responses with progressive hydration. Reduces TTFB on large pages.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Postgres Driver GA</p>
            <p class="roadmap-copy">Full <code class="ic">ctx.db</code> parity for Postgres alongside the current file-based driver. Migrations, seeds, and query builder included.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Playground Shareable URLs</p>
            <p class="roadmap-copy">Persist playground state to a short URL for sharing runnable <code class="ic">.fs</code> snippets in issues, docs, and blog posts.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">V3 site and docs hardening</p>
            <p class="roadmap-copy">Keep every public page, docs route, benchmark claim, and search result aligned to the v3 compatibility and speed story without stale version drift.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-active">Active</div>
          <div class="roadmap-body">
            <p class="roadmap-title">v3 launch packaging</p>
            <p class="roadmap-copy">Ship the npm package, GitHub release surfaces, proof pack, and release notes as one coherent public launch instead of a docs-only refresh.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#9675; Planned &mdash; next release wave</h2>
      <div class="roadmap-list">
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Edge Middleware Runtime</p>
            <p class="roadmap-copy">Run middleware at the CDN edge with sub-millisecond latency. Cloudflare Workers first, Vercel Edge next.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Incremental Static Regen (ISR)</p>
            <p class="roadmap-copy">Tag-based cache invalidation with background revalidation. <code class="ic">export const revalidate = 60</code> per route.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Type-safe DB Queries</p>
            <p class="roadmap-copy">Auto-inferred return types for <code class="ic">ctx.db.get()</code>, <code class="ic">ctx.db.list()</code>, and <code class="ic">ctx.db.insert()</code> based on your schema files.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">FastScript AI coding assistant</p>
            <p class="roadmap-copy">Agentic coding assistant built on the main FastScript language/runtime, optimized for high-accuracy code generation, fast codebase deciphering, and full-stack execution discipline.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Plugin Marketplace</p>
            <p class="roadmap-copy">Searchable registry of community plugins for auth providers, storage adapters, and analytics.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">AI code reliability mode</p>
            <p class="roadmap-copy">Strict diagnostic mode designed for AI-generated <code class="ic">.fs</code> output. Catches hallucination patterns at compile time and feeds the next assistant product with cleaner verification loops.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">React Native / Expo mobile target</p>
            <p class="roadmap-copy">Compile FastScript modules to a mobile target so teams can use the same language across web, server, and mobile apps without learning a second stack.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Shared app APIs across web + mobile</p>
            <p class="roadmap-copy">Unify storage, fetch, validation, auth/session contracts, and project templates so one FastScript mental model powers both browser and handset apps.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#9675; Next platform wave</h2>
      <div class="roadmap-list">
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">FastScript private language intelligence</p>
            <p class="roadmap-copy">Turn the protected language/runtime core into a compounding platform advantage across tooling, assistant workflows, eval loops, and proprietary developer infrastructure.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Desktop target</p>
            <p class="roadmap-copy">FastScript desktop apps through an Electron-first target, with Tauri-style lightweight packaging evaluated next. Goal: one language for web apps and desktop software.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Package/library mode</p>
            <p class="roadmap-copy">Publish reusable FastScript libraries with clean <code class="ic">.fs</code> to <code class="ic">.js</code>/<code class="ic">.ts</code> outputs, typed entrypoints, and ecosystem-friendly packaging.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Broader interoperability matrix</p>
            <p class="roadmap-copy">Expand compatibility proof beyond the current matrix to more real-world runtimes, SDKs, database clients, worker runtimes, and deployment surfaces.</p>
          </div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-planned">Planned</div>
          <div class="roadmap-body">
            <p class="roadmap-title">Runtime adapters for "write anything"</p>
            <p class="roadmap-copy">The long-range goal: learn FastScript once and use it for websites, APIs, workers, mobile apps, desktop software, and shared libraries through target-specific adapters, not separate languages.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#10003; Shipped</h2>
      <div class="roadmap-list roadmap-done">
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">File-based routing with dynamic params</p></div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">.fs compiler &rarr; ESM output</p></div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">Node.js, Vercel, Cloudflare deploy adapters</p></div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">Auth + session + OAuth built-in</p></div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">Job queue + distributed workers</p></div>
        </div>
        <div class="roadmap-item">
          <div class="roadmap-status status-done">Done</div>
          <div class="roadmap-body"><p class="roadmap-title">npm run qa:all &mdash; full quality gate</p></div>
        </div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Have a feature request?</h2>
        <p class="cta-copy">Open a GitHub Discussion or upvote existing items. We read every request.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Open a discussion</a>
          <a class="btn btn-secondary btn-lg" href="https://github.com/lordolami/fastscript/issues" target="_blank" rel="noreferrer">Browse issues</a>
        </div>
      </div>
    </section>
  `;
}
