import React, { useEffect, useRef, useState } from 'react'

import './snuggly-landing.css'
import { trackLead, trackAppStoreClick, buildAppStoreUrl } from '../utils/tracking'
import { useI18n, rich } from '../i18n/I18nContext'
import { LANGUAGES, DEFAULT_LANG, heroScreens } from '../i18n'

// App Store configuration (shared with the previous landing component)
export const APP_ID = 'id1663946323'
const PROVIDER_TOKEN = '125877163'

// FAQ entries (faq.qN / faq.aN in the locale files); also used for the
// FAQ structured data in snuggly-page.js.
export const FAQ_ITEMS = [1, 2, 3, 4, 5]

const IconSprite = () => (
  <svg
    width="0"
    height="0"
    style={{ position: 'absolute' }}
    aria-hidden="true"
    focusable="false"
  >
    <symbol id="i-heart" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </symbol>
    <symbol id="i-apple" viewBox="0 0 24 24">
      <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.26 2.62 1.31-.05 1.8-.85 3.39-.85 1.58 0 2.03.85 3.41.82 1.41-.03 2.3-1.28 3.16-2.55.99-1.46 1.4-2.87 1.42-2.95-.03-.01-2.73-1.05-2.76-4.17zM14.69 4.6c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45z" />
    </symbol>
    <symbol id="i-globe" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
    </symbol>
    <symbol id="i-chev" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" />
    </symbol>
    <symbol id="i-headphones" viewBox="0 0 24 24" fill="none">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.6" y="13" width="4" height="7" rx="2" />
      <rect x="17.4" y="13" width="4" height="7" rx="2" />
    </symbol>
    <symbol id="i-record" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-share" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="6" r="2.6" />
      <circle cx="18" cy="18" r="2.6" />
      <path d="M8.3 10.8l7.4-3.5M8.3 13.2l7.4 3.5" />
    </symbol>
    <symbol id="i-bell" viewBox="0 0 24 24" fill="none">
      <path d="M18 9a6 6 0 0 0-12 0c0 6.5-2.5 7-2.5 9h17C20.5 16 18 15.5 18 9z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </symbol>
  </svg>
)

