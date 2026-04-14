const a = String.fromCharCode(65)
const b = String.fromCodePoint(0x1F600)
const c = "abc".charCodeAt(0)
const d = "abc".codePointAt(0)

export default function StringCodePoints() {
  return `${a}:${Boolean(b)}:${c}:${d}`
}
