const SCHOOL_STORAGE_KEY = "fs-school-v2";
const LEGACY_SCHOOL_STORAGE_KEY = "fs-school-v1";
const SCHOOL_STATE_VERSION = 2;

function lesson(config) {
  return {
    minutes: 35,
    resources: [],
    ...config
  };
}

function quiz(question, correct, success, retry, options) {
  return {
    question,
    correct,
    success,
    retry,
    options
  };
}

const MODULES = [
  {
    slug: "beginner",
    level: "Level 0",
    title: "Programming and web basics",
    audience: "Absolute beginners",
    time: "90-120 min",
    summary: "Start from zero: what code is, what the browser does, how pages render, and how user actions become app behavior.",
    outcomes: [
      "Explain what HTML, CSS, and JavaScript each do.",
      "Describe what a browser, route, and request are.",
      "Recognize how FastScript fits into the normal web model."
    ],
    lessons: [
      lesson({
        slug: "what-is-code",
        title: "What code, the browser, and the web actually do",
        summary: "Learn the mental model first so FastScript feels simple instead of magical.",
        minutes: 45,
        workedExample: {
          title: "A browser page in plain FastScript",
          code: "export default function Home() {\n  return `<main>\\n    <h1>Hello, school.</h1>\\n    <p>The browser turns this HTML string into a visible page.</p>\\n  </main>`;\n}"
        },
        exercise: {
          title: "Edit the first page",
          prompt: "Change the heading and add one paragraph that explains what a browser does.",
          starter: "export default function Home() {\n  return `<main>\\n    <h1>Hello, world.</h1>\\n  </main>`;\n}",
          reference: "export default function Home() {\n  return `<main>\\n    <h1>Hello from FastScript School.</h1>\\n    <p>The browser receives HTML, CSS, and JavaScript and turns them into the page you can see and use.</p>\\n  </main>`;\n}"
        },
        concepts: [
          "Code is a set of instructions the computer follows.",
          "The browser receives HTML, CSS, and JavaScript and turns them into an interface.",
          "A route is a URL path such as /learn or /dashboard.",
          "FastScript keeps these same web rules; it does not invent a separate internet."
        ],
        checkpoints: [
          "I can explain the difference between HTML structure, CSS styling, and JavaScript behavior.",
          "I understand that a page route returns something the browser can display.",
          "I can describe FastScript as one runtime boundary for normal web pieces."
        ],
        mistakes: [
          "Thinking FastScript replaces the browser. It does not; it works with the browser.",
          "Treating routes like files only. Routes are the public paths users actually visit.",
          "Trying to memorize syntax before understanding the request-to-page flow."
        ],
        realUse: [
          "Landing pages and docs sites still depend on the same browser rules you are learning here.",
          "Every product dashboard begins with routes, rendered pages, and user actions."
        ],
        resources: [["Open Playground", "/docs/playground"], ["Why FastScript", "/why-fastscript"]]
      }),
      lesson({
        slug: "browser-requests-and-forms",
        title: "Browser requests, forms, and user actions",
        summary: "See how clicking, typing, and submitting become requests that your app can respond to.",
        workedExample: {
          title: "A page with a form action",
          code: "export default function ContactLesson() {\n  return `<form method=\"post\" action=\"/api/hello\">\\n    <label>Name <input name=\"name\" /></label>\\n    <button type=\"submit\">Send</button>\\n  </form>`;\n}"
        },
        exercise: {
          title: "Make the form clearer",
          prompt: "Add one helper paragraph and rename the button so the user understands what happens next.",
          starter: "export default function ContactLesson() {\n  return `<form method=\"post\" action=\"/api/hello\">\\n    <label>Email <input name=\"email\" /></label>\\n    <button type=\"submit\">Go</button>\\n  </form>`;\n}",
          reference: "export default function ContactLesson() {\n  return `<form method=\"post\" action=\"/api/hello\">\\n    <p>Submit this form to send a browser request to your app.</p>\\n    <label>Email <input name=\"email\" /></label>\\n    <button type=\"submit\">Send request</button>\\n  </form>`;\n}"
        },
        concepts: [
          "Browsers send requests when a user follows a link, loads a page, or submits a form.",
          "Forms are one of the simplest ways to understand user input flowing into an app.",
          "A request has a destination route and often includes data.",
          "Good interfaces explain what action a button or form will trigger."
        ],
        checkpoints: [
          "I can explain what happens when a form is submitted.",
          "I can describe the difference between a page load and a form action.",
          "I know that user actions become requests the app must handle safely."
        ],
        mistakes: [
          "Thinking the browser guesses what to do after a click. It follows markup and routes.",
          "Building forms with unclear labels so learners cannot see the request flow.",
          "Skipping the idea of method and action when learning input handling."
        ],
        realUse: [
          "Every sign-in, search, checkout, and settings screen begins with user actions becoming requests.",
          "This is the mental model behind both simple forms and full product workflows."
        ],
        resources: [["Team Dashboard baseline", "/docs/team-dashboard-saas"], ["Learn support matrix", "/docs/support"]]
      })
    ]
  },
  {
    slug: "foundations",
    level: "Level 1",
    title: "FastScript basics",
    audience: "Beginners and switchers",
    time: "75-105 min",
    summary: "Learn the .fs contract, the CLI, and the normal JS/TS authoring model FastScript expects.",
    outcomes: [
      "Install the CLI and create an app.",
      "Understand that .fs is a universal JS/TS container.",
      "Run dev, build, and inspect the app structure."
    ],
    lessons: [
      lesson({
        slug: "your-first-fs-file",
        title: "Your first .fs file without learning a second language",
        summary: "Use ordinary JavaScript and TypeScript inside .fs and see how FastScript treats it.",
        minutes: 40,
        workedExample: {
          title: "Strict TS in .fs",
          code: "type HeroProps = { title: string };\n\nexport default function Hero({ title }: HeroProps) {\n  return `<section>\\n    <h1>${title}</h1>\\n    <p>Ordinary TypeScript can live directly inside .fs.</p>\\n  </section>`;\n}"
        },
        exercise: {
          title: "Make the page personal",
          prompt: "Change the prop shape so the component renders a title and a subtitle.",
          starter: "type HeroProps = { title: string };\n\nexport default function Hero({ title }: HeroProps) {\n  return `<section>\\n    <h1>${title}</h1>\\n  </section>`;\n}",
          reference: "type HeroProps = {\n  title: string;\n  subtitle: string;\n};\n\nexport default function Hero({ title, subtitle }: HeroProps) {\n  return `<section>\\n    <h1>${title}</h1>\\n    <p>${subtitle}</p>\\n  </section>`;\n}"
        },
        concepts: [
          "FastScript-specific syntax is optional sugar, not a requirement.",
          ".fs accepts normal JS, TS, JSX, and TSX inside the FastScript runtime contract.",
          "If valid JS/TS fails in .fs, that is a FastScript compatibility bug.",
          "The CLI gives you create, dev, build, deploy, validate, and migration workflows."
        ],
        checkpoints: [
          "I can explain what .fs is without calling it a totally different language.",
          "I know how to create and run a FastScript app locally.",
          "I understand that the source format and the runtime contract belong together."
        ],
        mistakes: [
          "Assuming you must use fn, state, or ~ to be a real FastScript user.",
          "Skipping validate and QA because the app rendered once in dev mode.",
          "Treating .fs like a file extension change with no runtime meaning."
        ],
        realUse: [
          "Agency Ops proves strict TS-in-.fs for product-shaped development.",
          "startup-mvp proves the greenfield starter path for serious full-stack work."
        ],
        resources: [["Real-world adoption", "/docs/adoption"], ["Agency Ops guide", "/docs/agency-ops"]]
      }),
      lesson({
        slug: "cli-and-app-structure",
        title: "CLI workflow, app structure, and the .fs contract in practice",
        summary: "Move from a single file to understanding how a real FastScript app is laid out and shipped.",
        workedExample: {
          title: "A tiny FastScript project map",
          code: "app/\n  pages/\n    index.fs\n  api/\n    health.fs\n  middleware.fs\npackage.json"
        },
        exercise: {
          title: "Document the app tree",
          prompt: "Add one API file line and one note that explains what middleware does.",
          starter: "app/\n  pages/\n    index.fs",
          reference: "app/\n  pages/\n    index.fs\n  api/\n    health.fs\n  middleware.fs\n\n// middleware runs before route logic and can redirect, guard, or enrich requests."
        },
        concepts: [
          "FastScript apps have a predictable shape: pages, APIs, shared logic, middleware, and jobs.",
          "The CLI is how you create, run, build, validate, and deploy the app.",
          "A good project structure lowers migration risk and makes QA easier.",
          "The .fs contract is about both authored source and runtime behavior."
        ],
        checkpoints: [
          "I can name the main directories in a FastScript app.",
          "I know which command to use for dev, build, and validate.",
          "I can explain where pages, APIs, and middleware usually live."
        ],
        mistakes: [
          "Treating the CLI as optional once the project exists.",
          "Mixing route responsibilities so pages and APIs become hard to reason about.",
          "Skipping the project map when onboarding new developers."
        ],
        realUse: [
          "The school, startup-mvp, and agency-ops all rely on predictable app structure to stay teachable.",
          "Production teams move faster when every route and mutation has an obvious home."
        ],
        resources: [["Team Dashboard baseline", "/docs/team-dashboard-saas"], ["Full-stack proof", "/docs/latest"]]
      })
    ]
  },
  {
    slug: "fullstack",
    level: "Level 2",
    title: "Pages, routes, APIs, and app flow",
    audience: "All learners",
    time: "90-120 min",
    summary: "Move from static pages to full-stack thinking: rendered routes, APIs, middleware, auth/session, and jobs.",
    outcomes: [
      "Build pages and API routes in one app boundary.",
      "Understand middleware and session flow at a practical level.",
      "See how product workflows connect frontend and backend together."
    ],
    lessons: [
      lesson({
        slug: "pages-routes-and-loaders",
        title: "Pages, routes, loaders, APIs, middleware, and jobs in one runtime",
        summary: "This is where FastScript becomes obviously full-stack instead of just a page engine.",
        minutes: 55,
        workedExample: {
          title: "Page plus API mental model",
          code: "export async function load(ctx) {\n  return { route: ctx.pathname, signedIn: Boolean(ctx.user) };\n}\n\nexport default function Dashboard({ route, signedIn }) {\n  return `<main>\\n    <h1>${route}</h1>\\n    <p>Signed in: ${signedIn ? \"yes\" : \"no\"}</p>\\n  </main>`;\n}\n\nexport async function POST(ctx, h) {\n  return h.json({ ok: true, route: ctx.pathname });\n}"
        },
        exercise: {
          title: "Turn a page into a full-stack feature",
          prompt: "Add one loader field and one API JSON field that describe the current lesson route.",
          starter: "export async function load(ctx) {\n  return {};\n}\n\nexport default function LessonPage() {\n  return `<main><h1>Lesson</h1></main>`;\n}\n\nexport async function POST(ctx, h) {\n  return h.json({ ok: true });\n}",
          reference: "export async function load(ctx) {\n  return { pathname: ctx.pathname };\n}\n\nexport default function LessonPage({ pathname }) {\n  return `<main>\\n    <h1>Lesson</h1>\\n    <p>Current route: ${pathname}</p>\\n  </main>`;\n}\n\nexport async function POST(ctx, h) {\n  return h.json({ ok: true, route: ctx.pathname });\n}"
        },
        concepts: ["Pages render what users see.", "API routes handle mutations and data operations.", "Middleware enforces request rules before route logic runs.", "Jobs handle async work that should not block the user request."],
        checkpoints: ["I can explain the difference between a page route and an API route.", "I know where middleware fits in the request lifecycle.", "I understand why jobs exist instead of stuffing every side effect into a page request."],
        mistakes: ["Putting every mutation directly in page rendering code.", "Treating auth as only a UI concern instead of a request boundary concern.", "Ignoring jobs until the app becomes slow or unreliable."],
        realUse: ["Dashboards, admin tools, and SaaS apps all depend on this page-plus-API model.", "Agency Ops uses pages, APIs, middleware, billing actions, and jobs in one runtime boundary."],
        resources: [["Team Dashboard baseline", "/docs/team-dashboard-saas"], ["Agency Ops guide", "/docs/agency-ops"]]
      }),
      lesson({
        slug: "request-lifecycle-in-products",
        title: "Middleware, auth, and jobs in a real product request lifecycle",
        summary: "Follow one user request all the way from browser hit to protected route to async follow-up work.",
        workedExample: {
          title: "A protected request lifecycle",
          code: "export async function middleware(ctx, h) {\n  if (!ctx.user) return h.redirect(\"/sign-in\");\n  return h.next();\n}\n\nexport async function POST(ctx, h) {\n  await ctx.jobs.enqueue(\"send-receipt\", { invoiceId: \"inv_01\" });\n  return h.json({ queued: true });\n}"
        },
        exercise: {
          title: "Explain the lifecycle",
          prompt: "Add one comment describing the redirect guard and one comment describing why the job is queued.",
          starter: "export async function middleware(ctx, h) {\n  if (!ctx.user) return h.redirect(\"/sign-in\");\n  return h.next();\n}\n\nexport async function POST(ctx, h) {\n  await ctx.jobs.enqueue(\"send-receipt\", { invoiceId: \"inv_01\" });\n  return h.json({ queued: true });\n}",
          reference: "export async function middleware(ctx, h) {\n  // Guard protected routes before page or API logic runs.\n  if (!ctx.user) return h.redirect(\"/sign-in\");\n  return h.next();\n}\n\nexport async function POST(ctx, h) {\n  // Queue follow-up work so the request can finish quickly.\n  await ctx.jobs.enqueue(\"send-receipt\", { invoiceId: \"inv_01\" });\n  return h.json({ queued: true });\n}"
        },
        concepts: ["Auth belongs to the request boundary, not just the visual layer.", "Middleware is the earliest safe place to make route-wide decisions.", "Jobs keep product workflows responsive while still handling important follow-up work.", "Product requests often touch pages, APIs, sessions, and async work together."],
        checkpoints: ["I can describe the order: browser request, middleware, route logic, async follow-up.", "I know why redirects and auth checks happen before protected content renders.", "I understand when to queue a job instead of doing everything inline."],
        mistakes: ["Using middleware for everything, even when route-local logic is clearer.", "Making background work invisible so operators cannot trace what happened.", "Treating auth state as a visual toggle instead of a request contract."],
        realUse: ["Sign-in flows, receipt sending, admin actions, and notifications all use this lifecycle.", "The product-proof apps show this exact pattern under real user-facing routes."],
        resources: [["Agency Ops guide", "/docs/agency-ops"], ["Support matrix", "/docs/support"]]
      })
    ]
  },
  {
    slug: "databases",
    level: "Level 3",
    title: "Data, persistence, and safety",
    audience: "Builders and operators",
    time: "75-105 min",
    summary: "Teach persistence clearly without turning the school into a database war. Learn data flow, migrations, seeds, and safe app-state thinking.",
    outcomes: ["Explain what persistence means in a full-stack app.", "Understand migrations, seed data, and controlled change.", "Know how app state, user input, and durable storage fit together."],
    lessons: [
      lesson({
        slug: "state-and-persistence",
        title: "Persistence without confusion: app state, storage, and database concepts",
        summary: "Learn what must survive after refresh, restart, and deployment, and why that changes architecture.",
        minutes: 50,
        workedExample: { title: "Reading persisted data in a loader", code: "export async function load(ctx) {\n  const invoices = await ctx.db.list(\"invoices\");\n  return { count: invoices.length };\n}\n\nexport default function BillingOverview({ count }) {\n  return `<section>\\n    <h1>Invoices</h1>\\n    <p>Total records: ${count}</p>\\n  </section>`;\n}" },
        exercise: { title: "Describe durable state", prompt: "Add one sentence explaining why invoice records must survive a page refresh.", starter: "export default function Notes() {\n  return `<section>\\n    <p>Invoices are important.</p>\\n  </section>`;\n}", reference: "export default function Notes() {\n  return `<section>\\n    <p>Invoices are important.</p>\\n    <p>Durable records must survive refresh, restart, and deployment so the business history stays trustworthy.</p>\\n  </section>`;\n}" },
        concepts: ["Persistence means important data survives beyond the current request or tab.", "App state, browser state, and durable data are not the same thing.", "Loaders and APIs often read and write the persistent layer.", "A full-stack app becomes more serious the moment business data must survive."],
        checkpoints: ["I can explain what persistence means without naming one specific database.", "I know that durable business data must survive refresh and restart.", "I can distinguish browser-only state from app-level persistent state."],
        mistakes: ["Treating local browser state as a substitute for business persistence.", "Turning the data conversation into vendor preferences too early.", "Ignoring how persistence changes testing and deployment discipline."],
        realUse: ["Invoices, memberships, projects, work items, and billing events all require durable state.", "Reference apps prove the app shape while keeping infrastructure specifics governed separately."],
        resources: [["Support matrix", "/docs/support"], ["Deploy guide", "/docs/deploy-guide"]]
      }),
      lesson({
        slug: "migrations-and-seed-discipline",
        title: "Migrations, seed data, and durable state discipline",
        summary: "See how data shape changes safely over time and why good seed data makes app proofs believable.",
        workedExample: { title: "Migration plus seed mindset", code: "export async function up(db) {\n  await db.createCollection(\"clients\");\n}\n\nexport async function seed(db) {\n  await db.insert(\"clients\", { name: \"Northline Studio\" });\n}" },
        exercise: { title: "Make the seed more useful", prompt: "Add one more client record and one note that explains why seed data should feel real.", starter: "export async function seed(db) {\n  await db.insert(\"clients\", { name: \"Northline Studio\" });\n}", reference: "export async function seed(db) {\n  await db.insert(\"clients\", { name: \"Northline Studio\" });\n  await db.insert(\"clients\", { name: \"Hinterland Health\" });\n}\n\n// Real seed data helps routes, demos, and tests prove believable product behavior." },
        concepts: ["Migrations track how durable state changes safely over time.", "Seed data gives teams a believable starting point for demos, tests, and onboarding.", "Realistic data catches UI, workflow, and query mistakes earlier.", "Safe persistence discipline matters before production, not after a failure."],
        checkpoints: ["I know why migrations exist instead of editing durable data shape manually.", "I can explain why seed data should look product-real, not random.", "I understand that state discipline is part of shipping, not just database administration."],
        mistakes: ["Using fake seed data so unrealistic that it hides workflow problems.", "Changing durable state shape without a migration path.", "Forgetting that tests and docs depend on believable seeded scenarios."],
        realUse: ["Both startup-mvp and agency-ops rely on seeded data to prove product flows clearly.", "Migration discipline becomes critical as teams add billing, auth, and ops workflows."],
        resources: [["Agency Ops guide", "/docs/agency-ops"], ["Reference apps", "/docs/reference-apps"]]
      })
    ]
  },
  {
    slug: "styling",
    level: "Level 4",
    title: "Styling, CSS, and UI systems",
    audience: "Design-minded builders",
    time: "75-105 min",
    summary: "Learn how to make FastScript apps feel intentional: CSS structure, layout, hierarchy, reusable classes, and responsive thinking.",
    outcomes: ["Understand CSS as a system instead of random overrides.", "Build readable layout hierarchy and reusable component classes.", "Use styling decisions that hold up in real product work."],
    lessons: [
      lesson({
        slug: "css-with-purpose",
        title: "CSS with purpose: spacing, hierarchy, and readable interfaces",
        summary: "Learn why UI clarity comes from structure and hierarchy before visual flourish.",
        workedExample: { title: "A simple UI block", code: ".card {\n  padding: 1rem;\n  border-radius: 1rem;\n}\n\n.card-title {\n  font-weight: 700;\n}\n\n.card-copy {\n  color: var(--c-muted);\n}" },
        exercise: { title: "Clarify the hierarchy", prompt: "Add one class for a subtitle and one class that separates primary from secondary text.", starter: ".card-title {\n  font-weight: 700;\n}", reference: ".card-title {\n  font-weight: 700;\n}\n\n.card-subtitle {\n  font-size: .95rem;\n}\n\n.card-copy {\n  color: var(--c-muted);\n}" },
        concepts: ["Good CSS communicates hierarchy before decoration.", "Spacing, typography, and grouping create clarity.", "Reusable classes are easier to maintain than ad-hoc visual overrides.", "Product UI should feel intentional on both desktop and mobile."],
        checkpoints: ["I can explain why layout and hierarchy come before flashy styling.", "I understand why reusable classes scale better than random one-offs.", "I know that readable UI is part of product quality, not a finishing detail."],
        mistakes: ["Jumping straight to colors and motion before the layout works.", "Styling only for desktop and calling it done.", "Creating class names that describe one exact page instead of reusable roles."],
        realUse: ["Docs, dashboards, billing pages, and admin tools all need calm visual hierarchy.", "FastScript product apps rely on CSS discipline just as much as route discipline."],
        resources: [["Learn playground", "/docs/playground"], ["Agency Ops guide", "/docs/agency-ops"]]
      }),
      lesson({
        slug: "responsive-layout-and-ui-patterns",
        title: "Responsive layout, visual hierarchy, and reusable UI patterns",
        summary: "Apply styling ideas to product-shaped interfaces that have cards, grids, sidebars, and action areas.",
        workedExample: { title: "Responsive page shell", code: ".dashboard {\n  display: grid;\n  gap: 1.5rem;\n}\n\n@media (min-width: 920px) {\n  .dashboard {\n    grid-template-columns: 280px 1fr;\n  }\n}" },
        exercise: { title: "Add a mobile-first note", prompt: "Add one comment that explains why the single-column layout is the default and the second column comes later.", starter: ".dashboard {\n  display: grid;\n  gap: 1.5rem;\n}\n\n@media (min-width: 920px) {\n  .dashboard {\n    grid-template-columns: 280px 1fr;\n  }\n}", reference: ".dashboard {\n  display: grid;\n  gap: 1.5rem;\n}\n\n/* Start mobile-first, then add the sidebar when wider screens have room for it. */\n@media (min-width: 920px) {\n  .dashboard {\n    grid-template-columns: 280px 1fr;\n  }\n}" },
        concepts: ["Responsive design starts from constrained layouts and grows outward.", "Page shells, cards, sidebars, and action rows are reusable product patterns.", "Hierarchy should survive on small screens, not collapse into noise.", "UI systems get stronger when components have clear structural roles."],
        checkpoints: ["I can explain why mobile-first layout decisions reduce complexity.", "I know how to think about shell, content area, and secondary context.", "I understand that responsive design is about readable flow, not just shrink-to-fit."],
        mistakes: ["Designing for one ideal desktop screenshot only.", "Making cards and sidebars so rigid that they break on smaller screens.", "Treating responsive work as a late polish step instead of part of core layout planning."],
        realUse: ["Product dashboards like startup-mvp and agency-ops depend on stable layout patterns.", "Learning reusable UI patterns now makes capstone work much faster later."],
        resources: [["Reference apps", "/docs/reference-apps"], ["FastScript school", "/learn"]]
      })
    ]
  },
  {
    slug: "shipping",
    level: "Level 5",
    title: "Deployment, QA, and shipping",
    audience: "People who want to ship for real",
    time: "75-105 min",
    summary: "Learn how FastScript moves from a local app to a shippable product: build artifacts, QA gates, adapters, and custom-host handoff.",
    outcomes: ["Understand build, validate, and production start.", "Know the difference between adapter deployment and custom-host deployment.", "Use smoke checks and QA gates before calling a product done."],
    lessons: [
      lesson({
        slug: "build-validate-and-start",
        title: "Build, validate, and production start without guessing",
        summary: "Learn the discipline that turns a project into something you can trust before deploy.",
        workedExample: { title: "Basic release checklist", code: "npm run build\nnpm run validate\nnpm run qa:all\nnode ./src/cli.mjs start" },
        exercise: { title: "Strengthen the checklist", prompt: "Add one line for docs indexing or app proof so the release flow is not just build-and-hope.", starter: "npm run build\nnpm run validate\nnode ./src/cli.mjs start", reference: "npm run build\nnpm run docs:index\nnpm run validate\nnpm run qa:all\nnode ./src/cli.mjs start" },
        concepts: ["A green build is not the whole shipping story.", "Validation and QA gates catch class, routing, docs, and runtime problems earlier.", "Production start should be testable before deployment.", "Shipping discipline creates confidence for both beginners and teams."],
        checkpoints: ["I know the difference between build and validate.", "I can explain why QA gates belong before release.", "I understand that production start is a real runtime check, not a paperwork step."],
        mistakes: ["Stopping after dev mode looked fine once.", "Skipping runtime smoke checks because the build succeeded.", "Treating docs and proof artifacts as optional afterthoughts."],
        realUse: ["Every serious FastScript app should pass through build, validate, and production start before deployment.", "This discipline is what makes product-shaped apps teachable and supportable."],
        resources: [["Deploy guide", "/docs/deploy-guide"], ["Latest proof update", "/docs/latest"]]
      }),
      lesson({
        slug: "adapters-custom-hosts-and-release-discipline",
        title: "Adapters, custom-host handoff, smoke checks, and release discipline",
        summary: "Understand what gets deployed, when adapters help, and how custom Node/container hosts fit the contract.",
        workedExample: { title: "Custom-host deployment view", code: "dist/\n  fastscript-manifest.json\n\n# start production\nnode ./src/cli.mjs start" },
        exercise: { title: "Explain the deployable unit", prompt: "Add one note that explains why teams deploy the app plus dist instead of uploading a random adapter file.", starter: "dist/\n  fastscript-manifest.json", reference: "dist/\n  fastscript-manifest.json\n\n// Deploy the app plus built output, then start the FastScript runtime for custom hosts." },
        concepts: ["Adapters are provider-specific helpers, not the whole deployment story.", "Custom Node or container hosts deploy the built app plus dist and then start the runtime.", "Smoke checks prove the deployment is healthy after start.", "Release discipline means knowing what artifact you are actually shipping."],
        checkpoints: ["I can explain the difference between an adapter artifact and the universal build artifact.", "I know what a smoke check should verify after production start.", "I understand how custom hosts fit the FastScript deployment contract."],
        mistakes: ["Assuming one provider-specific file is the universal deployment artifact.", "Skipping health checks after production start.", "Treating deployment as separate from runtime understanding."],
        realUse: ["Agency Ops docs explain the custom-host path clearly for non-adapter infrastructure.", "Release discipline matters even more as products gain billing, jobs, and protected routes."],
        resources: [["Agency Ops guide", "/docs/agency-ops"], ["Deploy guide", "/docs/deploy-guide"]]
      })
    ]
  },
  {
    slug: "professional",
    level: "Level 6",
    title: "Professional adoption and judgment",
    audience: "Experienced developers and teams",
    time: "75-105 min",
    summary: "Learn how to adopt FastScript responsibly in real teams: support lanes, runtime boundaries, and proof-backed rollout decisions.",
    outcomes: ["Read the support matrix as a product contract.", "Adopt FastScript through proven lanes instead of guesswork.", "Recognize when a gap is a compatibility bug versus an unsupported path."],
    lessons: [
      lesson({
        slug: "support-matrix-and-proof-lanes",
        title: "Read the support matrix like a production contract",
        summary: "Professional adoption starts with knowing which lanes are proven, partial, or still planned.",
        workedExample: { title: "Judgment before adoption", code: "if (lane.status !== \"proven\") {\n  throw new Error(\"Do not promise this in production yet.\");\n}" },
        exercise: { title: "Make the rule explicit", prompt: "Add one comment that explains why promising unsupported lanes is worse than saying not yet.", starter: "if (lane.status !== \"proven\") {\n  throw new Error(\"Do not promise this in production yet.\");\n}", reference: "if (lane.status !== \"proven\") {\n  // Honest support boundaries protect teams more than over-promising and discovering gaps late.\n  throw new Error(\"Do not promise this in production yet.\");\n}" },
        concepts: ["The support matrix is a contract, not a decorative docs page.", "Proven, partial, and planned have different consequences for delivery risk.", "Professional adoption means choosing proven lanes first.", "Compatibility bugs should be surfaced and added to proof, not hidden."],
        checkpoints: ["I know why the support matrix belongs in adoption decisions.", "I can explain the difference between proven, partial, and planned lanes.", "I understand why hidden gaps become team risk later."],
        mistakes: ["Treating docs language as less important than code reality.", "Assuming a demo equals a governed support claim.", "Promising a lane before the proof work exists."],
        realUse: ["This is how you decide whether to roll FastScript into an existing org or product line.", "It keeps adoption honest even when enthusiasm is high."],
        resources: [["Support matrix", "/docs/support"], ["Adoption guide", "/docs/adoption"]]
      }),
      lesson({
        slug: "runtime-boundaries-and-proof-backed-rollout",
        title: "Runtime boundaries, support judgment, and proof-backed rollout",
        summary: "Learn how to judge what belongs in one runtime boundary and how to adopt gradually without creating hidden risk.",
        workedExample: { title: "A safe rollout note", code: "const rollout = {\n  startWith: \"proven full-stack lanes\",\n  escalateWith: \"proof\",\n  treatGapsAs: \"compatibility work\"\n};" },
        exercise: { title: "Write the rollout rule", prompt: "Add one property that reminds the team to avoid local hacks for compatibility gaps.", starter: "const rollout = {\n  startWith: \"proven full-stack lanes\",\n  escalateWith: \"proof\"\n};", reference: "const rollout = {\n  startWith: \"proven full-stack lanes\",\n  escalateWith: \"proof\",\n  avoid: \"local hacks that hide compatibility gaps\"\n};" },
        concepts: ["One runtime boundary can make pages, APIs, jobs, and shared logic easier to reason about.", "Safe rollout is incremental, evidence-backed, and aligned to governed support.", "Teams should expand only when proof and product needs justify it.", "Compatibility issues belong in the shared contract, not buried in one app."],
        checkpoints: ["I can explain what a runtime boundary is in practice.", "I know how to grow adoption from proven lanes outward.", "I understand why proof-backed rollout beats internal folklore."],
        mistakes: ["Adopting everything at once without lane-level judgment.", "Using app-specific hacks instead of escalating compatibility work.", "Ignoring how runtime boundaries affect team clarity and QA."],
        realUse: ["Professional teams need this mindset to keep migrations and new builds sane.", "The proof apps exist so rollout decisions are grounded instead of speculative."],
        resources: [["Agency Ops guide", "/docs/agency-ops"], ["Latest proof update", "/docs/latest"]]
      })
    ]
  },
  {
    slug: "migration",
    level: "Level 7",
    title: "Migration from TS/JS to .fs",
    audience: "Professionals and maintainers",
    time: "90-120 min",
    summary: "Learn how to migrate safely: dry-runs, manifests, rollback, proof lanes, and what secure adoption actually looks like.",
    outcomes: ["Use dry-run conversion before editing real files.", "Read manifests and rollback safely.", "Treat conversion gaps as governed compatibility work."],
    lessons: [
      lesson({
        slug: "dry-run-convert-rollback",
        title: "Dry-run, convert, rollback: the safe professional migration loop",
        summary: "Learn the discipline that keeps adoption safe instead of impulsive.",
        workedExample: { title: "A migration loop", code: "fastscript migrate src --dry-run\nfastscript migrate src --write\nfastscript migrate src --rollback" },
        exercise: { title: "Document the safe order", prompt: "Add one note explaining why dry-run comes first and rollback must stay ready.", starter: "fastscript migrate src --dry-run\nfastscript migrate src --write\nfastscript migrate src --rollback", reference: "fastscript migrate src --dry-run\nfastscript migrate src --write\nfastscript migrate src --rollback\n\n// Dry-run shows the impact first. Rollback protects you if the written conversion is not safe yet." },
        concepts: ["Dry-run protects you from blind edits.", "Write mode should come only after reviewing the proposed changes.", "Rollback is part of the migration contract, not an embarrassing fallback.", "Professional migration is a reversible workflow, not a leap of faith."],
        checkpoints: ["I know why dry-run should come before write mode.", "I can explain why rollback is a first-class safety tool.", "I understand that migration discipline matters as much as conversion output."],
        mistakes: ["Running write mode immediately because the code looked simple.", "Ignoring rollback until after a messy conversion.", "Treating migration as search-and-replace instead of a governed workflow."],
        realUse: ["This is the path professionals use when they have real TS/JS code and delivery pressure.", "Fast adoption gets safer when the workflow stays reversible."],
        resources: [["Adoption guide", "/docs/adoption"], ["Support matrix", "/docs/support"]]
      }),
      lesson({
        slug: "manifest-diffs-and-compatibility-gaps",
        title: "Manifest reading, diff preview, rollback drills, and compatibility gaps",
        summary: "Go beyond the command sequence and learn how to inspect what changed, what failed, and what to do next.",
        workedExample: { title: "A migration manifest mindset", code: "{\n  \"converted\": 8,\n  \"skipped\": 2,\n  \"needsReview\": [\"src/auth/session.ts\"]\n}" },
        exercise: { title: "Interpret the manifest", prompt: "Add one sentence that explains why skipped or review-needed files should change the rollout plan.", starter: "{\n  \"converted\": 8,\n  \"skipped\": 2,\n  \"needsReview\": [\"src/auth/session.ts\"]\n}", reference: "{\n  \"converted\": 8,\n  \"skipped\": 2,\n  \"needsReview\": [\"src/auth/session.ts\"]\n}\n\n// Review-needed files mean the migration is not fully routine yet and the rollout plan should stay cautious." },
        concepts: ["Migration output should be read, not merely generated.", "Diff preview and manifest review help you see what needs human judgment.", "Skipped or review-needed files are signals, not inconveniences.", "Compatibility gaps should become proof work, not hidden app-local hacks."],
        checkpoints: ["I know how to treat a partial migration result honestly.", "I can explain why manifests and diffs are part of secure adoption.", "I understand when to stop and escalate a compatibility issue."],
        mistakes: ["Treating skipped files as harmless by default.", "Rolling forward without reading the manifest or diff.", "Patching around incompatibilities locally and calling the migration done."],
        realUse: ["This is how mature teams keep migrations auditable and reversible.", "The same habits protect both greenfield adoption and legacy transitions."],
        resources: [["Latest proof update", "/docs/latest"], ["Support matrix", "/docs/support"]]
      })
    ]
  },
  {
    slug: "mastery",
    level: "Level 8",
    title: "Capstones and FastScript mastery",
    audience: "Graduates and serious builders",
    time: "90-120 min",
    summary: "Pull everything together into real build-and-ship discipline: capstones, reference app choice, QA gates, and release readiness.",
    outcomes: ["Choose the right baseline for a real product.", "Plan and ship a capstone with QA, deployment, and support-matrix discipline.", "Demonstrate FastScript mastery through product-shaped work."],
    lessons: [
      lesson({
        slug: "capstone-product-architecture",
        title: "Capstone architecture: choosing the right baseline and app shape",
        summary: "Learn how to move from lessons into a serious product-shaped build without guessing your starting point.",
        workedExample: { title: "Baseline choice", code: "const baseline = projectType === \"greenfield\"\n  ? \"startup-mvp\"\n  : \"agency-ops\";" },
        exercise: { title: "Explain the choice", prompt: "Add one sentence that explains when startup-mvp is the right baseline and when agency-ops is the better reference.", starter: "const baseline = projectType === \"greenfield\"\n  ? \"startup-mvp\"\n  : \"agency-ops\";", reference: "const baseline = projectType === \"greenfield\"\n  ? \"startup-mvp\"\n  : \"agency-ops\";\n\n// startup-mvp is the stable greenfield baseline. agency-ops is the stricter TS-in-.fs product reference." },
        concepts: ["Mastery includes choosing a good starting point, not just writing route code.", "Reference apps shorten decision time when they are mapped honestly to product goals.", "Greenfield work and strict-TS proving work benefit from different examples.", "Good architecture decisions happen before the first feature branch."],
        checkpoints: ["I can explain when to start from startup-mvp versus agency-ops.", "I know how reference apps help me avoid inventing app structure from scratch.", "I understand that baseline choice changes migration and delivery speed."],
        mistakes: ["Choosing a baseline for aesthetics instead of workflow fit.", "Ignoring the support matrix while planning a capstone.", "Starting a serious app without deciding what proof app it maps to."],
        realUse: ["Capstone work gets dramatically easier when your starting point already matches the product shape.", "This is also how real teams reduce churn in early architecture decisions."],
        resources: [["Capstone hub", "/learn/capstone"], ["Reference apps", "/docs/reference-apps"]]
      }),
      lesson({
        slug: "delivery-checklist-and-release-readiness",
        title: "Capstone planning, delivery checklist, and release readiness",
        summary: "Finish the mastery ladder with the habits that make a serious FastScript app ready to ship.",
        workedExample: { title: "Release readiness checklist", code: "const releaseReady = [\n  \"support lane chosen\",\n  \"tests green\",\n  \"validate green\",\n  \"deployment path documented\"\n];" },
        exercise: { title: "Add the missing guardrail", prompt: "Add one checklist item that reminds the team to treat compatibility gaps as proof work.", starter: "const releaseReady = [\n  \"support lane chosen\",\n  \"tests green\",\n  \"validate green\",\n  \"deployment path documented\"\n];", reference: "const releaseReady = [\n  \"support lane chosen\",\n  \"tests green\",\n  \"validate green\",\n  \"deployment path documented\",\n  \"compatibility gaps escalated into proof work\"\n];" },
        concepts: ["Mastery means finishing the app with discipline, not just getting the feature to render.", "QA, deployment docs, and support-lane judgment are part of the product.", "A capstone proves judgment as much as coding skill.", "Release readiness is what turns a practice app into a credible deliverable."],
        checkpoints: ["I can describe a release-ready FastScript capstone.", "I know which proof, QA, and docs checks belong before shipping.", "I understand how to keep the delivery process honest when gaps appear."],
        mistakes: ["Stopping at feature-complete instead of release-ready.", "Leaving deployment, docs, or validation for the very end.", "Ignoring compatibility gaps because the capstone mostly works locally."],
        realUse: ["This is the skill set that separates experimentation from professional delivery.", "A mastered FastScript workflow is observable in the checklist, not just the code."],
        resources: [["Capstone hub", "/learn/capstone"], ["Latest proof update", "/docs/latest"]]
      })
    ]
  }
];

