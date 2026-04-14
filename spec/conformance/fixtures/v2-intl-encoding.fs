const dtf = new Intl.DateTimeFormat("en-US")
const nf = new Intl.NumberFormat("en-US")
const enc = new TextEncoder()
const dec = new TextDecoder()
const bytes = enc.encode("hello")
const text = dec.decode(bytes)

export default function IntlEncoding() {
  return `${Boolean(dtf)}:${Boolean(nf)}:${text}`
}
