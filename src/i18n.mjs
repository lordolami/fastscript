export function getI18nConfig(env = process.env) {
  const locales = String(env.I18N_LOCALES || "en").split(",").map((x) => x.trim()).filter(Boolean);
  const defaultLocale = String(env.I18N_DEFAULT_LOCALE || locales[0] || "en").trim() || "en";
  return { locales, defaultLocale };
}

export function resolveLocaleFromPath(pathname, config = getI18nConfig()) {
  const parts = String(pathname || "/").split("/").filter(Boolean);
  const first = parts[0];
  if (first && config.locales.includes(first)) {
    const nextPath = `/${parts.slice(1).join("/")}`;
    return {
      locale: first,
      pathname: nextPath === "/" ? "/" : nextPath.replace(/\/+$/, "") || "/",
      isLocalized: true,
    };
  }
  return { locale: config.defaultLocale, pathname: pathname || "/", isLocalized: false };
}

export function withLocalePath(pathname, locale, config = getI18nConfig()) {
  const normalized = String(pathname || "/").startsWith("/") ? String(pathname || "/") : `/${pathname}`;
  if (!locale || locale === config.defaultLocale) return normalized;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