const CAPSTONES = [
  {
    slug: "beginner",
    title: "Beginner capstone",
    goal: "Build a small multi-page app that proves you understand routes, forms, and simple full-stack flow.",
    build: "A tiny school directory or portfolio app with a home page, one details page, one form, and one API action.",
    concepts: ["Pages and routes", "HTML/CSS basics", "Simple form actions", "Local progress and QA habits"],
    checklist: ["Create at least two page routes.", "Style the UI so the hierarchy is clear.", "Add one form that sends input to an API route.", "Explain where browser behavior ends and app logic begins."],
    done: "You can navigate the app, submit a form, explain the route flow, and show clean structure in app/pages and app/api."
  },
  {
    slug: "intermediate",
    title: "Intermediate full-stack capstone",
    goal: "Build an authenticated dashboard with pages, APIs, jobs, and realistic seeded state.",
    build: "A simple ops dashboard with sign-in, protected routes, one billing or notification action, and a queue-backed follow-up.",
    concepts: ["Middleware and auth", "APIs and mutations", "Jobs", "Seed data", "Build and validate"],
    checklist: ["Protect one route with middleware or session checks.", "Add one mutation API that changes app state.", "Queue one job for follow-up work.", "Run build, validate, and a smoke test."],
    done: "The app feels product-shaped, not like a static lesson exercise, and you can explain the request lifecycle clearly."
  },
  {
    slug: "professional",
    title: "Professional migration capstone",
    goal: "Safely migrate one TS/JS slice into .fs with dry-run, review, rollback discipline, and proof-backed decisions.",
    build: "A small converted route or feature slice with manifest review, compatibility notes, and rollback readiness.",
    concepts: ["Dry-run conversion", "Manifest reading", "Rollback", "Support-lane judgment", "Compatibility escalation"],
    checklist: ["Run and review dry-run before write mode.", "Capture manifest or diff findings.", "Document rollback steps.", "Escalate any gap as compatibility work instead of hiding it."],
    done: "You can show both the converted slice and the professional process that made it safe."
  },
  {
    slug: "mastery",
    title: "Mastery capstone",
    goal: "Ship a production-shaped FastScript app using the right baseline, QA gates, deployment handoff, and support-matrix discipline.",
    build: "Start from startup-mvp or agency-ops, extend it into a real product slice, and finish with proof-backed release readiness.",
    concepts: ["Baseline choice", "Reference apps", "QA and validate", "Deployment handoff", "Support matrix"],
    checklist: ["Choose startup-mvp or agency-ops intentionally.", "Implement at least one real product workflow.", "Document deployment and smoke checks.", "Pass validate and route-level proof checks."],
    done: "You can justify the architecture, show the proof lane, and hand the app to another developer with confidence."
  }
];

