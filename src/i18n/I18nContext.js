import React, { createContext, useContext } from 'react'
import { navigate } from 'gatsby'

import { DEFAULT_LANG, dictionaries, pathForLang } from './index'

const I18nContext = createContext(null)

/**
 * Render a translated string into React nodes, honouring a tiny inline markup:
 *   **text**  -> <strong>
 *   *text*    -> <em>
 *   \n        -> <br>
 * This lets each translatable value stay a single, reviewable string while
 * still preserving the emphasis and line breaks from the original design.
 */
export const rich = (text) => {
  const lines = String(text == null ? '' : text).split('\n')
  const token = /\*\*(.+?)\*\*|\*(.+?)\*/g

  return lines.map((line, li) => {
    const parts = []
    let last = 0
    let key = 0
    let m
    while ((m = token.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index))
      if (m[1] != null) parts.push(<strong key={key++}>{m[1]}</strong>)
      else parts.push(<em key={key++}>{m[2]}</em>)
      last = token.lastIndex
    }
    if (last < line.length) parts.push(line.slice(last))

    return (
      <React.Fragment key={li}>
        {li > 0 && <br />}
        {parts}
      </React.Fragment>
    )
  })
}

// The active language is driven by the URL: each localized route renders this
// provider with its own `lang` (from pageContext). Switching language is a
// real navigation to the sibling locale's path, so every page is a crawlable,
// statically-rendered URL (/de/, /pt/, …). The current query string and hash
// are preserved so UTM/attribution params survive the switch. The choice is
// remembered in a cookie that netlify/edge-functions/language-redirect.js
// reads, so picking English is not undone by the browser-language redirect.
export const I18nProvider = ({ lang = DEFAULT_LANG, children }) => {
  const setLang = (code) => {
    if (code === lang) return
    document.cookie = `lang_pref=${code}; path=/; max-age=31536000; SameSite=Lax`
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    navigate(pathForLang(code) + search + hash)
  }

  // Look up a key in the active locale, falling back to English, then the key.
  const t = (key) => {
    const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG]
    if (dict && key in dict) return dict[key]
    const fallback = dictionaries[DEFAULT_LANG]
    return fallback && key in fallback ? fallback[key] : key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
