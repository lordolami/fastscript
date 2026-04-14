const c = new Intl.Collator("en")
const pr = new Intl.PluralRules("en")
const rf = new Intl.RelativeTimeFormat("en")
const lf = new Intl.ListFormat("en")
const loc = new Intl.Locale("en-US")

export default function IntlMore() {
  return `${Boolean(c)}:${Boolean(pr)}:${Boolean(rf)}:${Boolean(lf)}:${Boolean(loc)}`
}