const QUIZ_BANK = {
  "beginner/what-is-code": quiz("What does the browser do with the HTML your route returns?", "render", "Right. The browser turns returned HTML into the interface the learner can see and use.", "Not quite. Think about the browser as the thing that renders structure, style, and behavior into a page.", [
    ["store", "It stores the HTML forever in a database."],
    ["render", "It renders the HTML, CSS, and JavaScript into the visible page."],
    ["compile", "It compiles the route into a new programming language."]
  ]),
  "beginner/browser-requests-and-forms": quiz("What happens when a learner submits a form?", "request", "Exactly. The browser sends a request to the route or API target in the form action.", "Close, but the key idea is that forms trigger requests your app can handle.", [
    ["request", "The browser sends a request with the form data."],
    ["refresh", "The browser only refreshes the page without sending data."],
    ["style", "The browser only changes CSS classes locally."]
  ]),
  "foundations/your-first-fs-file": quiz("What is the safest way to describe .fs to another developer?", "container", "Yes. .fs is a universal JS/TS container inside the FastScript runtime contract.", "Try the explanation that keeps normal JS/TS authoring intact instead of inventing a second language.", [
    ["language", ".fs is a completely separate language you must rewrite everything into."],
    ["container", ".fs is a universal JS/TS container for the FastScript runtime."],
    ["alias", ".fs is only a cosmetic alias for .txt files."]
  ]),
  "foundations/cli-and-app-structure": quiz("Where should route rendering usually live in a FastScript app?", "pages", "Right. Page rendering belongs in app/pages, with APIs and middleware in their own clear places.", "Think about the folder that maps most directly to routes users visit.", [
    ["jobs", "Inside app/jobs because every page is background work."],
    ["pages", "Inside app/pages because that is the route-rendering surface."],
    ["db", "Inside app/db because routes are database records."]
  ]),
  "fullstack/pages-routes-and-loaders": quiz("What is the clearest difference between a page route and an API route?", "ui", "Correct. Pages render what users see, while APIs handle data and mutation operations.", "Try the option that separates user-visible rendering from data or mutation logic.", [
    ["ui", "Pages render UI; APIs handle data and mutations."],
    ["same", "They are the same thing with different file names only."],
    ["auth", "Pages are for auth and APIs are for CSS."]
  ]),
  "fullstack/request-lifecycle-in-products": quiz("Why do product apps queue jobs instead of doing every side effect inline?", "responsive", "Exactly. Jobs keep the request responsive while follow-up work still happens reliably.", "The key tradeoff is speed and reliability during the request lifecycle.", [
    ["responsive", "To keep the request fast while async follow-up work happens separately."],
    ["random", "Because jobs are more random and harder to trace."],
    ["styles", "Because CSS can only load after a job runs."]
  ]),
  "databases/state-and-persistence": quiz("What makes data persistent in a full-stack app?", "survive", "Yes. Persistent data survives refresh, restart, and deployment instead of living only in the current tab.", "Look for the answer about data surviving beyond the current request or tab.", [
    ["survive", "It survives refresh, restart, and deployment."],
    ["hidden", "It is hidden from the user interface."],
    ["styled", "It uses the right CSS classes."]
  ]),
  "databases/migrations-and-seed-discipline": quiz("Why is realistic seed data useful?", "proof", "Right. Realistic seed data makes demos, tests, and workflows prove believable product behavior.", "Think about what helps routes and tests reveal real product problems earlier.", [
    ["proof", "It makes demos, tests, and workflows prove believable product behavior."],
    ["speed", "It removes the need for migrations entirely."],
    ["secrets", "It hides environment configuration from operators."]
  ]),
  "styling/css-with-purpose": quiz("What should come before flashy styling in product UI work?", "hierarchy", "Exactly. Layout, grouping, and hierarchy should be clear before decorative choices.", "The best answer focuses on structure and readability first.", [
    ["animation", "Heavy motion and gradients should always come first."],
    ["hierarchy", "Clear layout, spacing, and hierarchy should come first."],
    ["icons", "Icons should replace layout decisions entirely."]
  ]),
  "styling/responsive-layout-and-ui-patterns": quiz("Why do teams start responsive layout work from constrained screens?", "mobile", "Yes. Starting from smaller screens keeps the layout honest and easier to scale up.", "Think mobile-first and readable flow, not ideal desktop screenshots.", [
    ["mobile", "It keeps the layout honest and easier to scale up."],
    ["desktop", "Because mobile can always be fixed at the end."],
    ["fonts", "Because only small screens support typography."]
  ]),
  "shipping/build-validate-and-start": quiz("Why is a green build not enough before shipping?", "qa", "Correct. You still need validation, QA, and runtime checks before calling the app ready.", "The missing step is the broader verification loop, not more bundling.", [
    ["qa", "Because validation, QA, and runtime checks still need to pass."],
    ["copy", "Because landing-page copy must always be longer."],
    ["css", "Because builds never include styles."]
  ]),
  "shipping/adapters-custom-hosts-and-release-discipline": quiz("What is the universal deployable unit on a custom host?", "dist", "Right. Teams deploy the app plus dist and then start the FastScript runtime.", "Look for the option that keeps the built app and runtime together, not a random provider file.", [
    ["worker", "A single provider-specific worker file in every case."],
    ["dist", "The app plus dist, then the FastScript production runtime."],
    ["screenshot", "A screenshot of the app so operators know what it looked like."]
  ]),
  "professional/support-matrix-and-proof-lanes": quiz("How should a team treat the support matrix?", "contract", "Yes. It is a product contract for adoption decisions, not decorative docs copy.", "Choose the answer that ties support claims directly to delivery risk and rollout choices.", [
    ["contract", "As a product contract for proven, partial, and planned lanes."],
    ["marketing", "As optional marketing copy that can be ignored."],
    ["theme", "As a visual theme guide for docs pages."]
  ]),
  "professional/runtime-boundaries-and-proof-backed-rollout": quiz("What should happen when a compatibility gap appears during rollout?", "escalate", "Exactly. Escalate it into compatibility or proof work instead of hiding it locally.", "The safe move is to surface the gap, not patch around it quietly.", [
    ["escalate", "Escalate it into compatibility or proof work."],
    ["hide", "Hide it in one app with a local hack."],
    ["ship", "Ship first and document it later only if someone complains."]
  ]),
  "migration/dry-run-convert-rollback": quiz("Why does dry-run come before write mode in migration work?", "review", "Correct. Dry-run lets you review the proposed impact before real files change.", "Pick the option that protects teams from blind edits.", [
    ["review", "It shows the proposed impact before real files change."],
    ["speed", "It is always faster than write mode in production."],
    ["styles", "It checks CSS before JavaScript."]
  ]),
  "migration/manifest-diffs-and-compatibility-gaps": quiz("What should skipped or review-needed files change?", "plan", "Right. They should make the rollout plan more cautious and more explicit.", "The clue is that partial migration output affects delivery planning, not just curiosity.", [
    ["plan", "They should change the rollout plan and trigger more review."],
    ["nothing", "They change nothing if most files converted."],
    ["theme", "They only affect documentation styling."]
  ]),
  "mastery/capstone-product-architecture": quiz("When is agency-ops usually the better reference than startup-mvp?", "strict", "Yes. Agency Ops is the stricter TS-in-.fs proving-ground app for product-shaped work.", "Choose the option about strict TypeScript product proving, not the general greenfield starter.", [
    ["strict", "When you want the stricter TS-in-.fs proving-ground reference."],
    ["always", "Always, because startup-mvp should never be used."],
    ["never", "Never, because reference apps should not influence architecture."]
  ]),
  "mastery/delivery-checklist-and-release-readiness": quiz("What turns a capstone from feature-complete into release-ready?", "discipline", "Exactly. QA, deployment docs, support-lane judgment, and proof discipline make it release-ready.", "Look for the answer about delivery discipline, not only finished screens.", [
    ["discipline", "QA, deployment docs, proof, and support-lane discipline."],
    ["screens", "A few more rendered screens with no verification."],
    ["speed", "Only faster build times."]
  ])
};

