export default function Layout({ content }) {
  return `
    <main class="agency-shell">
      <div class="agency-container">
        ${content}
      </div>
    </main>
  `;
}
