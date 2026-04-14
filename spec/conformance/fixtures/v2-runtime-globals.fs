const g = globalThis
const headers = new Headers()
headers.set("x-fastscript", "1")
const form = new FormData()
form.append("hello", "world")
const timer = setTimeout(() => "ok", 1)
clearTimeout(timer)

export default function RuntimeGlobals() {
  const envName = process?.env?.NODE_ENV || "unknown"
  return `${Boolean(g)}:${headers.get("x-fastscript")}:${envName}:${form.get("hello")}`
}
