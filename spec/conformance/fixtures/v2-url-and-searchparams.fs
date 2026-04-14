const url = new URL("https://example.com/path?a=1")
const sp = new URLSearchParams(url.search)
sp.set("a", "2")
const query = sp.toString()
const href = url.toString()

export default function UrlParams() {
  return `${href}:${query}:${url.pathname}`
}
