export default function PrivatePage({user}) {
  return `
    <section class="section private-shell">
      <header class="section-head">
        <p class="section-kicker">Private space</p>
        <h1 class="section-title private-title">Welcome ${user?.name || user?.email || "builder"}.</h1>
        <p class="section-copy private-copy">This route is protected by auth middleware and session policy. Use it for dashboards, internal tooling, billing screens, and account workflows.</p>
      </header>

      <div class="private-points">
        <span>- Session cookies are managed via FastScript auth helpers.</span>
        <span>- API route guards can enforce role-based access controls.</span>
        <span>- Tenant-scoped storage, cache, and DB access are available in route context.</span>
      </div>
    </section>
  `;
}
export async function GET(ctx) {
  try {
    const user = ctx.auth.requireUser();
    return ctx.helpers.json({
      ok: true,
      user
    });
  } catch {
    return ctx.helpers.redirect("/");
  }
}
