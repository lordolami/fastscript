const POSTS = {
  "why-we-built-fastscript": {
    title: "Why we built FastScript instead of using an existing framework",
    date: "April 14, 2026",
    lead: "Every major framework we evaluated forced a trade-off we were not willing to make - either speed, control, or deployment freedom. So we built our own.",
    body: `<h2>The problem with existing stacks</h2>
<p>When we started building production apps at Lakesbim, we kept running into the same issues. Next.js was fast to get started with, but build times ballooned as the app grew, the client bundle was enormous, and deploying to anything other than Vercel meant fighting the framework. Remix was more explicit, but it still shipped a significant runtime and required careful coordination between framework-level abstractions and actual product logic.</p>
<p>What we actually wanted was simple: keep normal application authoring, compile to JavaScript, and ship anywhere without the framework deciding our infrastructure.</p>
<h2>The .fs idea</h2>
<p>FastScript starts from a different premise. Instead of forcing developers into a separate authored-language identity, v3 treats <code>.fs</code> as a universal JS/TS container for the FastScript runtime. You can write normal JavaScript, TypeScript, JSX, and TSX directly in <code>.fs</code>, then opt into forms like <code>fn</code>, <code>state</code>, and <code>~</code> only when they improve readability.</p>
<p>This keeps the compiler small, fast, and predictable. It does not need to reinterpret your whole app - it needs to preserve familiar authoring while normalizing to standard JavaScript and generating source maps. esbuild handles bundling. The result is a proof-backed fast toolchain without a forced rewrite of developer habits.</p>
<h2>The runtime philosophy</h2>
<p>The current public proof pack reports a 2.71KB first-load JS gzip footprint. That is not an accident. We made a deliberate decision to shift as much work as possible to compile time. The client router does not do hydration in the React sense - it manages navigation, SSR state handoff, and HMR. Page modules handle their own rendering. There is no virtual DOM, no reconciliation, no diffing. Just compiled output.</p>
<h2>What we learned</h2>
<p>Building your own compiler and runtime is expensive. It requires formal specs, conformance tests, source map correctness, and careful stability guarantees. But the payoff is real: every FastScript app follows the same contract, ships the same way, and can be fully validated with one command.</p>`
  },
  "fs-language-v1-spec": {
    title: "Introducing the FastScript Language v1 specification",
    date: "April 13, 2026",
    lead: "The v1 spec locks the parser, diagnostic codes, formatter output, and compatibility guarantees for the first stable FastScript language baseline.",
    body: `<h2>What the spec covers</h2>
<p>The FastScript Language v1 Specification defines the complete grammar, desugaring semantics, static type system, diagnostic code ranges, and compatibility contract for the .fs format. It lives at <code>spec/LANGUAGE_V1_SPEC.md</code> and is the normative reference for all tooling decisions.</p>
<h2>The three declaration forms</h2>
<p>v1 adds exactly three declaration forms on top of ECMAScript module syntax:</p>
<pre>state name = expr    // desugars to: let name = expr
~name = expr         // desugars to: let name = expr
fn name(...) { }     // desugars to: function name(...) { }</pre>
<p>Type annotations are erased by the compiler and reported diagnostically so tooling can surface them without breaking the compile step.</p>
<h2>Stability guarantees</h2>
<p>Parser token spans are stable across patch releases. Diagnostic codes are stable across patch releases. Formatter output is idempotent - running the formatter twice produces the same result. Breaking any of these requires a major version bump and a migration guide.</p>`
  },
  "1-8kb-runtime": {
    title: "How FastScript keeps the client footprint at 2.71KB",
    date: "April 12, 2026",
    lead: "Most frameworks ship 80-140KB of JavaScript to the browser by default. Here is the architectural discipline behind FastScript's current 2.71KB first-load footprint.",
    body: `<h2>The key insight</h2>
<p>The overwhelming majority of framework client-side weight comes from the hydration engine: the virtual DOM reconciler, the fiber scheduler, the event delegation system, the module registry. FastScript does not have any of that. Pages are functions that return HTML strings. They run on the server during SSR, and on the client when the route changes.</p>
<h2>What is actually in the 2.71KB</h2>
<p>The client router handles three things: navigation interception (clicking <code>a href</code> tags), popstate (browser back/forward), and SSR state handoff (<code>window.__FASTSCRIPT_SSR</code>). It also connects the HMR EventSource in dev mode. The entire router is inlined as a string literal during the build step - no import, no bundling overhead.</p>
<h2>The trade-off</h2>
<p>You do not get React's fine-grained reactivity model. FastScript pages re-render the entire route on navigation. For most production apps, that is the right trade-off - it is simpler to reason about, simpler to test, and the performance is dominated by network and server latency anyway.</p>`
  },
  "deploy-adapter-architecture": {
    title: "One codebase, three deploy adapters: Node, Vercel, Cloudflare",
    date: "April 11, 2026",
    lead: "We generate hardened deploy artifacts for three platforms from a single .fs codebase without any per-platform logic branches in user code.",
    body: `<h2>How adapters work</h2>
<p>FastScript's deploy command runs <code>fastscript deploy --target [node|vercel|cloudflare]</code>. It takes the compiled <code>dist/</code> output and generates a platform-specific entry point and configuration file.</p>
<p>For Node, that is a PM2 ecosystem config and a start script. For Vercel, it is a <code>vercel.json</code> with function routes mapped from the manifest. For Cloudflare, it is a <code>wrangler.toml</code> and a thin Worker entry that delegates to the server runtime.</p>
<h2>What does not change</h2>
<p>Your product code. The <code>app/</code> directory is identical across all three targets. Routing, auth, jobs, middleware, storage - everything reads from <code>ctx</code> the same way regardless of where it is running. The adapter only touches the entry point and platform config, never your application logic.</p>
<h2>The Cloudflare case</h2>
<p>Cloudflare Workers has some constraints that required careful handling: no native Node.js APIs, limited memory, and sub-millisecond startup budget. The FastScript Cloudflare adapter wraps the server runtime in a fetch handler, polyfills the necessary Node globals via compatibility flags, and aggressively tree-shakes the bundle. The result is a ~19ms cold start on a typical FastScript app.</p>`
  }
};
export async function load(ctx) {
  const post = POSTS[ctx.params.slug];
  if (!post) return null;
  return {
    post
  };
}
export default function BlogPost({post}) {
  if (!post) {
    return `
      <div class="not-found">
        <p class="not-found-code">404</p>
        <h1 class="not-found-title">Post not found</h1>
        <p class="not-found-copy">This post does not exist or has been moved.</p>
        <div class="not-found-actions">
          <a class="btn btn-primary" href="/blog">Back to blog</a>
        </div>
      </div>
    `;
  }
  return `
    <article class="blog-post-wrap">
      <div class="post-header">
        <p class="post-date">${post.date}</p>
        <h1 class="post-title">${post.title}</h1>
        <p class="post-lead">${post.lead}</p>
      </div>
      <div class="post-body">${post.body}</div>
      <div class="post-footer">
        <a class="btn btn-ghost" href="/blog">&larr; All posts</a>
        <a class="btn btn-ghost" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </article>
  `;
}
