import React, { useEffect } from 'react'
import { Link } from 'gatsby'

import './snuggly-landing.css'
import Seo from './seo'
import CookieConsentBanner from './cookie-consent'
import { storeAttributionParams } from '../utils/tracking'

const Logo = () => (
  <>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    Snuggly
  </>
)

// Shell for the secondary, English-only pages (support, privacy policy,
// terms). The landing page has its own localized header and footer.
const Template = ({ children, location }) => {
  useEffect(() => {
    // Capture UTM params and click IDs on first page load
    storeAttributionParams()
  }, [])

  return (
    <div className="snuggly-page subpage">
      <Seo pathname={location?.pathname} />
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="logo" to="/" aria-label="Snuggly home">
            <Logo />
          </Link>
          <Link className="header-link" to="/support/">
            Support
          </Link>
        </div>
      </header>
      <main className="wrap subpage-main">{children}</main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-brand">
            <span className="logo">
              <Logo />
            </span>
            <p>
              Tiny heartbeat, lifetime memory. Made with care for expecting
              parents.
            </p>
          </div>
          <div className="footer-meta">
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/support/">Support</Link>
              <Link to="/privacy-policy/">Privacy Policy</Link>
              <Link to="/terms-and-conditions/">Terms of Use</Link>
            </div>
            <span>© 2026 Snuggly · Not a medical device</span>
          </div>
        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  )
}

export default Template
