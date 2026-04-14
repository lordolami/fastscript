const node = document.querySelector("#app")
const many = document.querySelectorAll(".item")
const byId = document.getElementById("root")
const href = location.href
window.addEventListener("click", (event) => {
  const target = event?.target
  if (target?.closest) {
    const btn = target.closest("button")
    if (btn) btn.setAttribute("data-seen", "1")
  }
})
history.pushState({}, "", "/docs")
localStorage.setItem("x", "1")
const stored = localStorage.getItem("x")

export default function DomPatternsFixture() {
  return `${Boolean(node)}:${many.length}:${Boolean(byId)}:${href}:${stored}`
}
