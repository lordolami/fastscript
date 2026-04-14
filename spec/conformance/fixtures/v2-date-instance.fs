const d = new Date("2025-01-01T00:00:00.000Z")
const y = d.getFullYear()
const m = d.getMonth()
const day = d.getDate()
const ms = d.getTime()
const iso = d.toISOString()
d.setUTCSeconds(10)

export default function DateInstance() {
  return `${y}:${m}:${day}:${ms}:${iso}`
}
