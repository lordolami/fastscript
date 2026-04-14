const xs = [1, 2, 3]
const txt = xs.toLocaleString()
const arr = Array.from("abc")

export default function ArrayToLocale() {
  return `${txt}:${arr.length}`
}
