import React from 'react'
import { Helmet } from 'react-helmet'

import Seo from './seo'
import Layout from './layout'
import { useI18n } from '../i18n/I18nContext'
import { LANGUAGES, DEFAULT_LANG, faqs, supportPathForLang } from '../i18n'

const ALTERNATES = [
  ...LANGUAGES.map((l) => ({ hrefLang: l.code, pathname: supportPathForLang(l.code) })),
  { hrefLang: 'x-default', pathname: supportPathForLang(DEFAULT_LANG) },
]

const SupportContent = () => {
  const { lang, t } = useI18n()
  const items = faqs[lang] || faqs[DEFAULT_LANG]
  const language = LANGUAGES.find((l) => l.code === lang)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <>
      <Seo
        lang={lang}
        locale={language?.ogLocale}
        title={t('support.title')}
        description={t('support.lede')}
        pathname={supportPathForLang(lang)}
        alternates={ALTERNATES}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <h1>{t('support.title')}</h1>
      <p className="updated">{t('support.lede')}</p>
      <div className="faq-list">
        {items.map(({ question, answer }) => (
          <details className="faq-item" key={question}>
            <summary>
              {question}
              <span className="faq-icon" />
            </summary>
            <div className="faq-answer">{answer}</div>
          </details>
        ))}
      </div>
    </>
  )
}

// Support page for a single locale: the app's FAQ, in that language. Used by
// /support/ (English) and the generated /de/support/, /pt/support/, … routes.
const SupportPage = ({ lang = DEFAULT_LANG }) => (
  <Layout lang={lang} pathFor={supportPathForLang} showLanguages>
    <SupportContent />
  </Layout>
)

export default SupportPage
