const s = "x"
const a = s.padStart(3, "0")
const b = s.padEnd(3, "0")
const c = s.repeat(3)

export default function StringPaddingRepeat() {
  return `${a}:${b}:${c}`
}
