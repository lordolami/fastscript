const DEFAULT_PLANS = [
  { id: "plan_starter", name: "Starter", price: 49, seats: 5, support: "Email support" },
  { id: "plan_growth", name: "Growth", price: 149, seats: 15, support: "Slack support" },
  { id: "plan_scale", name: "Scale", price: 349, seats: 40, support: "Priority ops support" }
];

function nowIso() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value) {
  return String(value || "agency")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "agency";
}

function all(db, name) {
  return db.collection(name).all();
}

function get(db, name, key) {
  return db.collection(name).get(key) || null;
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

export function createActivity(db, agencyId, type, message, actorId = "system") {
  const event = {
    id: id("act"),
    agencyId,
    type,
    message,
    actorId,
    createdAt: nowIso()
  };
  return set(db, "activity", event.id, event);
}

export function queueNotificationJob(db, agencyId, kind, payload = {}) {
  const record = {
    id: id("job"),
    agencyId,
    kind,
    status: "queued",
    payload,
    createdAt: nowIso()
  };
  return set(db, "notificationJobs", record.id, record);
}

export function getMembershipForUser(db, userId) {
  return all(db, "memberships").find((entry) => entry.userId === userId && entry.status !== "revoked") || null;
}

export function getAgencyForUser(db, userId) {
  const membership = getMembershipForUser(db, userId);
  if (!membership) return null;
  return get(db, "agencies", membership.agencyId);
}

export function listPlans(db) {
  seedPlans(db);
  return all(db, "plans");
}

export function createAgency(db, owner, options = {}) {
  seedPlans(db);
  const name = options.name;
  const specialty = options.specialty || "Lifecycle marketing and product operations";
  const timezone = options.timezone || "UTC";
  const contactEmail = options.contactEmail || owner.email;

  const agency = {
    id: id("agency"),
    slug: slugify(name || owner.name),
    name: name || `${owner.name.split(" ")[0]} Client Ops`,
    specialty,
    timezone,
    contactEmail,
    createdAt: nowIso(),
    ownerId: owner.id
  };
  set(db, "agencies", agency.id, agency);

  const membership = {
    id: id("member"),
    agencyId: agency.id,
    userId: owner.id,
    email: owner.email,
    role: "owner",
    status: "active",
    createdAt: nowIso()
  };
  set(db, "memberships", membership.id, membership);

  const starter = DEFAULT_PLANS[0];
  const subscription = {
    id: id("subscription"),
    agencyId: agency.id,
    planId: starter.id,
    planName: starter.name,
    amount: starter.price,
    status: "active",
    seats: starter.seats,
    createdAt: nowIso()
  };
  set(db, "subscriptions", subscription.id, subscription);

  const clientRows = [
    {
      id: id("client"),
      agencyId: agency.id,
      name: "Northwind Labs",
      engagement: "Growth retainer",
      status: "active",
      monthlyRetainer: 4200,
      nextStep: "Present retention review on Friday",
      ownerId: owner.id,
      updatedAt: nowIso()
    },
    {
      id: id("client"),
      agencyId: agency.id,
      name: "Cinder Studio",
      engagement: "Launch sprint",
      status: "onboarding",
      monthlyRetainer: 1800,
      nextStep: "Collect creative brief and analytics access",
      ownerId: owner.id,
      updatedAt: nowIso()
    },
    {
      id: id("client"),
      agencyId: agency.id,
      name: "Maple Health",
      engagement: "Lifecycle audit",
      status: "proposal",
      monthlyRetainer: 950,
      nextStep: "Send revised proposal with CRM migration scope",
      ownerId: owner.id,
      updatedAt: nowIso()
    }
  ];
  for (const client of clientRows) set(db, "clients", client.id, client);

  const invoice = {
    id: id("invoice"),
    agencyId: agency.id,
    planId: starter.id,
    total: starter.price,
    status: "paid",
    issuedAt: nowIso(),
    summary: `${starter.name} plan invoice`
  };
  set(db, "invoices", invoice.id, invoice);

  createActivity(db, agency.id, "agency.created", `Agency ${agency.name} created`, owner.id);
  createActivity(db, agency.id, "client.seeded", `Seeded ${clientRows.length} client records`, owner.id);
  createActivity(db, agency.id, "billing.started", `Activated ${starter.name} plan`, owner.id);
  queueNotificationJob(db, agency.id, "weekly-client-recap", { agencyId: agency.id, clientCount: clientRows.length });

  return agency;
}

export function bootstrapAgency(db, user, agencyName) {
  const existing = getAgencyForUser(db, user.id);
  if (existing) return existing;
  return createAgency(db, user, { name: agencyName || `${user.name.split(" ")[0]} Client Ops` });
}

export function requireAgencyForUser(db, user) {
  const agency = getAgencyForUser(db, user.id) || bootstrapAgency(db, user);
  const membership = getMembershipForUser(db, user.id);
  return { agency, membership };
}

export function listAgencyData(db, agencyId) {
  const agency = get(db, "agencies", agencyId);
  const memberships = all(db, "memberships").filter((entry) => entry.agencyId === agencyId);
  const clients = all(db, "clients").filter((entry) => entry.agencyId === agencyId);
  const activities = all(db, "activity").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const invoices = all(db, "invoices").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
  const notificationJobs = all(db, "notificationJobs").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const subscription = all(db, "subscriptions").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
  const metrics = {
    teamMembers: memberships.filter((entry) => entry.status === "active").length,
    pendingInvites: memberships.filter((entry) => entry.status !== "active").length,
    activeClients: clients.filter((entry) => entry.status === "active" || entry.status === "onboarding").length,
    retainers: clients.filter((entry) => String(entry.engagement || "").toLowerCase().includes("retainer")).length,
    monthlyRetainers: clients.filter((entry) => entry.status === "active" || entry.status === "onboarding").reduce((sum, entry) => sum + Number(entry.monthlyRetainer || 0), 0),
    queuedJobs: notificationJobs.filter((entry) => entry.status === "queued").length
  };
  return { agency, memberships, clients, activities, invoices, notificationJobs, subscription, metrics, plans: listPlans(db) };
}

export function createClientRecord(db, agencyId, ownerId, body) {
  const client = {
    id: id("client"),
    agencyId,
    name: body.name,
    engagement: body.engagement || "Monthly retainer",
    status: body.status || "active",
    monthlyRetainer: Number(body.monthlyRetainer || 0),
    nextStep: body.nextStep || "Schedule kickoff and confirm reporting cadence",
    ownerId,
    updatedAt: nowIso()
  };
  set(db, "clients", client.id, client);
  createActivity(db, agencyId, "client.created", `Added client ${client.name}`, ownerId);
  return client;
}

export function inviteMemberRecord(db, agencyId, actor, body) {
  const membership = {
    id: id("member"),
    agencyId,
    userId: id("invite"),
    email: body.email,
    role: body.role || "strategist",
    status: "invited",
    createdAt: nowIso()
  };
  set(db, "memberships", membership.id, membership);
  createActivity(db, agencyId, "member.invited", `Invited ${body.email}`, actor.id);
  queueNotificationJob(db, agencyId, "team-invite", { email: body.email, role: membership.role });
  return membership;
}

export function updateAgencySettings(db, agencyId, body) {
  const current = get(db, "agencies", agencyId);
  const next = {
    ...current,
    name: body.name || current.name,
    specialty: body.specialty || current.specialty,
    timezone: body.timezone || current.timezone,
    contactEmail: body.contactEmail || current.contactEmail
  };
  set(db, "agencies", agencyId, next);
  return next;
}

export function upgradePlan(db, agencyId, actor, planId) {
  const plan = listPlans(db).find((entry) => entry.id === planId);
  if (!plan) throw new Error("Unknown plan");
  const subscription = {
    id: id("subscription"),
    agencyId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    status: "active",
    seats: plan.seats,
    createdAt: nowIso()
  };
  set(db, "subscriptions", subscription.id, subscription);
  const invoice = {
    id: id("invoice"),
    agencyId,
    planId: plan.id,
    total: plan.price,
    status: "paid",
    issuedAt: nowIso(),
    summary: `${plan.name} plan invoice`
  };
  set(db, "invoices", invoice.id, invoice);
  createActivity(db, agencyId, "plan.upgraded", `Moved to ${plan.name}`, actor.id);
  queueNotificationJob(db, agencyId, "billing-receipt", { invoiceId: invoice.id, planId: plan.id });
  return { plan, subscription, invoice };
}

export function summarizeOps(db) {
  const agencies = all(db, "agencies");
  const memberships = all(db, "memberships");
  const invoices = all(db, "invoices");
  const jobs = all(db, "notificationJobs");
  const clients = all(db, "clients");
  return {
    totals: {
      agencies: agencies.length,
      members: memberships.length,
      clients: clients.length,
      invoices: invoices.length,
      queuedJobs: jobs.filter((entry) => entry.status === "queued").length
    },
    recentJobs: jobs.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 8),
    recentInvoices: invoices.sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt))).slice(0, 8)
  };
}
