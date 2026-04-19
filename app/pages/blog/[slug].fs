const POSTS = {
  "fastscript-v4-1-security-first-platform-release": {
    title: "FastScript v4.1: the security-first platform release",
    date: "April 17, 2026",
    lead: "FastScript v4.1 turns security into platform behavior. The release adds secure-by-default scaffolds, explicit permissions policy, validator-backed security readiness, and proof apps that visibly exercise the trust contract.",
    body: `<h2>Security is now part of the product contract</h2>
<p>FastScript already had security primitives. What v4.1 changes is the contract around them. Runtime boundaries, explicit permissions policy, CSRF/session protections, webhook verification, and deploy-ready security baseline are now public platform behavior instead of buried utilities.</p>
<h2>Scaffolds now start from a secure posture</h2>
<p>New apps emit <code>fastscript.permissions.json</code> with the secure preset, plus an explicit env schema for session, webhook, and request-boundary configuration. That means security starts as versioned code and validator input, not as a vague reminder left for later.</p>
<h2>The validator now proves readiness</h2>
<p>FastScript now ships a security-readiness pass that fails on missing policy, non-secure preset use, obvious secret exposure, missing env-schema keys, and missing deploy-header baseline. The platform is no longer just saying “please be careful.” It is checking.</p>
<h2>Reference apps have to earn the claim</h2>
<p>The Team Dashboard SaaS and Agency Ops proof apps now exercise authenticated flows, CSRF/session behavior, signed webhook verification, and secure deploy expectations. That matters because trust is stronger when it shows up in working product-shaped examples, not only in documentation.</p>`
  },
  "why-fastscript-chooses-validator-backed-trust": {
    title: "Why FastScript chooses validator-backed trust over obscurity",
    date: "April 17, 2026",
    lead: "Security gets stronger when dangerous mistakes become visible early. FastScript chooses explicit runtime boundaries, permissions, and readiness checks instead of hoping obscurity will save the system.",
    body: `<h2>Obscurity is not the strategy</h2>
<p>It is tempting to imagine security as hidden conventions, bizarre code shapes, or platform complexity that attackers will not understand. That is not the FastScript position. Obscurity can slow somebody down a little, but it also slows your own team, weakens audits, and makes risk harder to reason about.</p>
<h2>Validator-backed trust scales better</h2>
<p>FastScript is betting on a different model: make the dangerous boundary visible, enforce it in tooling, and keep that check inside the same platform that builds and deploys the app. Runtime scopes, explicit permissions policy, CSRF/session protections, and secret-exposure diagnostics are all examples of that approach.</p>
<h2>Secure-by-default beats secure-later</h2>
<p>Many stacks effectively tell teams to get the app working first and harden it later. FastScript now moves security earlier. New scaffolds emit the secure preset, proof apps exercise the trust contract, and release gates fail when the baseline is missing.</p>
<h2>The result is a calmer shipping story</h2>
<p>FastScript is not claiming perfection. It is claiming something more useful: the platform is structurally harder to misuse, and it produces evidence when important security assumptions are missing. That is the kind of trust that compounds over time.</p>`
  },
  "why-were-training-ai-on-a-structured-language": {
    title: "Why we're training AI on a structured language, not ecosystem chaos",
    date: "April 17, 2026",
    lead: "General coding models are trained across the entire public software mess. FastScript gives us a tighter surface: ordinary TypeScript authoring for humans, and a controlled runtime and language boundary for machines.",
    body: `<h2>The internet teaches chaos</h2>
<p>General coding systems are trained on billions of lines of code written by humans across every possible style, framework habit, and architectural contradiction. That breadth is useful, but it also bakes ecosystem chaos into the model's instincts. The model learns how to survive disorder, not how to operate inside a clean software substrate.</p>
<h2>FastScript keeps the human contract familiar</h2>
<p>The point of FastScript is not to force developers into a weird authored language. The human-facing contract is still ordinary JavaScript and TypeScript inside <code>.fs</code>. That means teams keep their normal coding habits while the platform owns the surrounding runtime, validation, deploy, and proof boundaries.</p>
<h2>Why the owned layer matters</h2>
<p>Underneath that ordinary authoring model, FastScript still owns its language and runtime surface. That gives us a platform that is easier to validate, easier to diagnose, and easier to align around machine-readable behavior. We can evolve the substrate and the model together instead of depending on ecosystems we do not control.</p>
<h2>This is the real training advantage</h2>
<p>We are not claiming that public-code training stops mattering. It does. The advantage is that FastScript gives the model a cleaner system to think through once it is working inside our stack. That means fewer ambiguous runtime paths, tighter validator loops, and a better chance of turning model work into repeatable product behavior instead of one-off code generation.</p>`
  },
  "the-validator-ships-certainty": {
    title: "The validator: why FastScript ships certainty, not probability",
    date: "April 17, 2026",
    lead: "Model output is probabilistic. Product delivery cannot be. FastScript is built so generation feeds into validation, repair, proof, and release discipline before it is allowed to become public truth.",
    body: `<h2>Generation is not the product</h2>
<p>Most AI coding stories still stop at generation. The model emits code, everybody feels excited for a minute, and then humans spend the next stretch figuring out whether the result actually works. That is fine for demos, but it is not enough for a serious platform.</p>
<h2>Validation is a first-class system boundary</h2>
<p>FastScript keeps <code>validate</code>, compatibility governance, proof generation, smoke testing, and release gates as first-class surfaces. That means the platform can treat problems as structured failures instead of shrugging and hoping the output was good enough. It also means a future AI layer has a real repair loop to work with.</p>
<h2>Why investors and teams should care</h2>
<p>The difference between probability and certainty is what separates a clever demo from a company. Teams need to know whether a release is coherent, whether the support matrix is current, whether the deploy artifact matches the docs, and whether the product contract is still true after a patch. FastScript is opinionated about those checks because software factories without validation just move risk around.</p>
<h2>The long-term compounding effect</h2>
<p>Once validation and proof are part of the stack itself, every future model and workflow benefits. The platform does not need to start from raw code generation each time. It can generate, inspect, repair, and ship against known constraints. That is how you turn AI from a novelty into an operating advantage.</p>`
  },
  "why-we-built-fastscript": {
    title: "Why we built FastScript instead of using an existing framework",
    date: "April 14, 2026",
    lead: "Every major framework we evaluated forced a trade-off we were not willing to make - either speed, control, or deployment freedom. So we built our own.",
    body: `<h2>The problem with existing stacks</h2>
<p>When we started building production apps at Lakesbim, we kept running into the same issues. Next.js was fast to get started with, but build times ballooned as the app grew, the client bundle was enormous, and deploying to anything other than Vercel meant fighting the framework. Remix was more explicit, but it still shipped a significant runtime and required careful coordination between framework-level abstractions and actual product logic.</p>
<p>What we actually wanted was simple: keep normal application authoring, compile to JavaScript, and ship anywhere without the framework deciding our infrastructure.</p>
<h2>The .fs idea</h2>
<p>FastScript starts from a different premise. Instead of forcing developers into a separate authored-language identity, the current 5.x line treats <code>.fs</code> as a universal JS/TS container for the FastScript runtime. You can write normal JavaScript, TypeScript, JSX, and TSX directly in <code>.fs</code>, then opt into forms like <code>fn</code>, <code>state</code>, and <code>~</code> only when they improve readability.</p>
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
