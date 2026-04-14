function parseField(field, min, max) {
  const out = new Set();
  const raw = String(field || "*").trim();
  if (raw === "*") {
    for (let i = min; i <= max; i += 1) out.add(i);
    return out;
  }
  for (const part of raw.split(",")) {
    const item = part.trim();
    if (!item) continue;
    const stepSplit = item.split("/");
    const base = stepSplit[0];
    const step = Number(stepSplit[1] || 1);
    const [startRaw, endRaw] = base === "*" ? [String(min), String(max)] : base.split("-");
    const start = Number(startRaw);
    const end = Number(endRaw || startRaw);
    for (let n = start; n <= end; n += step) {
      if (n >= min && n <= max) out.add(n);
    }
  }
  return out;
}

function datePartsInTimezone(date, timezone) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    minute: Number(parts.minute),
    hour: Number(parts.hour),
    day: Number(parts.day),
    month: Number(parts.month),
    weekday: weekdayMap[parts.weekday],
  };
}

export function parseCronExpression(expr) {
  const [minuteRaw, hourRaw, dayRaw, monthRaw, weekdayRaw] = String(expr || "").trim().split(/\s+/);
  if (!weekdayRaw) {
    const error = new Error(`Invalid cron expression: ${expr}`);
    error.status = 400;
    throw error;
  }
  return {
    minute: parseField(minuteRaw, 0, 59),
    hour: parseField(hourRaw, 0, 23),
    day: parseField(dayRaw, 1, 31),
    month: parseField(monthRaw, 1, 12),
    weekday: parseField(weekdayRaw, 0, 6),
  };
}

export function nextCronRun(expr, { from = new Date(), timezone = "UTC", horizonMinutes = 60 * 24 * 30 } = {}) {
  const parsed = parseCronExpression(expr);
  const cursor = new Date(from.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  for (let i = 0; i < horizonMinutes; i += 1) {
    const parts = datePartsInTimezone(cursor, timezone);
    if (
      parsed.minute.has(parts.minute) &&
      parsed.hour.has(parts.hour) &&
      parsed.day.has(parts.day) &&
      parsed.month.has(parts.month) &&
      parsed.weekday.has(parts.weekday)
    ) {
      return new Date(cursor.getTime());
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return null;
}

export function normalizeScheduleEntry(entry = {}) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.cron) {
    const timezone = entry.timezone || "UTC";
    const next = nextCronRun(entry.cron, { timezone });
    if (!next) return null;
    return {
      ...entry,
      timezone,
      nextRunAt: next.getTime(),
      everyMs: null,
      dedupeKey: entry.dedupeKey || `cron:${entry.name || "job"}:${timezone}:${entry.cron}`,
    };
  }
  return {
    ...entry,
    timezone: entry.timezone || "UTC",
    everyMs: entry.everyMs ?? 1000,
    nextRunAt: Date.now() + (entry.everyMs ?? 1000),
    dedupeKey: entry.dedupeKey || `interval:${entry.name || "job"}`,
  };
}
