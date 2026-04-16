const DEFAULT_PLANS = [
  { id: "plan_starter", name: "Starter", price: 49, seats: 5, support: "Email support" },
  { id: "plan_growth", name: "Growth", price: 149, seats: 15, support: "Slack support" },
  { id: "plan_scale", name: "Scale", price: 349, seats: 40, support: "Priority ops support" }
];

function nowIso() {
  return new Date().toISOString();
}

function shiftIso(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
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

function displayNameFromEmail(email = "") {
  const local = String(email || "team-member").split("@")[0].replace(/[^a-z0-9]+/gi, " ").trim();
  if (!local) return "Team Member";
  return local.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function buildInvoiceRecord(agencyId, planId, total, status, summary, issuedAt, dueAt, reminder = {}) {
  return {
    id: id("invoice"),
    agencyId,
    planId,
    total,
    status,
    issuedAt: issuedAt || nowIso(),
    dueAt: dueAt || shiftIso(7),
    summary,
    reminderStatus: reminder.reminderStatus || (status === "paid" ? "settled" : "idle"),
    reminderCount: Number(reminder.reminderCount || 0),
    lastReminderAt: reminder.lastReminderAt || "",
    nextReminderAt: reminder.nextReminderAt || "",
    reminderLabel: reminder.reminderLabel || (status === "overdue" ? "Needs follow-up" : "Watching due date"),
    reminderChannel: reminder.reminderChannel || "email"
  };
}

export function getAgencyOpsConfig(env = process.env) {
  const fromEnv = (key, fallback = "") => {
    const value = env[key];
    if (!value) return fallback;
    return String(value);
  };
  return {
    appName: fromEnv("AGENCY_OPS_APP_NAME", "Agency Ops SaaS"),
    supportEmail: fromEnv("AGENCY_OPS_SUPPORT_EMAIL", "ops@agencyops.local"),
    notifyFrom: fromEnv("AGENCY_OPS_NOTIFY_FROM", "notifications@agencyops.local"),
    primaryRegion: fromEnv("AGENCY_OPS_PRIMARY_REGION", "global"),
    environment: fromEnv("NODE_ENV", "development")
  };
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

export function queueNotificationJob(db, agencyId, kind, payload = {}, options = {}) {
  const record = {
    id: id("job"),
    agencyId,
    kind,
    status: options.status || "queued",
    payload,
    createdAt: options.createdAt || nowIso(),
    deliveredAt: options.deliveredAt || ""
  };
  return set(db, "notificationJobs", record.id, record);
}

export function createWorkItemRecord(db, agencyId, actorId, body = {}) {
  const assigneeMembershipId = body.assigneeMembershipId || "";
  const assignee = assigneeMembershipId ? get(db, "memberships", assigneeMembershipId) : null;
  const record = {
    id: id("work"),
    agencyId,
    clientId: body.clientId || null,
    clientName: body.clientName || "Internal ops",
    title: body.title || "Follow up on delivery scope",
    lane: body.lane || "delivery",
    priority: body.priority || "medium",
    status: body.status || "queued",
    dueLabel: body.dueLabel || "This week",
    ownerId: actorId,
    assigneeMembershipId: assigneeMembershipId || "",
    assigneeName: assignee?.name || "",
    assigneeEmail: assignee?.email || "",
    updatedAt: nowIso()
  };
  set(db, "workItems", record.id, record);
  createActivity(db, agencyId, "work-item.created", `Queued work item: ${record.title}`, actorId);
  return record;
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
    name: owner.name,
    email: owner.email,
    role: "owner",
    status: "active",
    createdAt: nowIso()
  };
  set(db, "memberships", membership.id, membership);

  const seededMembers = [
    {
      id: id("member"),
      agencyId: agency.id,
      userId: id("user"),
      name: "Kemi Delivery",
      email: "kemi@northstarops.dev",
      role: "operator",
      status: "active",
      createdAt: nowIso()
    },
    {
      id: id("member"),
      agencyId: agency.id,
      userId: id("user"),
      name: "David Finance",
      email: "david@northstarops.dev",
      role: "finance",
      status: "active",
      createdAt: nowIso()
    }
  ];
  for (const item of seededMembers) set(db, "memberships", item.id, item);

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

  const workItems = [
    {
      id: id("work"),
      agencyId: agency.id,
      clientId: clientRows[0].id,
      clientName: clientRows[0].name,
      title: "Prepare Q2 retention forecast and budget notes",
      lane: "strategy",
      priority: "high",
      status: "at-risk",
      dueLabel: "Due tomorrow",
      ownerId: owner.id,
      assigneeMembershipId: membership.id,
      assigneeName: membership.name,
      assigneeEmail: membership.email,
      updatedAt: nowIso()
    },
    {
      id: id("work"),
      agencyId: agency.id,
      clientId: clientRows[1].id,
      clientName: clientRows[1].name,
      title: "Finalize onboarding checklist and analytics access",
      lane: "onboarding",
      priority: "medium",
      status: "queued",
      dueLabel: "Due this week",
      ownerId: owner.id,
      assigneeMembershipId: seededMembers[0].id,
      assigneeName: seededMembers[0].name,
      assigneeEmail: seededMembers[0].email,
      updatedAt: nowIso()
    },
    {
      id: id("work"),
      agencyId: agency.id,
      clientId: clientRows[2].id,
      clientName: clientRows[2].name,
      title: "Send lifecycle audit scope revision and invoice note",
      lane: "finance",
      priority: "medium",
      status: "in-review",
      dueLabel: "Waiting on approval",
      ownerId: owner.id,
      assigneeMembershipId: "",
      assigneeName: "",
      assigneeEmail: "",
      updatedAt: nowIso()
    }
  ];
  for (const item of workItems) set(db, "workItems", item.id, item);

  const invoices = [
    buildInvoiceRecord(
      agency.id,
      starter.id,
      starter.price,
      "paid",
      `${starter.name} plan invoice`,
      shiftIso(-21),
      shiftIso(-14),
      {
        reminderStatus: "settled",
        reminderLabel: "No reminder needed",
        reminderCount: 0
      }
    ),
    buildInvoiceRecord(
      agency.id,
      starter.id,
      1800,
      "due",
      "Cinder Studio onboarding invoice",
      shiftIso(-2),
      shiftIso(3),
      {
        reminderStatus: "queued",
        nextReminderAt: shiftIso(1),
        reminderLabel: "Queued for tomorrow",
        reminderCount: 1
      }
    ),
    buildInvoiceRecord(
      agency.id,
      starter.id,
      950,
      "overdue",
      "Maple Health audit follow-up invoice",
      shiftIso(-12),
      shiftIso(-5),
      {
        reminderStatus: "delivered",
        lastReminderAt: shiftIso(-1),
        reminderLabel: "Last reminder sent yesterday",
        reminderCount: 2
      }
    )
  ];
  for (const invoice of invoices) set(db, "invoices", invoice.id, invoice);

  createActivity(db, agency.id, "agency.created", `Agency ${agency.name} created`, owner.id);
  createActivity(db, agency.id, "client.seeded", `Seeded ${clientRows.length} client records`, owner.id);
  createActivity(db, agency.id, "ops.seeded", `Seeded ${workItems.length} delivery queue items`, owner.id);
  createActivity(db, agency.id, "billing.started", `Activated ${starter.name} plan`, owner.id);
  createActivity(db, agency.id, "invoice-reminder.seeded", `Queued reminder coverage for ${invoices[1].summary}`, owner.id);
  createActivity(db, agency.id, "invoice-reminder.seeded", `Logged delivered reminder for ${invoices[2].summary}`, owner.id);

  queueNotificationJob(db, agency.id, "weekly-client-recap", { agencyId: agency.id, clientCount: clientRows.length });
  queueNotificationJob(
    db,
    agency.id,
    "invoice-reminder",
    { invoiceId: invoices[1].id, invoiceSummary: invoices[1].summary, mode: "queue" },
    { status: "queued" }
  );
  queueNotificationJob(
    db,
    agency.id,
    "invoice-reminder",
    { invoiceId: invoices[2].id, invoiceSummary: invoices[2].summary, mode: "send" },
    { status: "delivered", createdAt: shiftIso(-1), deliveredAt: shiftIso(-1) }
  );

  return agency;
}

export function bootstrapAgency(db, user, agencyName = "") {
  const existing = getAgencyForUser(db, user.id);
  if (existing) return existing;
  return createAgency(db, user, { name: agencyName || `${user.name.split(" ")[0]} Client Ops` });
}

export function requireAgencyForUser(db, user) {
  const agency = getAgencyForUser(db, user.id) || bootstrapAgency(db, user);
  const membership = getMembershipForUser(db, user.id);
  return { agency, membership };
}

export function summarizeWorkload(memberships, workItems) {
  const activeMembers = (memberships || []).filter((entry) => entry.status === "active");
  return activeMembers.map((member) => {
    const assigned = (workItems || []).filter((item) => item.assigneeMembershipId === member.id && item.status !== "done");
    return {
      membershipId: member.id,
      name: member.name || displayNameFromEmail(member.email),
      email: member.email,
      role: member.role,
      assignedCount: assigned.length,
      atRiskCount: assigned.filter((item) => item.status === "at-risk").length,
      queuedCount: assigned.filter((item) => item.status === "queued").length
    };
  });
}

export function listAgencyData(db, agencyId) {
  const agency = get(db, "agencies", agencyId);
  const memberships = all(db, "memberships").filter((entry) => entry.agencyId === agencyId);
  const clients = all(db, "clients").filter((entry) => entry.agencyId === agencyId);
  const workItems = all(db, "workItems").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const activities = all(db, "activity").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const invoices = all(db, "invoices").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
  const notificationJobs = all(db, "notificationJobs").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const subscription = all(db, "subscriptions").filter((entry) => entry.agencyId === agencyId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
  const reminderJobs = notificationJobs.filter((entry) => entry.kind === "invoice-reminder");
  const metrics = {
    teamMembers: memberships.filter((entry) => entry.status === "active").length,
    pendingInvites: memberships.filter((entry) => entry.status !== "active").length,
    activeClients: clients.filter((entry) => entry.status === "active" || entry.status === "onboarding").length,
    retainers: clients.filter((entry) => String(entry.engagement || "").toLowerCase().includes("retainer")).length,
    monthlyRetainers: clients.filter((entry) => entry.status === "active" || entry.status === "onboarding").reduce((sum, entry) => sum + Number(entry.monthlyRetainer || 0), 0),
    queuedJobs: notificationJobs.filter((entry) => entry.status === "queued").length,
    activeWorkItems: workItems.filter((entry) => entry.status !== "done").length,
    atRiskWorkItems: workItems.filter((entry) => entry.status === "at-risk").length,
    unassignedWorkItems: workItems.filter((entry) => !entry.assigneeMembershipId && entry.status !== "done").length,
    dueInvoices: invoices.filter((entry) => entry.status === "due").length,
    overdueInvoices: invoices.filter((entry) => entry.status === "overdue").length,
    queuedReminders: reminderJobs.filter((entry) => entry.status === "queued").length
  };
  return {
    agency,
    memberships,
    clients,
    workItems,
    activities,
    invoices,
    notificationJobs,
    reminderJobs,
    subscription,
    metrics,
    plans: listPlans(db),
    config: getAgencyOpsConfig(),
    workload: summarizeWorkload(memberships, workItems)
  };
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
    name: body.name || displayNameFromEmail(body.email),
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

export function assignWorkItem(db, agencyId, actor, body) {
  const current = get(db, "workItems", body.workItemId);
  if (!current || current.agencyId !== agencyId) throw new Error("Unknown work item");
  const membership = body.assigneeMembershipId ? get(db, "memberships", body.assigneeMembershipId) : null;
  if (body.assigneeMembershipId && (!membership || membership.agencyId !== agencyId)) throw new Error("Unknown assignee");
  const next = {
    ...current,
    assigneeMembershipId: membership?.id || "",
    assigneeName: membership?.name || "",
    assigneeEmail: membership?.email || "",
    updatedAt: nowIso()
  };
  set(db, "workItems", current.id, next);
  createActivity(
    db,
    agencyId,
    membership ? "work-item.assigned" : "work-item.unassigned",
    membership ? `Assigned ${current.title} to ${membership.name}` : `Removed assignee from ${current.title}`,
    actor.id
  );
  return next;
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
  const invoice = buildInvoiceRecord(
    agencyId,
    plan.id,
    plan.price,
    "paid",
    `${plan.name} plan invoice`,
    nowIso(),
    shiftIso(30),
    {
      reminderStatus: "settled",
      reminderLabel: "Receipt delivered",
      reminderCount: 0
    }
  );
  set(db, "invoices", invoice.id, invoice);
  createActivity(db, agencyId, "plan.upgraded", `Moved to ${plan.name}`, actor.id);
  queueNotificationJob(db, agencyId, "billing-receipt", { invoiceId: invoice.id, planId: plan.id });
  return { plan, subscription, invoice };
}

export function queueInvoiceReminder(db, agencyId, actor, body) {
  const current = get(db, "invoices", body.invoiceId);
  if (!current || current.agencyId !== agencyId) throw new Error("Unknown invoice");
  const action = String(body.action || "queue").toLowerCase();
  const isImmediate = action === "send" || action === "resend";
  const job = queueNotificationJob(
    db,
    agencyId,
    "invoice-reminder",
    {
      invoiceId: current.id,
      invoiceSummary: current.summary,
      mode: action
    },
    {
      status: isImmediate ? "delivered" : "queued",
      deliveredAt: isImmediate ? nowIso() : ""
    }
  );
  const next = {
    ...current,
    reminderStatus: isImmediate ? "delivered" : "queued",
    reminderCount: Number(current.reminderCount || 0) + 1,
    lastReminderAt: isImmediate ? job.deliveredAt || nowIso() : current.lastReminderAt || "",
    nextReminderAt: isImmediate ? "" : shiftIso(1),
    reminderLabel: isImmediate ? "Reminder sent to client" : "Queued for delivery queue",
    reminderChannel: "email"
  };
  set(db, "invoices", current.id, next);
  createActivity(
    db,
    agencyId,
    isImmediate ? "invoice-reminder.sent" : "invoice-reminder.queued",
    `${isImmediate ? "Sent" : "Queued"} reminder for ${current.summary}`,
    actor.id
  );
  return { invoice: next, job };
}

export function summarizeOps(db) {
  const workItems = all(db, "workItems");
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
      queuedJobs: jobs.filter((entry) => entry.status === "queued").length,
      queuedReminderJobs: jobs.filter((entry) => entry.kind === "invoice-reminder" && entry.status === "queued").length,
      overdueInvoices: invoices.filter((entry) => entry.status === "overdue").length,
      openWorkItems: workItems.filter((entry) => entry.status !== "done").length,
      unassignedWorkItems: workItems.filter((entry) => entry.status !== "done" && !entry.assigneeMembershipId).length
    },
    recentJobs: jobs.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 8),
    recentInvoices: invoices.sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt))).slice(0, 8),
    recentWorkItems: workItems.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0, 8)
  };
}
