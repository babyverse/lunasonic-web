// Central registry for the landing page's languages and dictionaries.
//
// `LANGUAGES` drives the switcher (native name shown in the dropdown, English
// label as a secondary hint, the locale `code` used for lookups, and the
// `ogLocale` sent to social networks). The `dictionaries` map only needs an
// entry per translated locale — any locale without one falls back to English
// via the t() helper in I18nContext.
// Languages mirror the iOS app's localizations (grogu / Babyverse .lproj
// bundles): en, es, de, fr, nl, pt, sv, nb (Norwegian Bokmål → "no"), da.
import en from './locales/en.json'
import es from './locales/es.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'
import nl from './locales/nl.json'
import sv from './locales/sv.json'
import no from './locales/no.json'
import da from './locales/da.json'
import heroEn from '../images/hero/en.webp'
import heroEs from '../images/hero/es.webp'
import heroDe from '../images/hero/de.webp'
import heroFr from '../images/hero/fr.webp'
import heroPt from '../images/hero/pt.webp'
import heroNl from '../images/hero/nl.webp'
import heroSv from '../images/hero/sv.webp'
import heroNo from '../images/hero/no.webp'
import heroDa from '../images/hero/da.webp'

export const DEFAULT_LANG = 'en'

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English', ogLocale: 'en_US' },
  { code: 'es', native: 'Español', english: 'Spanish', ogLocale: 'es_ES' },
  { code: 'de', native: 'Deutsch', english: 'German', ogLocale: 'de_DE' },
  { code: 'fr', native: 'Français', english: 'French', ogLocale: 'fr_FR' },
  { code: 'pt', native: 'Português', english: 'Portuguese', ogLocale: 'pt_BR' },
  { code: 'nl', native: 'Nederlands', english: 'Dutch', ogLocale: 'nl_NL' },
  { code: 'sv', native: 'Svenska', english: 'Swedish', ogLocale: 'sv_SE' },
  { code: 'no', native: 'Norsk', english: 'Norwegian', ogLocale: 'nb_NO' },
  { code: 'da', native: 'Dansk', english: 'Danish', ogLocale: 'da_DK' },
]

export const dictionaries = { en, es, de, fr, pt, nl, sv, no, da }

// App screenshot shown in the hero phone frame, one per locale. Generated from
// the iOS app's fastlane screenshots by bin/sync-hero-screens.js.
export const heroScreens = {
  en: heroEn,
  es: heroEs,
  de: heroDe,
  fr: heroFr,
  pt: heroPt,
  nl: heroNl,
  sv: heroSv,
  no: heroNo,
  da: heroDa,
}

// URL path for a locale. English (default) lives at the root; every other
// language lives under its own prefix, e.g. /de/, /pt/. Mirrors the page
// generation in gatsby-node.js.
export const pathForLang = (code) =>
  code === DEFAULT_LANG ? '/' : `/${code}/`
