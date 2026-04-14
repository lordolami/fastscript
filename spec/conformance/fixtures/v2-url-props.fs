const u = new URL("https://user:pass@example.com:443/a/b?x=1#h")
const p = u.protocol
const host = u.host
const path = u.pathname
const search = u.search
const hash = u.hash
const json = u.toJSON()

export default function UrlProps() {
  return `${p}:${host}:${path}:${search}:${hash}:${json}`
}
