const re = new RegExp("ab", "gi")
const source = re.source
const flags = re.flags
const global = re.global
const ignore = re.ignoreCase
const multi = re.multiline
const ok = re.test("xxabyy")

export default function RegExpProps() {
  return `${source}:${flags}:${global}:${ignore}:${multi}:${ok}`
}
