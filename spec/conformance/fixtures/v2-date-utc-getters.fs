const d = new Date("2025-01-01T00:00:00.000Z")
const y = d.getUTCFullYear()
const m = d.getUTCMonth()
const dd = d.getUTCDate()
const h = d.getUTCHours()

export default function DateUtcGetters() {
  return `${y}:${m}:${dd}:${h}`
}
