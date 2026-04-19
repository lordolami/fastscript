const BILLING_COLLECTIONS = [
  "billing_accounts",
  "checkout_sessions",
];

const PRICING_PLANS = [
  {
    id: "team",
    name: "Team",
    priceMonthly: 299,
    priceLabel: "$299/mo",
    audience: "Seed to Series A startups building model-backed products.",
    trialDays: 0,
    seats: 5,
    usageCaps: {
      datasets: 25,
      trainingJobs: 80,
      evalRuns: 200,
      modelDeployments: 15,
    },
    features: [
      "Permanent AI workflow console",
      "Datasets, training, evals, proof, and deployments",
      "5 team members",
      "Paid access from day one",
      "Paddle-backed billing boundary",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 999,
    priceLabel: "$999/mo",
    audience: "Teams with heavier experimentation, more members, and deployment governance needs.",
    trialDays: 0,
    seats: 15,
    usageCaps: {
      datasets: 100,
      trainingJobs: 300,
      evalRuns: 1200,
      modelDeployments: 60,
    },
    features: [
      "Everything in Team",
      "15 team members",
      "Higher usage ceilings",
      "Deployment governance priority",
      "Priority support and founder onboarding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceLabel: "Contact sales",
    audience: "Labs and companies needing private environments, custom controls, and direct support.",
    trialDays: 0,
    seats: null,
    usageCaps: {
      datasets: "custom",
      trainingJobs: "custom",
      evalRuns: "custom",
      modelDeployments: "custom",
    },
    features: [
      "Private environments",
      "Custom support and onboarding",
      "Manual sales and invoicing",
      "Custom governance and access policy",
    ],
  },
];

const DEFAULT_BILLING_SEED = {
  billing_accounts: [
    {
      id: "billing_u_1",
      userId: "u_1",
      email: "founder@fastscript.dev",
      planId: "growth",
      state: "active",
      trialState: "none",
      subscriptionStatus: "active",
      source: "seed",
      provider: "paddle",
      workspaceId: "workspace_core",
      seatsUsed: 2,
      seatsLimit: 15,
      usageSnapshot: {
        datasets: 2,
        trainingJobs: 3,
        evalRuns: 3,
        modelDeployments: 2,
      },
      trialEndsAt: "",
      startedAt: "2026-04-18T09:00:00.000Z",
      renewedAt: "2026-04-18T09:00:00.000Z",
      canceledAt: "",
      paddleCustomerId: "ctm_seed_founder",
      paddleSubscriptionId: "sub_seed_founder",
    },
  ],
  checkout_sessions: [],
};

function nowIso() {
  return new Date().toISOString();
}

function addDays(iso, days) {
  const start = iso ? new Date(iso) : new Date();
  start.setUTCDate(start.getUTCDate() + days);
  return start.toISOString();
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function touchCollections(db) {
  for (const name of BILLING_COLLECTIONS) db.collection(name);
}

function seedCollection(db, name, items) {
  const collection = db.collection(name);
  for (const item of items) {
    if (!collection.get(item.id)) collection.set(item.id, item);
  }
}

function listCollection(db, name) {
  ensureBillingSeed(db);
  return db.collection(name).all();
}

function getCollectionItem(db, name, id) {
  ensureBillingSeed(db);
  return db.collection(name).get(id) || null;
}

function setCollectionItem(db, name, value) {
  ensureBillingSeed(db);
  db.collection(name).set(value.id, value);
  return value;
}

function findAccountByUserId(db, userId) {
  return listCollection(db, "billing_accounts").find((entry) => entry.userId === userId) || null;
}

function planById(planId) {
  return PRICING_PLANS.find((plan) => plan.id === planId) || PRICING_PLANS[0];
}

function inferTrialState(account) {
  if (!account?.trialEndsAt) return account?.trialState || "none";
  if (new Date(account.trialEndsAt).getTime() > Date.now()) return account.trialState || "trialing";
  if (account.state === "trialing") return "expired";
  return account.trialState || "none";
}

export function seedBillingCollections(db) {
  touchCollections(db);
  for (const [name, items] of Object.entries(DEFAULT_BILLING_SEED)) seedCollection(db, name, items);
}

export function ensureBillingSeed(db) {
  seedBillingCollections(db);
}

export function getPricingPlans() {
  return PRICING_PLANS;
}

export function getBillingProviderConfig() {
  return {
    provider: "paddle",
    mode: process.env.PADDLE_API_KEY ? "configured" : "mock",
    vendorId: process.env.PADDLE_VENDOR_ID || "",
    environment: process.env.PADDLE_ENV || "sandbox",
    priceIds: {
      team: process.env.PADDLE_PRICE_TEAM || "",
      growth: process.env.PADDLE_PRICE_GROWTH || "",
    },
  };
}

export function ensureUserRecord(db, input = {}) {
  const users = db.collection("users");
  const email = String(input.email || "").trim().toLowerCase();
  const explicitId = String(input.userId || "").trim();
  if (explicitId && users.get(explicitId)) return users.get(explicitId);
  if (email) {
    const existing = users.all().find((entry) => String(entry.email || "").toLowerCase() === email);
    if (existing) return existing;
  }
  const user = {
    id: explicitId || uid("user"),
    name: String(input.name || "").trim() || "Builder",
    email: email || `${uid("builder")}@fastscript.dev`,
  };
  users.set(user.id, user);
  return user;
}

export function getBillingAccount(db, userId) {
  if (!userId) return null;
  const account = findAccountByUserId(db, userId);
  if (!account) return null;
  return {
    ...account,
    plan: planById(account.planId),
    trialState: inferTrialState(account),
  };
}

export function resolveEntitlementState(db, user) {
  ensureBillingSeed(db);
  if (!user?.id) {
    return {
      state: "anonymous",
      allowed: false,
      planId: "none",
      message: "Sign in and buy a plan to unlock the operator console.",
      nextAction: "buy",
      trialState: "none",
      account: null,
    };
  }
  const account = getBillingAccount(db, user.id);
  if (!account) {
    return {
      state: "no-plan",
      allowed: false,
      planId: "none",
      message: "Choose a paid plan to unlock FastScript.",
      nextAction: "buy",
      trialState: "none",
      account: null,
    };
  }

  const trialState = inferTrialState(account);
  if (account.state === "enterprise" || account.subscriptionStatus === "manual") {
    return {
      state: "enterprise",
      allowed: true,
      planId: account.planId,
      message: "Enterprise access is active.",
      nextAction: "open-platform",
      trialState,
      account,
    };
  }
  if (trialState === "expired" || account.state === "expired" || account.subscriptionStatus === "canceled") {
    return {
      state: "expired",
      allowed: false,
      planId: account.planId,
      message: "Your subscription has expired. Upgrade to continue.",
      nextAction: "upgrade",
      trialState: "expired",
      account,
    };
  }
  if (account.state === "active") {
    return {
      state: "active",
      allowed: true,
      planId: account.planId,
      message: `${account.plan?.name || "Paid"} access is active.`,
      nextAction: "open-platform",
      trialState,
      account,
    };
  }
  return {
    state: "no-plan",
    allowed: false,
    planId: account.planId || "none",
    message: "Choose a paid plan to unlock the full platform.",
    nextAction: "upgrade",
    trialState,
    account,
  };
}

export function getRouteAccessPolicy(pathname = "", method = "GET") {
  const path = String(pathname || "/");
  const upperMethod = String(method || "GET").toUpperCase();
  const publicPrefixes = [
    "/",
    "/buy",
    "/pricing",
    "/start-trial",
    "/why-fastscript",
    "/docs",
    "/learn",
    "/benchmarks",
    "/examples",
    "/showcase",
    "/roadmap",
    "/contact",
    "/ceo",
    "/enterprise",
    "/blog",
    "/license",
    "/privacy",
    "/terms",
    "/security",
    "/governance",
    "/changelog",
    "/playground",
  ];
  const publicApis = [
    "/api/auth",
    "/api/hello",
    "/api/upload",
    "/api/webhook",
    "/api/docs-search",
    "/api/billing/entitlement",
    "/api/billing/webhook",
  ];

  if (path === "/platform") return { level: "public", reason: "public-platform-overview" };
  if (path.startsWith("/private")) return { level: "auth", reason: "private-route" };
  if (path.startsWith("/account/billing")) return { level: "auth", reason: "billing-account" };
  if (path.startsWith("/api/billing/checkout") || path.startsWith("/api/billing/portal")) return { level: "auth", reason: "billing-management" };
  if (path.startsWith("/platform/")) return { level: "paid", reason: "operator-console" };
  if (path.startsWith("/api/platform/")) return { level: upperMethod === "GET" ? "paid" : "paid", reason: "platform-api" };
  if (publicApis.some((prefix) => path === prefix || path.startsWith(prefix + "/"))) return { level: "public", reason: "public-api" };
  if (publicPrefixes.some((prefix) => prefix === "/" ? path === "/" : path === prefix || path.startsWith(prefix + "/"))) {
    return { level: "public", reason: "marketing" };
  }
  return { level: "public", reason: "default" };
}

export function resolvePaymentGate(db, user, pathname = "", method = "GET") {
  const policy = getRouteAccessPolicy(pathname, method);
  const entitlement = resolveEntitlementState(db, user);
  if (policy.level === "public") return { allowed: true, policy, entitlement };
  if (policy.level === "auth") {
    return {
      allowed: Boolean(user?.id),
      policy,
      entitlement,
      redirectTo: user?.id ? null : `/buy?next=${encodeURIComponent(pathname || "/platform")}`,
    };
  }
  return {
    allowed: Boolean(user?.id) && entitlement.allowed,
    policy,
    entitlement,
    redirectTo: !user?.id
      ? `/buy?next=${encodeURIComponent(pathname || "/platform")}`
      : `/buy?next=${encodeURIComponent(pathname || "/platform")}&state=${encodeURIComponent(entitlement.state)}`,
  };
}

export function createCheckoutSession(db, { user, planId = "team", mode = "paid", nextPath = "/platform" }) {
  const plan = planById(planId);
  const createdAt = nowIso();
  const provider = getBillingProviderConfig();
  const account = getBillingAccount(db, user.id);
  const session = setCollectionItem(db, "checkout_sessions", {
    id: uid("checkout"),
    userId: user.id,
    planId: plan.id,
    mode,
    provider: provider.provider,
    providerMode: provider.mode,
    status: "completed",
    nextPath,
    createdAt,
    completedAt: createdAt,
    checkoutUrl: provider.mode === "configured"
      ? (process.env.PADDLE_CHECKOUT_BASE_URL || "/account/billing")
      : `/account/billing?session=${uid("paddle_demo")}`,
  });

  const normalizedMode = mode === "trial" ? "paid" : mode;
  const nextState = normalizedMode === "enterprise" || plan.id === "enterprise" ? "enterprise" : "active";
  const nextTrialState = "none";
  const existing = account || {
    id: uid("billing"),
    userId: user.id,
    email: user.email || "",
    workspaceId: "workspace_core",
    startedAt: createdAt,
    paddleCustomerId: "",
    paddleSubscriptionId: "",
  };
  const updatedAccount = setCollectionItem(db, "billing_accounts", {
    ...existing,
    planId: plan.id,
    state: nextState,
    trialState: nextTrialState,
    subscriptionStatus: nextState === "enterprise" ? "manual" : "active",
    source: provider.mode,
    provider: provider.provider,
    seatsUsed: existing.seatsUsed || 1,
    seatsLimit: plan.seats || existing.seatsLimit || 1,
    usageSnapshot: existing.usageSnapshot || {
      datasets: 0,
      trainingJobs: 0,
      evalRuns: 0,
      modelDeployments: 0,
    },
    trialEndsAt: "",
    renewedAt: createdAt,
    canceledAt: "",
  });

  return {
    session,
    account: getBillingAccount(db, updatedAccount.userId),
    redirectUrl: nextPath || "/platform",
    provider,
  };
}

export function createPortalSession(db, { user, action = "open", planId = "team" }) {
  const account = getBillingAccount(db, user?.id);
  if (!account) {
    return {
      account: null,
      action,
      redirectUrl: "/pricing",
      message: "No billing account exists yet.",
    };
  }
  const createdAt = nowIso();
  let next = account;
  if (action === "upgrade") {
    const plan = planById(planId);
    next = setCollectionItem(db, "billing_accounts", {
      ...account,
      planId: plan.id,
      state: "active",
      trialState: "none",
      subscriptionStatus: "active",
      renewedAt: createdAt,
      seatsLimit: plan.seats || account.seatsLimit,
    });
  } else if (action === "cancel") {
    next = setCollectionItem(db, "billing_accounts", {
      ...account,
      state: "expired",
      trialState: inferTrialState(account) === "trialing" ? "expired" : account.trialState,
      subscriptionStatus: "canceled",
      canceledAt: createdAt,
    });
  } else if (action === "reactivate") {
    next = setCollectionItem(db, "billing_accounts", {
      ...account,
      state: "active",
      subscriptionStatus: "active",
      canceledAt: "",
      renewedAt: createdAt,
    });
  }
  return {
    account: getBillingAccount(db, next.userId),
    action,
    redirectUrl: "/account/billing",
    message: action === "cancel"
      ? "Subscription access has been canceled."
      : action === "reactivate"
        ? "Subscription access has been reactivated."
        : action === "upgrade"
          ? "Plan updated successfully."
          : "Billing portal session ready.",
  };
}

export function applyBillingWebhook(db, event = {}) {
  const account = event.userId ? findAccountByUserId(db, event.userId) : null;
  if (!account) {
    return {
      ok: true,
      handled: false,
      reason: "account-not-found",
    };
  }
  const updated = setCollectionItem(db, "billing_accounts", {
    ...account,
    state: event.state || account.state,
    trialState: event.trialState || account.trialState,
    subscriptionStatus: event.subscriptionStatus || account.subscriptionStatus,
    renewedAt: nowIso(),
  });
  return {
    ok: true,
    handled: true,
    account: getBillingAccount(db, updated.userId),
  };
}

export function getPublicPricingNarrative() {
  return {
    kicker: "Pricing",
    title: "Built for startups shipping model-backed products.",
    copy: "FastScript is priced like core infrastructure: a paid operator system for serious teams, with a public demo on the main site and the real console unlocked after purchase.",
  };
}

export function getSellableWebsiteNarrative() {
  return {
    buyerValue: [
      "Cut the internal tooling tax around datasets, runs, evals, proof, and deployments.",
      "Reduce expensive model-release mistakes with lineage, readiness gates, and deployment history.",
      "Help teams ship better models faster by keeping the full workflow inside one runtime-owned system.",
    ],
    startupExamples: [
      {
        title: "Video model startup",
        copy: "Track datasets, training jobs, eval regressions, and promotion decisions in one place instead of across scripts and dashboards.",
      },
      {
        title: "Coding agent startup",
        copy: "Tie repo-task datasets, repair runs, evals, proof, and deployment readiness into one operator workflow.",
      },
      {
        title: "Voice model startup",
        copy: "Keep dataset quality, checkpoint lineage, evaluation loops, and deployment gates grounded in durable workflow memory.",
      },
    ],
    ycFlow: [
      { title: "What it is", copy: "FastScript is the structured substrate for AI-system workflows." },
      { title: "Why now", copy: "AI teams still live in fragmented tooling, weak proof discipline, and brittle deploy decisions." },
      { title: "Why defensible", copy: "FastScript owns the runtime, workflow memory, readiness gates, and deployment system of record." },
      { title: "How we make money", copy: "Team subscriptions, usage expansion, and enterprise controls." },
    ],
    moat: [
      "Runtime ownership instead of framework dependence.",
      "Workflow memory across datasets, runs, evals, proof, and deployments.",
      "Readiness and proof as promotion gates, not decorative reports.",
      "Workspace, audit, incident, and deployment history as infrastructure lock-in.",
    ],
  };
}

export function renderPlanPrice(plan) {
  return plan.priceLabel;
}