function attachQuiz(moduleSlug, lessonSlug, entry) {
  return {
    ...entry,
    quiz: QUIZ_BANK[getLessonKey(moduleSlug, lessonSlug)]
  };
}

const LESSONS = MODULES.flatMap(module =>
  module.lessons.map((entry, lessonIndex) => ({
    moduleSlug: module.slug,
    moduleTitle: module.title,
    moduleLevel: module.level,
    lessonIndex,
    ...attachQuiz(module.slug, entry.slug, entry)
  }))
);

function emptyLessonState(checkpointCount) {
  return {
    checks: Array.from({ length: checkpointCount }, () => false),
    complete: false,
    quizPassed: false
  };
}

export function getSchoolStorageKey() {
  return SCHOOL_STORAGE_KEY;
}

export function getLegacySchoolStorageKey() {
  return LEGACY_SCHOOL_STORAGE_KEY;
}

export function getSchoolStateVersion() {
  return SCHOOL_STATE_VERSION;
}

export function getModules() {
  return MODULES;
}

export function getModule(slug) {
  return MODULES.find(module => module.slug === slug) || null;
}

export function getLesson(moduleSlug, lessonSlug) {
  const module = getModule(moduleSlug);
  if (!module) return null;
  const entry = module.lessons.find(lessonEntry => lessonEntry.slug === lessonSlug);
  if (!entry) return null;
  return {
    module,
    lesson: attachQuiz(moduleSlug, lessonSlug, entry)
  };
}

