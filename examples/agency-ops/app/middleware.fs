export async function middleware(ctx, next) {
  if (ctx.pathname.startsWith("/dashboard") && !ctx.user) {
    return ctx.helpers.redirect("/sign-in");
  }
  return next();
}
