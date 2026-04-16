const SCHOOL_STORAGE_KEY = "fs-school-v1";

const MODULES = [
  {
    slug: "beginner",
    level: "Level 0",
    title: "Programming and web basics",
    audience: "Absolute beginners",
    time: "60-90 min",
    summary: "Start from zero: what code is, what the browser does, how pages render, and how user actions become app behavior.",
    outcomes: [
      "Explain what HTML, CSS, and JavaScript each do.",
      "Describe what a browser, route, and request are.",
      "Recognize how FastScript fits into the normal web model."
    ],
    lesson: {
      slug: "what-is-code",
      title: "What code, the browser, and the web actually do",
      summary: "Learn the mental model first so FastScript feels simple instead of magical.",
      minutes: 45,
      workedExample: {
        title: "A browser page in plain FastScript",
        code: `export default function Home() {
  return \`<main>
    <h1>Hello, school.</h1>
    <p>The browser turns this HTML string into a visible page.</p>
  </main>\`;
}`
      },
      exercise: {
        title: "Edit the first page",
        prompt: "Change the heading and add one paragraph that explains what a browser does.",
        starter: `export default function Home() {
  return \`<main>
    <h1>Hello, world.</h1>
  </main>\`;
}`,
        reference: `export default function Home() {
  return \`<main>
    <h1>Hello from FastScript School.</h1>
    <p>The browser receives HTML, CSS, and JavaScript and turns them into the page you can see and use.</p>
  </main>\`;
}`
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
      resources: [
        ["Open Playground", "/docs/playground"],
        ["Why FastScript", "/why-fastscript"]
      ]
    }
  },
  {
    slug: "foundations",
    level: "Level 1",
    title: "FastScript basics",
    audience: "Beginners and switchers",
    time: "45-75 min",
    summary: "Learn the .fs contract, the CLI, and the normal JS/TS authoring model FastScript expects.",
    outcomes: [
      "Install the CLI and create an app.",
      "Understand that .fs is a universal JS/TS container.",
      "Run dev, build, and inspect the app structure."
    ],
    lesson: {
      slug: "your-first-fs-file",
      title: "Your first .fs file without learning a second language",
      summary: "Use ordinary JavaScript and TypeScript inside .fs and see how FastScript treats it.",
      minutes: 40,
      workedExample: {
        title: "Strict TS in .fs",
        code: `type HeroProps = { title: string };

export default function Hero({ title }: HeroProps) {
  return \`<section>
    <h1>\${title}</h1>
    <p>Ordinary TypeScript can live directly inside .fs.</p>
  </section>\`;
}`
      },
      exercise: {
        title: "Make the page personal",
        prompt: "Change the prop shape so the component renders a title and a subtitle.",
        starter: `type HeroProps = { title: string };

export default function Hero({ title }: HeroProps) {
  return \`<section>
    <h1>\${title}</h1>
  </section>\`;
}`,
        reference: `type HeroProps = {
  title: string;
  subtitle: string;
};

export default function Hero({ title, subtitle }: HeroProps) {
  return \`<section>
    <h1>\${title}</h1>
    <p>\${subtitle}</p>
  </section>\`;
}`
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
      resources: [
        ["Real-world adoption", "/docs/adoption"],
        ["Agency Ops guide", "/docs/agency-ops"]
      ]
    }
  },
  {
    slug: "fullstack",
    level: "Level 2",
    title: "Pages, routes, APIs, and app flow",
    audience: "All learners",
    time: "75-105 min",
    summary: "Move from static pages to full-stack thinking: rendered routes, APIs, middleware, auth/session, and jobs.",
    outcomes: [
      "Build pages and API routes in one app boundary.",
      "Understand middleware and session flow at a practical level.",
      "See how product workflows connect frontend and backend together."
    ],
    lesson: {
      slug: "pages-routes-and-loaders",
      title: "Pages, routes, loaders, APIs, middleware, and jobs in one runtime",
      summary: "This is where FastScript becomes obviously full-stack instead of just a page engine.",
      minutes: 55,
      workedExample: {
        title: "Page plus API mental model",
        code: `export async function load(ctx) {
  return {
    route: ctx.pathname,
    signedIn: Boolean(ctx.user)
  };
}

export default function Dashboard({ route, signedIn }) {
  return \`<main>
    <h1>\${route}</h1>
    <p>Signed in: \${signedIn ? "yes" : "no"}</p>
  </main>\`;
}

export async function POST(ctx, h) {
  return h.json({ ok: true, route: ctx.pathname });
}`
      },
      exercise: {
        title: "Turn a page into a full-stack feature",
        prompt: "Add one loader field and one API JSON field that describe the current lesson route.",
        starter: `export async function load(ctx) {
  return {};
}

export default function LessonPage() {
  return \`<main><h1>Lesson</h1></main>\`;
}

export async function POST(ctx, h) {
  return h.json({ ok: true });
}`,
        reference: `export async function load(ctx) {
  return {
    pathname: ctx.pathname
  };
}

export default function LessonPage({ pathname }) {
  return \`<main>
    <h1>Lesson</h1>
    <p>Current route: \${pathname}</p>
  </main>\`;
}

export async function POST(ctx, h) {
  return h.json({
    ok: true,
    route: ctx.pathname
  });
}`
      },
      concepts: [
        "Pages render what users see.",
        "API routes handle mutations and data operations.",
        "Middleware enforces rules such as auth or redirects before route logic runs.",
        "Jobs handle async work that should not block the user request."
      ],
      checkpoints: [
        "I can explain the difference between a page route and an API route.",
        "I know where middleware fits in the request lifecycle.",
        "I understand why jobs exist instead of stuffing every side effect into a page request."
      ],
      mistakes: [
        "Putting every mutation directly in page rendering code.",
        "Treating auth as only a UI concern instead of a request boundary concern.",
        "Ignoring jobs until the app becomes slow or unreliable."
      ],
      realUse: [
        "Dashboards, admin tools, and SaaS apps all depend on this page-plus-API model.",
        "Agency Ops uses pages, APIs, middleware, billing actions, and jobs in one runtime boundary."
      ],
      resources: [
        ["Team Dashboard baseline", "/docs/team-dashboard-saas"],
        ["Agency Ops guide", "/docs/agency-ops"]
      ]
    }
  },
  {
    slug: "databases",
    level: "Level 3",
    title: "Data, persistence, and safety",
    audience: "Builders and operators",
    time: "60-90 min",
    summary: "Teach persistence clearly without turning the school into a database war. Learn data flow, migrations, seeds, and safe app-state thinking.",
    outcomes: [
      "Explain what persistence means in a full-stack app.",
      "Understand migrations, seed data, and controlled change.",
      "Know how app state, user input, and durable storage fit together."
    ],
    lesson: {
      slug: "state-and-persistence",
      title: "Persistence without confusion: app state, storage, and database concepts",
      summary: "Learn what must survive after refresh, restart, and deployment, and why that changes architecture.",
      minutes: 50,
      workedExample: {
        title: "Reading persisted data in a loader",
        code: `export async function load(ctx) {
  const invoices = await ctx.db.list("invoices");
  return {
    count: invoices.length
  };
}

export default function BillingOverview({ count }) {
  return \`<section>
    <h1>Invoices</h1>
    <p>Total records: \${count}</p>
  </section>\`;
}`
      },
      exercise: {
        title: "Describe durable data clearly",
        prompt: "Add one loader field that would matter after the app restarts, such as invoice count or user count.",
        starter: `export async function load(ctx) {
  return {
    status: "draft"
  };
}

export default function DataPage({ status }) {
  return \`<section><p>\${status}</p></section>\`;
}`,
        reference: `export async function load(ctx) {
  const userCount = await ctx.db.count("users");
  return {
    userCount
  };
}

export default function DataPage({ userCount }) {
  return \`<section>
    <p>Users stored durably: \${userCount}</p>
  </section>\`;
}`
      },
      concepts: [
        "State in memory disappears; persisted data survives requests and restarts.",
        "Migrations describe controlled schema changes over time.",
        "Seed data creates a trustworthy baseline for development and demos.",
        "FastScript teaches database thinking as part of app architecture, not as trivia."
      ],
      checkpoints: [
        "I know why durable data is different from temporary in-memory state.",
        "I understand what migrations and seed scripts are for.",
        "I can explain persistence without tying the idea to one vendor."
      ],
      mistakes: [
        "Assuming local variables survive after a request finishes.",
        "Changing data models without migrations or rollback thinking.",
        "Treating seed data like fake fluff instead of a reproducible app baseline."
      ],
      realUse: [
        "Billing, users, memberships, and audit trails all depend on durable data.",
        "The support matrix governs infrastructure-specific lanes while the concept stays universal."
      ],
      resources: [
        ["Deploy guide", "/docs/latest"],
        ["Support matrix", "/docs/support"]
      ]
    }
  },
  {
    slug: "styling",
    level: "Level 4",
    title: "CSS, UI patterns, and product interfaces",
    audience: "Beginners and frontend-focused learners",
    time: "60-90 min",
    summary: "Teach CSS, layout, spacing, tokens, and interface decisions so learners can build polished product surfaces instead of only working logic demos.",
    outcomes: [
      "Use CSS deliberately instead of guessing at spacing and layout.",
      "Understand reusable interface patterns in FastScript apps.",
      "Ship product-looking pages, not raw prototype fragments."
    ],
    lesson: {
      slug: "css-and-ui-systems",
      title: "CSS and UI systems that make product work feel real",
      summary: "Learn how layout, spacing, hierarchy, and reuse turn basic routes into interfaces people can trust.",
      minutes: 45,
      workedExample: {
        title: "A small design system slice",
        code: `.card {
  padding: 24px;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  background: var(--c-bg1);
}

.card h2 {
  margin-bottom: 8px;
}

.card p {
  color: var(--c-muted);
}`
      },
      exercise: {
        title: "Improve hierarchy and spacing",
        prompt: "Add spacing and muted body text so the card feels intentional instead of raw.",
        starter: `.card {
  border: 1px solid var(--c-border);
}

.card p {
}`,
        reference: `.card {
  padding: 24px;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  background: var(--c-bg1);
}

.card p {
  margin-top: 8px;
  color: var(--c-muted);
  line-height: 1.6;
}`
      },
      concepts: [
        "CSS controls layout, spacing, color, type, and interaction feel.",
        "Reusable classes and tokens beat random one-off styling decisions.",
        "Good product UI communicates trust and hierarchy before the user clicks anything.",
        "FastScript works with CSS as a normal web primitive, not as an afterthought."
      ],
      checkpoints: [
        "I can explain why spacing and hierarchy matter in product interfaces.",
        "I know how to improve a raw block into a reusable card pattern.",
        "I understand that CSS is a core full-stack skill, not optional decoration."
      ],
      mistakes: [
        "Treating CSS as memorized magic instead of layout and communication rules.",
        "Using visual noise where consistent spacing and structure would solve the problem.",
        "Avoiding interface polish until the very end of the build."
      ],
      realUse: [
        "Dashboards, settings screens, billing pages, and docs all depend on clear hierarchy.",
        "The school itself should model product-quality CSS rather than abstract teaching alone."
      ],
      resources: [
        ["Styling primitives", "/docs/primitives"],
        ["Examples", "/examples"]
      ]
    }
  },
  {
    slug: "shipping",
    level: "Level 5",
    title: "Build, QA, deploy, and production discipline",
    audience: "All learners",
    time: "60-90 min",
    summary: "Teach how real apps get validated and shipped, not just how they run once on localhost.",
    outcomes: [
      "Use build and validation as normal development habits.",
      "Understand the role of smoke checks, QA gates, and deploy handoff.",
      "Know what gets deployed on adapters and custom hosts."
    ],
    lesson: {
      slug: "build-qa-deploy",
      title: "Build, validate, deploy: the shipping loop that makes FastScript serious",
      summary: "A product is not done when it renders. It is done when it can be checked, built, and shipped with confidence.",
      minutes: 50,
      workedExample: {
        title: "A practical shipping loop",
        code: `fastscript dev
npm run validate
npm run qa:all
fastscript deploy --target cloudflare`
      },
      exercise: {
        title: "Write your own release checklist",
        prompt: "Add build, validation, and deploy steps in the order you would trust for a real project.",
        starter: `# release checklist
1. Run the app
2. ???
3. Deploy`,
        reference: `# release checklist
1. Run local development and confirm the feature works.
2. Run validate to catch structure, build, and contract problems.
3. Run qa:all before release.
4. Generate the deploy target or custom-host handoff.
5. Smoke-check the live routes after deployment.`
      },
      concepts: [
        "Build output is a deployable product artifact, not just a local side effect.",
        "QA gates protect confidence across formatting, lint, typecheck, tests, smoke, and proof work.",
        "Adapters exist for convenience, but the runtime can also hand off to custom hosts.",
        "Shipping discipline is part of FastScript mastery, not a separate ops-only world."
      ],
      checkpoints: [
        "I know the difference between dev, build, validate, and full QA.",
        "I understand that deployment starts from the built app artifact, not from guesses.",
        "I can explain how custom-host handoff differs from adapter-specific deploy files."
      ],
      mistakes: [
        "Thinking a successful local render means the release is safe.",
        "Skipping validation because the feature looks simple.",
        "Confusing adapter files with the whole deployable application."
      ],
      realUse: [
        "Agency Ops and startup-mvp both rely on this build-and-ship discipline.",
        "The same loop prepares you for Node, Vercel, Cloudflare, and custom-host deployment paths."
      ],
      resources: [
        ["Current docs track", "/docs/latest"],
        ["Benchmarks", "/benchmarks"]
      ]
    }
  },
  {
    slug: "professional",
    level: "Level 6",
    title: "Professional FastScript thinking",
    audience: "Experienced developers",
    time: "45-75 min",
    summary: "Teach experienced teams how to reason about runtime boundaries, support claims, and real product adoption instead of treating FastScript like a gimmick.",
    outcomes: [
      "Think in governed lanes, not vibes.",
      "Adopt FastScript with compatibility discipline.",
      "Translate existing production instincts into the FastScript model."
    ],
    lesson: {
      slug: "from-ts-thinking-to-fs-thinking",
      title: "From TypeScript habits to FastScript production habits",
      summary: "This lesson is for professionals who already know TS/JS but need the right FastScript mental model.",
      minutes: 40,
      workedExample: {
        title: "Same app logic, smaller surface area",
        code: `export async function load(ctx) {
  return {
    env: ctx.runtime,
    user: ctx.user ?? null
  };
}

export default function Settings({ env, user }) {
  return \`<section>
    <h1>Runtime: \${env}</h1>
    <p>User: \${user ? user.email : "anonymous"}</p>
  </section>\`;
}`
      },
      exercise: {
        title: "Describe the runtime boundary",
        prompt: "Add one comment or line that explains what belongs inside the FastScript app boundary.",
        starter: `export default function Notes() {
  return \`<section>
    <p>App boundary notes</p>
  </section>\`;
}`,
        reference: `export default function Notes() {
  return \`<section>
    <p>Pages, APIs, middleware, jobs, and shared logic can live in one FastScript app boundary when the support matrix covers the lanes we need.</p>
  </section>\`;
}`
      },
      concepts: [
        "FastScript is a runtime pipeline, not just a prettier file extension.",
        "The support matrix is part of the product contract, not optional paperwork.",
        "Teams should expand only through proven or intentionally-governed lanes.",
        "FastScript mastery includes knowing what not to promise yet."
      ],
      checkpoints: [
        "I can explain FastScript without reducing it to syntax sugar.",
        "I know where /docs/support fits into technical decision-making.",
        "I understand that production discipline includes claim discipline."
      ],
      mistakes: [
        "Assuming every JS ecosystem shape is automatically production-proven.",
        "Selling framework support before checking the matrix.",
        "Treating adoption as a rewrite instead of a governed expansion."
      ],
      realUse: [
        "This is the lesson that helps senior engineers adopt FastScript responsibly on live products.",
        "It also sets up the migration workflow that follows next."
      ],
      resources: [
        ["Support matrix", "/docs/support"],
        ["Real-world adoption", "/docs/adoption"]
      ]
    }
  },
  {
    slug: "migration",
    level: "Level 7",
    title: "Secure TS/JS migration to .fs",
    audience: "Professional teams",
    time: "60-90 min",
    summary: "Teach the safe migration loop: dry runs, diff previews, manifests, rollback, and governed follow-up.",
    outcomes: [
      "Run migration safely before touching tracked files.",
      "Use manifests and rollback instead of hope.",
      "Treat compatibility gaps as product work, not silent hacks."
    ],
    lesson: {
      slug: "dry-run-convert-rollback",
      title: "Dry-run, convert, rollback: the secure path from TS/JS to .fs",
      summary: "FastScript migration is strongest when teams can inspect and reverse it confidently.",
      minutes: 55,
      workedExample: {
        title: "The safe migration flow",
        code: `npm run migrate -- app --dry-run
npm run migrate -- app
npm run migrate:rollback`
      },
      exercise: {
        title: "Write the migration policy",
        prompt: "Add the step where a professional team checks support before promising the converted slice.",
        starter: `1. Dry-run the migration
2. Convert the files
3. Ship it`,
        reference: `1. Dry-run the migration and inspect the diff preview.
2. Cross-check the lanes the converted code depends on in /docs/support.
3. Run the real conversion only after the diff is trusted.
4. Use rollback if confidence drops.
5. Log any valid JS/TS failure in .fs as compatibility work.`
      },
      concepts: [
        "Dry-run protects confidence before any tracked source changes.",
        "Manifest output records what changed and makes rollback predictable.",
        "Rollback is part of a trustworthy migration story, not a sign of failure.",
        "Secure migration means compatibility visibility, not blind rename success."
      ],
      checkpoints: [
        "I understand why dry-run comes before real conversion.",
        "I know what the manifest and rollback flow are for.",
        "I can explain how migration and governed compatibility fit together."
      ],
      mistakes: [
        "Running conversion on production code without inspection.",
        "Treating a rename as proof the whole runtime shape is safe.",
        "Ignoring a compatibility gap because the converted code mostly looks right."
      ],
      realUse: [
        "This is the path professionals use to move existing codebases into FastScript incrementally.",
        "It protects trust while making real adoption possible."
      ],
      resources: [
        ["Interop guide", "/docs/interop"],
        ["Real-world adoption", "/docs/adoption"]
      ]
    }
  },
  {
    slug: "mastery",
    level: "Level 8",
    title: "Capstones and FastScript mastery",
    audience: "Graduates",
    time: "90-120 min",
    summary: "Bring everything together through product-shaped capstones so learners leave able to ship real FastScript systems, not just finish lessons.",
    outcomes: [
      "Plan and ship a real FastScript app end to end.",
      "Use the right starter or proving-ground app deliberately.",
      "Operate inside the full FastScript contract with confidence."
    ],
    lesson: {
      slug: "capstone-product-architecture",
      title: "Capstone architecture: from lesson knowledge to real FastScript products",
      summary: "Mastery means you can choose the right starting point, structure the app correctly, and ship with governed confidence.",
      minutes: 65,
      workedExample: {
        title: "The capstone path",
        code: `fastscript create my-product --template startup-mvp
npm run validate
npm run qa:all
fastscript deploy --target node`
      },
      exercise: {
        title: "Choose the right baseline",
        prompt: "Write one sentence for when to use startup-mvp and one for when to study agency-ops.",
        starter: `startup-mvp:
agency-ops:`,
        reference: `startup-mvp: Use it when you want the stable public greenfield baseline for real full-stack product work.
agency-ops: Use it when you want the clearest strict-TypeScript-in-.fs proving-ground app to study and adapt.`
      },
      concepts: [
        "Mastery is about architecture, delivery, and judgment, not just knowing commands.",
        "Capstones should force pages, APIs, styling, data, jobs, QA, and deployment to work together.",
        "The support matrix remains the source of truth for lane-level promises.",
        "FastScript mastery includes knowing how to keep learning from proofs, examples, and governed gaps."
      ],
      checkpoints: [
        "I can choose the right baseline for a new FastScript product.",
        "I can describe the full stack of a serious FastScript app from UI to deploy.",
        "I know how to ship while staying inside the compatibility contract."
      ],
      mistakes: [
        "Confusing lesson completion with product readiness.",
        "Skipping capstones because the concepts felt understandable in isolation.",
        "Choosing architecture by hype instead of proof and app shape."
      ],
      realUse: [
        "This is the bridge from school content to real product delivery inside FastScript.",
        "A learner who finishes here should be able to build serious full-stack systems with confidence."
      ],
      resources: [
        ["Team Dashboard SaaS", "/docs/team-dashboard-saas"],
        ["Agency Ops guide", "/docs/agency-ops"]
      ]
    }
  }
];

function flattenLessons() {
  return MODULES.map((module) => ({
    moduleSlug: module.slug,
    moduleTitle: module.title,
    level: module.level,
    ...module.lesson
  }));
}

const LESSONS = flattenLessons();

export function getSchoolStorageKey() {
  return SCHOOL_STORAGE_KEY;
}

export function getModules() {
  return MODULES;
}

export function getModule(slug) {
  return MODULES.find((module) => module.slug === slug) || null;
}

export function getLesson(moduleSlug, lessonSlug) {
  const module = getModule(moduleSlug);
  if (!module || module.lesson.slug !== lessonSlug) return null;
  return {
    module,
    lesson: module.lesson
  };
}

export function getLessonCount() {
  return LESSONS.length;
}

export function getTrackSummary() {
  return [
    {
      title: "Beginner track",
      copy: "Start at zero and learn the web, FastScript basics, CSS, APIs, data, and shipping in the order a real beginner actually needs.",
      href: "/learn/beginner"
    },
    {
      title: "Professional track",
      copy: "Learn safe TS/JS migration, support-matrix decisions, rollback discipline, and production adoption without guessing.",
      href: "/learn/professional"
    }
  ];
}

export function getModuleStats() {
  return [
    ["Levels", String(MODULES.length)],
    ["Interactive lessons", String(LESSONS.length)],
    ["Signup required", "0"],
    ["Outcome", "FastScript mastery"]
  ];
}

export function getPrevNext(moduleSlug, lessonSlug) {
  const index = LESSONS.findIndex((entry) => entry.moduleSlug === moduleSlug && entry.slug === lessonSlug);
  if (index === -1) return { prev: null, next: null };
  const prev = index > 0 ? LESSONS[index - 1] : null;
  const next = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;
  return { prev, next };
}

export function getResumeFallback() {
  const first = LESSONS[0];
  return `/learn/${first.moduleSlug}/${first.slug}`;
}

export function renderModulePills(module) {
  return `
    <div class="tag-row">
      <span class="tag">${module.level}</span>
      <span class="tag">${module.audience}</span>
      <span class="tag">${module.time}</span>
    </div>
  `;
}

export function renderLessonResources(lesson) {
  return (lesson.resources || []).map(([label, href]) => `<a class="docs-card-link" href="${href}">${label} &#8594;</a>`).join("");
}