export function getLessonKey(moduleSlug, lessonSlug) {
  return `${moduleSlug}/${lessonSlug}`;
}

export function getLessonCount() {
  return LESSONS.length;
}

export function getTrackSummary() {
  return [
    {
      title: "Beginner track",
      copy: "Start from literal zero: code, browsers, routes, forms, CSS, APIs, persistence, and the path to your first shipped FastScript app.",
      href: "/learn/beginner"
    },
    {
      title: "Professional track",
      copy: "Start from governed adoption, TS/JS migration, support-lane judgment, rollback, and product-shaped release discipline.",
      href: "/learn/professional"
    }
  ];
}

export function getModuleStats() {
  return [
    ["Levels", MODULES.length],
    ["Interactive lessons", LESSONS.length],
    ["Capstone tracks", CAPSTONES.length],
    ["Reference apps", 2]
  ];
}

export function getCapstones() {
  return CAPSTONES;
}

export function getPrevNext(moduleSlug, lessonSlug) {
  const index = LESSONS.findIndex(entry => entry.moduleSlug === moduleSlug && entry.slug === lessonSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? LESSONS[index - 1] : null,
    next: index < LESSONS.length - 1 ? LESSONS[index + 1] : null
  };
}

export function getResumeFallback() {
  const firstLesson = LESSONS[0];
  return firstLesson ? `/learn/${firstLesson.moduleSlug}/${firstLesson.slug}` : "/learn";
}

