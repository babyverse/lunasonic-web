import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import Seo, { useSiteMetadata } from './seo'
import SnugglyLanding, { APP_ID, FAQ_ITEMS } from './snuggly-landing'
import CookieConsentBanner from './cookie-consent'
import { storeAttributionParams } from '../utils/tracking'
import { I18nProvider, useI18n } from '../i18n/I18nContext'
import { LANGUAGES, DEFAULT_LANG, pathForLang } from '../i18n'

// hreflang alternates so each localized URL points search engines at its
// siblings; English doubles as the x-default.
const ALTERNATES = [
  ...LANGUAGES.map((l) => ({ hrefLang: l.code, pathname: pathForLang(l.code) })),
  { hrefLang: 'x-default', pathname: pathForLang(DEFAULT_LANG) },
]

// Translated <title>/description, canonical + hreflang, and schema.org data
// describing the app and its FAQ.
const LocalizedHead = () => {
  const { t, lang } = useI18n()
  const { siteUrl } = useSiteMetadata()
  const language = LANGUAGES.find((l) => l.code === lang)

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: 'Snuggly',
      operatingSystem: 'iOS',
      applicationCategory: 'LifestyleApplication',
      description: t('hero.sub'),
      url: `${siteUrl}${pathForLang(lang)}`,
      installUrl: `https://apps.apple.com/app/${APP_ID}`,
      inLanguage: lang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: FAQ_ITEMS.map((n) => ({
        '@type': 'Question',
        name: t(`faq.q${n}`),
        acceptedAnswer: { '@type': 'Answer', text: t(`faq.a${n}`) },
      })),
    },
  ]

  return (
    <>
      <Seo
        lang={lang}
        locale={language?.ogLocale}
        title={t('seo.title')}
        description={t('hero.sub')}
        pathname={pathForLang(lang)}
        alternates={ALTERNATES}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    </>
  )
}

const LocalizedCookieBanner = () => {
  const { t } = useI18n()

  return (
    <CookieConsentBanner
      text={t('cookie.text')}
      learnMore={t('cookie.learnMore')}
      accept={t('cookie.accept')}
      decline={t('cookie.decline')}
    />
  )
}

// Full landing page for a single locale. Used directly by the English home
// page (`/`) and by the generated localized routes (`/de/`, `/pt/`, …) via the
// localized-landing template.
const SnugglyPage = ({ lang = DEFAULT_LANG }) => {
  useEffect(() => {
    // Capture UTM params and click IDs on first page load.
    storeAttributionParams()
  }, [])

  return (
    <I18nProvider lang={lang}>
      <LocalizedHead />
      <SnugglyLanding />
      <LocalizedCookieBanner />
    </I18nProvider>
  )
}

export default SnugglyPage
