const headers = new Headers()
headers.set("x-k", "v")
const val = headers.get("x-k")
const form = new FormData()
form.append("name", "fs")
form.set("name", "fastscript")
const has = form.has("name")
const got = form.get("name")
const all = form.getAll("name")

export default function FormHeaders() {
  return `${val}:${has}:${got}:${all.length}`
}
