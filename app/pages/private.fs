export default function PrivatePage({ user }) {
  const name = (user && (user.name || user.email)) || "builder";
  return `
    <section class="private-page">
      <header class="sec-header">
        <p class="kicker">Private space</p>
        <h1 class="h1">Welcome ${name}.</h1>
        <p class="lead">This route is protected by auth middleware and session policy. Use it for dashboards, internal tooling, billing screens, and account workflows.</p>
      </header>

      <div class="private-points-list">
        <div class="private-point">Session cookies are managed via FastScript auth helpers.</div>
        <div class="private-point">API route guards can enforce role-based access controls.</div>
        <div class="private-point">Tenant-scoped storage, cache, and DB access are available in route context.</div>
      </div>
    </section>
  `;
}

export async function GET(ctx) {
  try {
    const user = ctx.auth.requireUser();
    return ctx.helpers.json({ ok: true, user });
  } catch {
    return ctx.helpers.redirect("/");
  }
}
