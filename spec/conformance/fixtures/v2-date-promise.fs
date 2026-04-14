const now = Date.now()
const parsed = Date.parse("2025-01-01T00:00:00.000Z")
const utc = Date.UTC(2025, 0, 1)
const p1 = Promise.resolve(1)
const p2 = Promise.resolve("x")
const all = Promise.all([p1, p2])
const race = Promise.race([p1, p2])

export default function DatePromise() {
  return `${now + parsed + utc}:${String(Boolean(all && race))}`
}
