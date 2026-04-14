const FEATURES = [{
  id: "01",
  title: "Readable .fs syntax",
  text: "Keep JavaScript ergonomics, remove framework ceremony. State, routes, APIs, and jobs stay in one language.",
  chip: "state users = []"
}, {
  id: "02",
  title: "Sub-second build loops",
  text: "FastScript compiles route modules and runtime assets with aggressive caching and low cold-start overhead.",
  chip: "fastscript build"
}, {
  id: "03",
  title: "Deploy anywhere",
  text: "Generate Node, Vercel, and Cloudflare adapters from one command, with production headers and route fallbacks.",
  chip: "fastscript deploy --target vercel"
}, {
  id: "04",
  title: "Interop-first by design",
  text: "Import npm ESM, CJS, scoped packages, framework APIs, and migrate gradually without codebase rewrites.",
  chip: "import x from \"dual-mode-lib\""
}, {
  id: "05",
  title: "Typed route intelligence",
  text: "Route params and loader return shapes are inferred into generated route context types for safer app code.",
  chip: "FastScriptRouteContext"
}, {
  id: "06",
  title: "AI-friendly structure",
  text: "Consistent file conventions, explicit diagnostics, and constrained style rules make generated code far more reliable.",
  chip: "qa:all"
}];
export default function Home() {
  const featureCards = FEATURES.map(item => `
    <article class="feature-card">
      <span class="feature-index">${item.id}</span>
      <h3 class="feature-title">${item.title}</h3>
      <p class="feature-text">${item.text}</p>
      <span class="feature-chip">${item.chip}</span>
    </article>
  `).join("");
  return `
    <section class="home-hero">
      <div class="orb-wrap" aria-hidden="true">
        <span class="orb orb-a"></span>
        <span class="orb orb-b"></span>
        <span class="orb orb-c"></span>
      </div>

      <div class="hero-grid">
        <article class="hero-copy">
          <p class="hero-kicker">FastScript v0.1.5 - Production toolchain live</p>
          <h1 class="hero-title">Build full-stack products in <span class="hero-gradient">one readable language.</span></h1>
          <p class="hero-description">FastScript gives you pages, APIs, auth, queues, storage, and deploy adapters with JavaScript ecosystem compatibility. You ship faster without locking into one framework runtime.</p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="/learn">Start in 15 minutes</a>
            <a class="btn btn-outline" href="/docs">Read docs</a>
            <a class="btn btn-soft" href="/benchmarks">See proof pack</a>
          </div>

          <p class="hero-note"><b>Current quality gate:</b> interop matrix, deploy adapter tests, language smoke tests, conformance, and full QA are all green.</p>
        </article>

        <article>
          <div class="hero-terminal">
            <div class="terminal-header">
              <span class="terminal-dot terminal-dot-red"></span>
              <span class="terminal-dot terminal-dot-amber"></span>
              <span class="terminal-dot terminal-dot-green"></span>
            </div>
            <pre class="terminal-body"><span class="terminal-line">$ npm i -g fastscript-lang</span><span class="terminal-line">$ fastscript create my-app</span><span class="terminal-line">$ fastscript dev</span><span class="terminal-line">ready on http://localhost:4173<span class="terminal-cursor">|</span></span></pre>
          </div>

          <div class="hero-metrics">
            <article class="metric">
              <span class="metric-label">Runtime footprint</span>
              <strong class="metric-value">1.8 KB</strong>
              <p class="metric-delta">Minified core runtime</p>
            </article>
            <article class="metric">
              <span class="metric-label">Interop matrix</span>
              <strong class="metric-value">13 / 13</strong>
              <p class="metric-delta">Framework and npm scenarios</p>
            </article>
            <article class="metric">
              <span class="metric-label">Routes and APIs</span>
              <strong class="metric-value">13 + 5</strong>
              <p class="metric-delta">Current site in production mode</p>
            </article>
            <article class="metric">
              <span class="metric-label">Core QA</span>
              <strong class="metric-value">100%</strong>
              <p class="metric-delta">qa:all passing</p>
            </article>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Execution model</p>
        <h2 class="section-title">How FastScript flows from code to production.</h2>
      </header>
      <div class="home-flow">
        <article class="flow-item">
          <p class="flow-step">Step 01</p>
          <h3 class="flow-title">Write .fs source</h3>
          <p class="flow-text">Pages, API routes, middleware, migrations, and workers use the same readable syntax.</p>
        </article>
        <article class="flow-item">
          <p class="flow-step">Step 02</p>
          <h3 class="flow-title">Compile + typecheck</h3>
          <p class="flow-text">Route priority, loader data inference, diagnostics, and source maps are generated automatically.</p>
        </article>
        <article class="flow-item">
          <p class="flow-step">Step 03</p>
          <h3 class="flow-title">Deploy adapters</h3>
          <p class="flow-text">Node, Vercel, and Cloudflare outputs are generated with hardened headers, routing, and static caching policies.</p>
        </article>
      </div>
    </section>

    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Why teams switch</p>
        <h2 class="section-title">A stack that stays simple while scaling complexity.</h2>
      </header>
      <div class="feature-grid">${featureCards}</div>
    </section>

    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Code view</p>
        <h2 class="section-title">One language from UI to server handlers.</h2>
      </header>
      <div class="code-split">
        <article class="code-panel">
          <h3 class="code-title">Route + loader - app/pages/product/[slug].fs</h3>
          <pre class="code-block">export async function load(ctx) {
  const product = await ctx.db.get("products", ctx.params.slug)
  if (!product) return { notFound: true }
  return { product }
}

export default function ProductPage({ product }) {
  return '&lt;article&gt;&lt;h1&gt;\${product.name}&lt;/h1&gt;&lt;/article&gt;'
}</pre>
        </article>
        <article class="code-panel">
          <h3 class="code-title">API + validation - app/api/orders.fs</h3>
          <pre class="code-block">export const schemas = {
  POST: { email: "string", items: "array" }
}

export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST)
  const order = await ctx.db.insert("orders", body)
  await ctx.queue.enqueue("send-order-email", { orderId: order.id })
  return ctx.helpers.json({ ok: true, order }, 201)
}</pre>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="bench-grid">
        <article class="bench-card">
          <h3 class="bench-heading">Bundle profile</h3>
          <div class="bar-list">
            <div class="bar-row"><span class="bar-label">React baseline</span><div class="bar-track"><span class="bar-fill bar-fill-react"></span></div><span class="bar-value">142 KB</span></div>
            <div class="bar-row"><span class="bar-label">Next app shell</span><div class="bar-track"><span class="bar-fill bar-fill-next"></span></div><span class="bar-value">89 KB</span></div>
            <div class="bar-row"><span class="bar-label">FastScript runtime</span><div class="bar-track"><span class="bar-fill bar-fill-fastscript"></span></div><span class="bar-value">1.8 KB</span></div>
          </div>
        </article>

        <article class="bench-card">
          <h3 class="bench-heading">Build + test signal</h3>
          <p class="feature-text">The website itself runs through repo lock, lint and typecheck, docs indexing, interoperability reports, and backup verification.</p>
          <div class="bench-highlight">
            <p class="bench-highlight-title">Latest proof pack</p>
            <p class="bench-highlight-value">QA all green</p>
            <p class="bench-highlight-note">Generated from benchmark and interop artifacts</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="cta-band">
        <h2 class="cta-band-title">Ship your next startup in FastScript.</h2>
        <p class="cta-band-copy">Start with docs, fork the examples, run deploy adapters, and push production from one codebase.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/learn">Get started</a>
          <a class="btn btn-ghost" href="/examples">Open example projects</a>
          <a class="btn btn-outline" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">Star on GitHub</a>
        </div>
      </div>
    </section>
  `;
}
