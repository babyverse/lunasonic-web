// Sends first-time visitors of the English home page (`/`) to the landing page
// in their browser language, e.g. `/de/`. Query string is kept so campaign
// parameters survive the redirect.

// Landing locales other than English — must mirror LANGUAGES in
// src/i18n/index.js.
const LOCALES = ['es', 'de', 'fr', 'pt', 'nl', 'sv', 'no', 'da'];

// Browser language codes served by a differently named locale
const ALIASES = { nb: 'no', nn: 'no' };

// Set by the language switcher (src/i18n/I18nContext.js) once the visitor has
// picked a language themselves
const PREFERENCE_COOKIE = 'lang_pref';

// First language in the Accept-Language header that the site is available in
const preferredLanguage = (header) => {
  const candidates = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const quality = params.find((param) => param.trim().startsWith('q='));
      const code = tag.trim().toLowerCase().split('-')[0];
      return {
        code: ALIASES[code] || code,
        q: quality ? parseFloat(quality.trim().slice(2)) : 1,
        index,
      };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  const match = candidates.find(({ code }) => code === 'en' || LOCALES.includes(code));
  return match ? match.code : null;
};

export default async function handler(request, context) {
  if (context.cookies.get(PREFERENCE_COOKIE)) return context.next();

  const language = preferredLanguage(request.headers.get('accept-language') || '');
  // Crawlers and link previews send no Accept-Language and stay on English
  if (!language || language === 'en') return context.next();

  const url = new URL(request.url);
  url.pathname = `/${language}/`;
  return Response.redirect(url, 302);
}

export const config = {
  path: "/"
};