export function normalizeSchoolState(rawState) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const inputLessons = source.lessons && typeof source.lessons === "object" ? source.lessons : {};
  const normalized = {
    version: SCHOOL_STATE_VERSION,
    lessons: {},
    lastLesson: typeof source.lastLesson === "string" && source.lastLesson ? source.lastLesson : getResumeFallback()
  };

  for (const module of MODULES) {
    const legacyEntry = inputLessons[module.slug];
    for (const moduleLesson of module.lessons) {
      const lessonKey = getLessonKey(module.slug, moduleLesson.slug);
      const incoming = inputLessons[lessonKey] || (moduleLesson === module.lessons[0] ? legacyEntry : null);
      const nextEntry = emptyLessonState(moduleLesson.checkpoints.length);
      if (incoming && typeof incoming === "object") {
        const checks = Array.isArray(incoming.checks) ? incoming.checks : [];
        nextEntry.checks = nextEntry.checks.map((_, index) => Boolean(checks[index]));
        nextEntry.complete = Boolean(incoming.complete);
        nextEntry.quizPassed = Boolean(incoming.quizPassed || incoming.complete);
      }
      normalized.lessons[lessonKey] = nextEntry;
    }
  }

  const matched = normalized.lastLesson.match(/^\/learn\/([^/]+)\/([^/]+)$/);
  if (matched && !getLesson(matched[1], matched[2])) normalized.lastLesson = getResumeFallback();
  return normalized;
}

