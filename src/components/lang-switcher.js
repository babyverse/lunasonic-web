import React, { useEffect, useRef, useState } from 'react'

import { useI18n } from '../i18n/I18nContext'
import { LANGUAGES } from '../i18n'

// Real, context-driven language switcher. Every instance reads/writes the same
// shared language, so the header and footer dropdowns stay in sync for free.
export const LangSwitcher = ({ id }) => {
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