// Real, context-driven language switcher. Every instance reads/writes the same
// shared language, so the header and footer dropdowns stay in sync for free.
const LangSwitcher = ({ id }) => {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={`lang${open ? ' open' : ''}`} id={id} ref={ref}>
      <button
        className="lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <svg className="globe" viewBox="0 0 24 24">
          <use href="#i-globe" />
        </svg>
        <span className="lang-current">{current.native}</span>
        <svg className="chev" viewBox="0 0 24 24">
          <use href="#i-chev" />
        </svg>
      </button>
      <div className="lang-menu" role="listbox" aria-label={t('switcher.choose')}>
        {LANGUAGES.map(({ code, native, english }) => (
          <button
            key={code}
            className="lang-opt"
            role="option"
            aria-selected={code === lang}
            onClick={() => {
              setLang(code)
              setOpen(false)
            }}
          >
            <span className="native">{native}</span>
            <span className="english">{english}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const LandingInner = () => {
  const { lang, t } = useI18n()
  const rootRef = useRef(null)
  const [appStoreUrl, setAppStoreUrl] = useState(
    `https://apps.apple.com/app/apple-store/${APP_ID}?pt=${PROVIDER_TOKEN}&mt=8`
  )

  useEffect(() => {
    // Build the App Store URL with campaign params on the client.
    setAppStoreUrl(buildAppStoreUrl(APP_ID, PROVIDER_TOKEN))
  }, [])

  // Visual interactions that are independent of copy/language.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    /* ---- header shadow on scroll ---- */
    const header = root.querySelector('.site-header')
    const onScroll = () => {
      if (!header) return
      if (window.scrollY > 12) header.classList.add('scrolled')
      else header.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    /* ---- build CSS bar waveforms ---- */
    const buildWaveform = (el) => {
      if (el.childElementCount) return // already built (hot reload / re-run)
      const count = parseInt(el.getAttribute('data-bars') || '40', 10)
      const min = parseFloat(el.getAttribute('data-min') || '8')
      const max = parseFloat(el.getAttribute('data-max') || '100')
      const frag = document.createDocumentFragment()
      for (let i = 0; i < count; i++) {
        const bar = document.createElement('span')
        // smooth-ish pseudo-random heartbeat envelope
        const tt = i / count
        const env = 0.5 + 0.5 * Math.sin(tt * Math.PI * 4 + Math.random() * 0.6)
        const h = min + env * (max - min) * (0.45 + Math.random() * 0.55)
        bar.style.height = Math.max(min, Math.min(max, h)) + '%'
        bar.style.animationDelay = (Math.random() * 1.1).toFixed(2) + 's'
        bar.style.animationDuration = (0.8 + Math.random() * 0.8).toFixed(2) + 's'
        frag.appendChild(bar)
      }
      el.appendChild(frag)
    }
    root.querySelectorAll('.waveform[data-bars]').forEach(buildWaveform)

    /* ---- noise row (science viz) — static thin bars ---- */
    root.querySelectorAll('.noise-row[data-bars]').forEach((el) => {
      if (el.childElementCount) return
      const count = parseInt(el.getAttribute('data-bars') || '80', 10)
      const frag = document.createDocumentFragment()
      for (let i = 0; i < count; i++) {
        const bar = document.createElement('span')
        bar.style.height = 10 + Math.random() * 90 + '%'
        frag.appendChild(bar)
      }
      el.appendChild(frag)
    })

    /* ---- FAQ: keep one open at a time (accordion feel) ---- */
    const faqItems = Array.prototype.slice.call(
      root.querySelectorAll('.faq-item')
    )
    const cleanups = []
    faqItems.forEach((item) => {
      const onToggle = () => {
        if (item.open) {
          faqItems.forEach((other) => {
            if (other !== item) other.open = false
          })
        }
      }
      item.addEventListener('toggle', onToggle)
      cleanups.push(() => item.removeEventListener('toggle', onToggle))
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  const handleAppStoreClick = () => {
    trackLead({ content_name: 'App Store Download', content_category: 'iOS App' })
    trackAppStoreClick()
  }

  const AppStore = () => (
    <a
      className="appstore"
      href={appStoreUrl}
      onClick={handleAppStoreClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('appStore.aria')}
    >
      <svg viewBox="0 0 24 24">
        <use href="#i-apple" />
      </svg>
      <span className="as-text">
        <span className="as-small">{t('appStore.small')}</span>
        <span className="as-big">{t('appStore.big')}</span>
      </span>
    </a>
  )

  return (
    <div className="snuggly-page" ref={rootRef}>
      <IconSprite />

      {/* ===================================================== HEADER */}
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo" href="#top" aria-label={t('header.home')}>
            <svg viewBox="0 0 24 24">
              <use href="#i-heart" />
            </svg>
            Snuggly
          </a>
          <LangSwitcher id="lang-header" />
        </div>
      </header>

      <main id="top">
        {/* =================================================== HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{t('hero.eyebrow')}</p>
              <h1>{rich(t('hero.title'))}</h1>
              <p className="hero-sub">{t('hero.sub')}</p>
              <div className="hero-cta-row">
                <AppStore />
                <span className="hero-note">
                  <span className="dot" />
                  {t('hero.note')}
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-blob" />
              <div className="hero-blob b2" />
              <div className="hero-blob b3" />
              <div className="phone">
                <div className="phone-screen">
                  <div className="phone-notch" />
                  <img
                    src={heroScreens[lang] || heroScreens[DEFAULT_LANG]}
                    alt={t('phone.alt')}
                    width="720"
                    height="1564"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== THE PROMISE */}
        <section className="section promise soft">
          <div className="wrap">
            <p className="eyebrow center">{t('promise.eyebrow')}</p>
            <blockquote>{rich(t('promise.quote'))}</blockquote>
            <p className="sig">{t('promise.sig')}</p>
          </div>
        </section>

        {/* =================================================== HOW IT WORKS */}
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{t('how.eyebrow')}</p>
              <h2>{t('how.title')}</h2>
              <p className="lede">{t('how.lede')}</p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <h3>{t('how.step1.title')}</h3>
                <p>{t('how.step1.body')}</p>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <h3>{t('how.step2.title')}</h3>
                <p>{t('how.step2.body')}</p>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <h3>{t('how.step3.title')}</h3>
                <p>{t('how.step3.body')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== THE SCIENCE */}
        <section className="section science">
          <div className="wrap science-grid">
            <div className="science-copy">
              <p className="eyebrow">{t('science.eyebrow')}</p>
              <h2>{rich(t('science.title'))}</h2>
              <p className="lede">{t('science.lede')}</p>
              <div className="science-points">
                <div className="science-point">
                  <span className="tick" />
                  <p>{rich(t('science.point1'))}</p>
                </div>
                <div className="science-point">
                  <span className="tick" />
                  <p>{rich(t('science.point2'))}</p>
                </div>
                <div className="science-point">
                  <span className="tick" />
                  <p>{rich(t('science.point3'))}</p>
                </div>
              </div>
            </div>
            <div className="science-viz">
              <div className="vlabel">{t('science.vizRaw')}</div>
              <div className="noise-row" data-bars="90" />
              <div className="vlabel">{t('science.vizRevealed')}</div>
              <div
                className="waveform"
                data-bars="40"
                data-min="10"
                data-max="100"
              />
              <p className="vcaption">{t('science.vizCaption')}</p>
            </div>
          </div>
        </section>

        {/* =================================================== FEATURES */}
        <section className="section soft">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{t('features.eyebrow')}</p>
              <h2>{t('features.title')}</h2>
              <p className="lede">{t('features.lede')}</p>
            </div>
            <div className="features">
              <div className="feature">
                <div className="ficon">
                  <svg viewBox="0 0 24 24">
                    <use href="#i-headphones" />
                  </svg>
                </div>
                <h3>{t('features.live.title')}</h3>
                <p>{t('features.live.body')}</p>
              </div>
              <div className="feature">
                <div className="ficon">
                  <svg viewBox="0 0 24 24">
                    <use href="#i-record" />
                  </svg>
                </div>
                <h3>{t('features.record.title')}</h3>
                <p>{t('features.record.body')}</p>
              </div>
              <div className="feature">
                <div className="ficon">
                  <svg viewBox="0 0 24 24">
                    <use href="#i-bell" />
                  </svg>
                </div>
                <h3>{t('features.reminders.title')}</h3>
                <p>{rich(t('features.reminders.body'))}</p>
              </div>
              <div className="feature wide">
                <div className="ficon">
                  <svg viewBox="0 0 24 24">
                    <use href="#i-share" />
                  </svg>
                </div>
                <h3>{t('features.share.title')}</h3>
                <p>{t('features.share.body')}</p>
                <div className="templates">
                  <span>{t('features.share.tag1')}</span>
                  <span>{t('features.share.tag2')}</span>
                  <span>{t('features.share.tag3')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================== MID-PAGE CTA */}
        <section className="cta-band">
          <div className="wrap">
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.body')}</p>
            <AppStore />
          </div>
        </section>

        {/* =================================================== TIPS */}
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{t('tips.eyebrow')}</p>
              <h2>{t('tips.title')}</h2>
              <p className="lede">{t('tips.lede')}</p>
            </div>
            <div className="tips-grid">
              {[1, 2, 3, 4, 5].map((n) => (
                <div className="tip" key={n}>
                  <span className="tnum">{n}</span>
                  <div>
                    <h4>{t(`tips.${n}.title`)}</h4>
                    <p>{t(`tips.${n}.body`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================== FAQ */}
        <section className="section soft">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">{t('faq.eyebrow')}</p>
              <h2>{t('faq.title')}</h2>
            </div>
            <div className="faq-list">
              {FAQ_ITEMS.map((n) => (
                <details className="faq-item" key={n}>
                  <summary>
                    {t(`faq.q${n}`)}
                    <span className="faq-icon" />
                  </summary>
                  <div className="faq-answer">{t(`faq.a${n}`)}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================== DISCLAIMER */}
        <section className="section disclaimer">
          <div className="wrap">
            <span className="badge-med">{t('disclaimer.badge')}</span>
            <p>{rich(t('disclaimer.p1'))}</p>
            <p>{t('disclaimer.p2')}</p>
          </div>
        </section>
      </main>

      {/* ===================================================== FOOTER */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-cta">
            <h2>{t('footer.ctaTitle')}</h2>
            <AppStore />
          </div>

          <div className="footer-bottom">
            <div className="footer-brand">
              <span className="logo">
                <svg viewBox="0 0 24 24">
                  <use href="#i-heart" />
                </svg>{' '}
                Snuggly
              </span>
              <p>{t('footer.tagline')}</p>
            </div>
            <LangSwitcher id="lang-footer" />
          </div>

          <div className="footer-meta">
            <div className="footer-links">
              <a href="/privacy-policy">{t('footer.privacy')}</a>
              <a href="/terms-and-conditions">{t('footer.terms')}</a>
            </div>
            <span>{t('footer.legal')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingInner
