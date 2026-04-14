const r = /abc/gi
const txt = r.toString()
const src = r.source
const flg = r.flags

export default function RegExpToString() {
  return `${txt}:${src}:${flg}`
}
