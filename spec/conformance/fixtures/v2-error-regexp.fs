const err = new Error("boom")
const rex = new RegExp("a", "g")
const tested = rex.test("abc")
const executed = rex.exec("abc")

export default function ErrorRegExp() {
  return `${err.message}:${tested}:${Boolean(executed)}`
}
