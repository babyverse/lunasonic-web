import React, { useEffect } from 'react'
import { Link } from 'gatsby'

import './snuggly-landing.css'
import { IconSprite } from './icons'
import { LangSwitcher } from './lang-switcher'
import CookieConsentBanner from './cookie-consent'
import { storeAttributionParams } from '../utils/tracking'
import { I18nProvider, useI18n } from '../i18n/I18nContext'
import { DEFAULT_LANG, pathForLang, supportPathForLang } from '../i18n'

const Logo = () => (
  <>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <use href="#i-heart" />
    </svg>
    Snuggly
  </>
)

const Shell = ({ children, showLanguages }) => {
  const { lang, t } = useI18n()

  return (
    <div className="snuggly-page subpage">
      <IconSprite />
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="logo" to={pathForLang(lang)} aria-label={t('header.home')}>
            <Logo />
          </Link>
          {showLanguages ? (
            <LangSwitcher id="lang-header" />
          ) : (
            <Link className="header-link" to={supportPathForLang(lang)}>
              {t('nav.support')}
            </Link>
          )}
        </div>
      </header>
      <main className="wrap subpage-main">{children}</main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-brand">
            <span className="logo">
              <Logo />
            </span>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-meta">
            <div className="footer-links">
              <Link to={pathForLang(lang)}>{t('nav.home')}</Link>
              <Link to={supportPathForLang(lang)}>{t('nav.support')}</Link>
              <Link to="/privacy-policy/">{t('footer.privacy')}</Link>
              <Link to="/terms-and-conditions/">{t('footer.terms')}</Link>
            </div>
            <span>{t('footer.legal')}</span>
          </div>
        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  )
}

// Shell for the secondary pages (support, privacy policy, terms). The legal
// pages exist in English only; the support page is localized, so it passes
// its `lang`, a `pathFor` for the language switcher, and `showLanguages`.
const Layout = ({
  children,
  lang = DEFAULT_LANG,
  pathFor,
  showLanguages = false,
}) => {
  useEffect(() => {
    // Capture UTM params and click IDs on first page load
    storeAttributionParams()
  }, [])

  return (
    <I18nProvider lang={lang} pathFor={pathFor}>
      <Shell showLanguages={showLanguages}>{children}</Shell>
    </I18nProvider>
  )
}

export default Layout
