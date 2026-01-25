import React, { useEffect } from 'react'

import './variables.css'
import './global.css'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import CookieConsentBanner from './cookie-consent'
import { storeAttributionParams } from '../utils/tracking'

const Template = ({ children }) => {
  useEffect(() => {
    // Capture UTM params and click IDs on first page load
    storeAttributionParams()
  }, [])

  return (
    <>
      <Seo />
      <Navigation />
      <main>{children}</main>
      <Footer />
      <CookieConsentBanner />
    </>
  )
}

export default Template
