export const DEFAULT_PLANS = [
  { id: "plan_starter", name: "Starter", price: 29, seats: 5, support: "Email support" },
  { id: "plan_growth", name: "Growth", price: 79, seats: 15, support: "Priority support" },
  { id: "plan_scale", name: "Scale", price: 199, seats: 50, support: "Shared Slack channel" }
];

function nowIso() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value) {
  return String(value || "workspace")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "workspace";
}

function all(db, name) {
  return db.collection(name).all();
}

function get(db, name, key) {
  return db.collection(name).get(key);
}

function set(db, name, key, value) {
  db.collection(name).set(key, value);
  return value;
}

export function seedPlans(db) {
  for (const plan of DEFAULT_PLANS) {
    if (!get(db, "plans", plan.id)) set(db, "plans", plan.id, plan);
  }
}

export function createActivity(db, workspaceId, type, message, actorId = "system") {
  const event = {
    id: id("act"),
    workspaceId,
    type,
    message,
    actorId,
    createdAt: nowIso()
  };
  set(db, "activity", event.id, event);
  return event;
}

export function queueNotificationJob(db, workspaceId, kind, payload = {}) {
  const record = {
    id: id("job"),
    workspaceId,
    kind,
    status: "queued",
    payload,
    createdAt: nowIso()
  };
  set(db, "notificationJobs", record.id, record);
  return record;
}

export function getMembershipForUser(db, userId) {
  return all(db, "memberships").find((entry) => entry.userId === userId && entry.status !== "revoked") || null;
}

export function getWorkspaceForUser(db, userId) {
  const membership = getMembershipForUser(db, userId);
  if (!membership) return null;
  return get(db, "workspaces", membership.workspaceId) || null;
}

export function createWorkspace(db, owner, { name, industry = "B2B SaaS", timezone = "UTC", notificationEmail } = {}) {
  seedPlans(db);
  const workspace = {
    id: id("ws"),
    slug: slugify(name),
    name: name || `${owner.name.split(" ")[0]}'s Workspace`,
    industry,
    timezone,
    notificationEmail: notificationEmail || owner.email,
    createdAt: nowIso(),
    ownerId: owner.id
  };
  set(db, "workspaces", workspace.id, workspace);
  const membershipId = id("mem");
  set(db, "memberships", membershipId, {
    id: membershipId,
    workspaceId: workspace.id,
    userId: owner.id,
    email: owner.email,
    role: "owner",
    status: "active",
    createdAt: nowIso()
  });
  const starter = DEFAULT_PLANS[0];
  const subscriptionId = id("sub");
  set(db, "subscriptions", subscriptionId, {
    id: subscriptionId,
    workspaceId: workspace.id,
    planId: starter.id,
    planName: starter.name,
    amount: starter.price,
    status: "active",
    seats: starter.seats,
    createdAt: nowIso()
  });
  const projectA = {
    id: id("proj"),
    workspaceId: workspace.id,
    name: "Launch onboarding",
    client: "Internal",
    status: "active",
    ownerId: owner.id,
    updatedAt: nowIso()
  };
  const projectB = {
    id: id("proj"),
    workspaceId: workspace.id,
    name: "Executive scorecard",
    client: "Founding team",
    status: "planning",
    ownerId: owner.id,
    updatedAt: nowIso()
  };
  set(db, "projects", projectA.id, projectA);
  set(db, "projects", projectB.id, projectB);
  const invoice = {
    id: id("inv"),
    workspaceId: workspace.id,
    planId: starter.id,
    total: starter.price,
    status: "paid",
    issuedAt: nowIso()
  };
  set(db, "invoices", invoice.id, invoice);
  createActivity(db, workspace.id, "workspace.created", `Workspace ${workspace.name} created`, owner.id);
  createActivity(db, workspace.id, "subscription.started", `Subscribed to ${starter.name}`, owner.id);
  return workspace;
}

export function bootstrapWorkspace(db, user, workspaceName) {
  seedPlans(db);
  const existing = getWorkspaceForUser(db, user.id);
  if (existing) return existing;
  return createWorkspace(db, user, { name: workspaceName || `${user.name.split(" ")[0]} Ops`, notificationEmail: user.email });
}

