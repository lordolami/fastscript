const wloc = window.location
const h = window.history
history.pushState({}, "", "/x")
history.replaceState({}, "", "/y")
localStorage.setItem("k", "v")
sessionStorage.setItem("a", "b")
const a = localStorage.getItem("k")
const b = sessionStorage.getItem("a")
window.scrollTo(0, 100)
window.scrollBy(0, -50)

export default function BrowserStorageHistory() {
  return `${Boolean(wloc)}:${Boolean(h)}:${a}:${b}`
}
