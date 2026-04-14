export default function Home({ pathname }) {
  const list = [1, 2, 3].map((n) => n * 2)
  const isDocs = pathname?.startsWith("/docs")
  return `<p>${isDocs ? "docs" : "site"}:${list.join(",")}</p>`
}