export function requireWorkspaceForUser(db, user) {
  const workspace = getWorkspaceForUser(db, user.id) || bootstrapWorkspace(db, user);
  const membership = getMembershipForUser(db, user.id);
  return { workspace, membership };
}

export function listPlans(db) {
  seedPlans(db);
  return all(db, "plans");
}

export function listWorkspaceData(db, workspaceId) {
  const workspace = get(db, "workspaces", workspaceId);
  const memberships = all(db, "memberships").filter((entry) => entry.workspaceId === workspaceId);
  const projects = all(db, "projects").filter((entry) => entry.workspaceId === workspaceId);
  const activities = all(db, "activity")
    .filter((entry) => entry.workspaceId === workspaceId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const invoices = all(db, "invoices")
    .filter((entry) => entry.workspaceId === workspaceId)
    .sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
  const notificationJobs = all(db, "notificationJobs")
    .filter((entry) => entry.workspaceId === workspaceId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const subscription = all(db, "subscriptions")
    .filter((entry) => entry.workspaceId === workspaceId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
  const metrics = {
    members: memberships.filter((entry) => entry.status === "active").length,
    pendingInvites: memberships.filter((entry) => entry.status !== "active").length,
    projects: projects.length,
    activeProjects: projects.filter((entry) => entry.status === "active").length,
    monthlyRevenue: subscription ? subscription.amount : 0,
    queuedJobs: notificationJobs.filter((entry) => entry.status === "queued").length
  };
  return { workspace, memberships, projects, activities, invoices, notificationJobs, subscription, metrics, plans: listPlans(db) };
}

export function createProjectRecord(db, workspaceId, ownerId, body) {
  const project = {
    id: id("proj"),
    workspaceId,
    name: body.name,
    client: body.client || "Internal",
    status: body.status || "active",
    ownerId,
    updatedAt: nowIso()
  };
  set(db, "projects", project.id, project);
  createActivity(db, workspaceId, "project.created", `Created project ${project.name}`, ownerId);
  return project;
}

export function inviteMemberRecord(db, workspaceId, actor, body) {
  const membership = {
    id: id("mem"),
    workspaceId,
    userId: id("invite"),
    email: body.email,
    role: body.role || "member",
    status: "invited",
    createdAt: nowIso()
  };
  set(db, "memberships", membership.id, membership);
  createActivity(db, workspaceId, "member.invited", `Invited ${body.email}`, actor.id);
  queueNotificationJob(db, workspaceId, "member-invite", { email: body.email, role: membership.role });
  return membership;
}

export function updateWorkspaceSettings(db, workspaceId, body) {
  const current = get(db, "workspaces", workspaceId);
  const next = {
    ...current,
    name: body.name || current.name,
    industry: body.industry || current.industry,
    timezone: body.timezone || current.timezone,
    notificationEmail: body.notificationEmail || current.notificationEmail
  };
  set(db, "workspaces", workspaceId, next);
  return next;
}

export function upgradePlan(db, workspaceId, actor, planId) {
  const plan = listPlans(db).find((entry) => entry.id === planId);
  if (!plan) throw new Error("Unknown plan");
  const subId = id("sub");
  const sub = {
    id: subId,
    workspaceId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    status: "active",
    seats: plan.seats,
    createdAt: nowIso()
  };
  set(db, "subscriptions", sub.id, sub);
  const invoice = {
    id: id("inv"),
    workspaceId,
    planId: plan.id,
    total: plan.price,
    status: "paid",
    issuedAt: nowIso()
  };
  set(db, "invoices", invoice.id, invoice);
  createActivity(db, workspaceId, "subscription.upgraded", `Upgraded to ${plan.name}`, actor.id);
  queueNotificationJob(db, workspaceId, "billing-receipt", { invoiceId: invoice.id, planId: plan.id });
  return { plan, subscription: sub, invoice };
}

export function summarizeAdmin(db) {
  const workspaces = all(db, "workspaces");
  const memberships = all(db, "memberships");
  const invoices = all(db, "invoices");
  const jobs = all(db, "notificationJobs");
  return {
    totals: {
      workspaces: workspaces.length,
      members: memberships.length,
      invoices: invoices.length,
      queuedJobs: jobs.filter((entry) => entry.status === "queued").length
    },
    recentJobs: jobs.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 8),
    recentInvoices: invoices.sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt))).slice(0, 8)
  };
}
