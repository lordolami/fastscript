const raw = " Hello FastScript "
const normalized = raw.trim().toUpperCase()
const starts = normalized.startsWith("HELLO")
const split = normalized.split(" ")
const finite = Number.isFinite(10)
const parsedF = Number.parseFloat("10.5")
const parsedI = Number.parseInt("20")

export default function StringNumberMethods() {
  return `${normalized}:${starts}:${split.length}:${finite}:${parsedF + parsedI}`
}
