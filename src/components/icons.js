import React from 'react'

// Inline SVG symbols shared by the landing page and the secondary pages.
export const IconSprite = () => (
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
