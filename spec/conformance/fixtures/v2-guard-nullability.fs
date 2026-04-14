function pick(value) {
  if (typeof value === "string") return value.toUpperCase()
  if (Array.isArray(value)) return value.length
  return null
}

function nameOf(user) {
  return user?.name ?? "Unknown"
}

const a = pick("abc")
const b = pick([1, 2, 3])
const c = nameOf({ name: "FastScript" })

export default function GuardNullability() {
  return `${a}:${b}:${c}`
}