export function parseSchoolState(rawValue) {
  if (!rawValue) return normalizeSchoolState({});
  try {
    return normalizeSchoolState(JSON.parse(rawValue));
  } catch (_) {
    return normalizeSchoolState({});
  }
}

export function serializeSchoolState(state) {
  return JSON.stringify(normalizeSchoolState(state), null, 2);
}

export function getCompletedLessonCount(state) {
  const normalized = normalizeSchoolState(state);
  return Object.values(normalized.lessons).filter(entry => entry.complete).length;
}

export function getModuleCompletion(state, moduleSlug) {
  const normalized = normalizeSchoolState(state);
  const module = getModule(moduleSlug);
  if (!module) return { completed: 0, total: 0, percent: 0 };
  const total = module.lessons.length;
  const completed = module.lessons.filter(moduleLesson => normalized.lessons[getLessonKey(module.slug, moduleLesson.slug)]?.complete).length;
  return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}

export function renderModulePills(module) {
  return `
    <div class="learn-pill-row">
      <span class="learn-pill">${module.audience}</span>
      <span class="learn-pill">${module.time}</span>
      <span class="learn-pill">${module.lessons.length} lessons</span>
    </div>
  `;
}

export function renderLessonResources(lesson) {
  return (lesson.resources || []).map(([label, href]) => `
    <a class="docs-card-link" href="${href}">${label} &#8594;</a>
  `).join("");
}
