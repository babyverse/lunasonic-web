import React, { useEffect, useState } from "react"
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"
import { useLocation } from "@reach/router"
import { initializeAndTrack } from "gatsby-plugin-gdpr-cookies"

// Helper to get cookie value
const getCookie = (name) => {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

const CookieConsentBanner = () => {
  const location = useLocation()
  const [consentRequired, setConsentRequired] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user already gave consent
    const existingConsent = getCookieConsentValue("gatsby-gdpr-consent")
    
    if (existingConsent === "true") {
      // User already accepted, enable tracking
      enableTracking()
      setIsLoading(false)
      return
    }

    if (existingConsent === "false") {
      // User already declined
      setIsLoading(false)
      return
    }

    // Check geo cookie set by Netlify Edge Function
    const geoConsentRequired = getCookie("geo_consent_required")
    
    if (geoConsentRequired === "false") {
      // User is NOT in a consent-required region, auto-enable tracking
      enableTracking()
      setConsentRequired(false)
    } else {
      // User IS in a consent-required region OR geo not detected yet
      // Default to requiring consent (safe fallback)
      setConsentRequired(true)
    }
    
    setIsLoading(false)
  }, [])

  const enableTracking = () => {
    document.cookie = "gatsby-gdpr-google-analytics=true; path=/; max-age=31536000"
    document.cookie = "gatsby-gdpr-facebook-pixel=true; path=/; max-age=31536000"
    initializeAndTrack(location)
  }

  const handleAccept = () => {
    enableTracking()
  }

  const handleDecline = () => {
    document.cookie = "gatsby-gdpr-google-analytics=false; path=/; max-age=31536000"
    document.cookie = "gatsby-gdpr-facebook-pixel=false; path=/; max-age=31536000"
  }

  // Don't render anything while checking geo
  if (isLoading) return null

  // Don't show banner if consent is not required for this region
  if (consentRequired === false) return null

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="gatsby-gdpr-consent"
      style={{
        background: "#FFF4EA",
        padding: "16px 24px",
        alignItems: "center",
        fontSize: "14px",
        color: "#000",
        borderTop: "1px solid rgba(190, 139, 135, 0.3)",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
      }}
      buttonStyle={{
        background: "#BE8B87",
        color: "#ffffff",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        border: "none",
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #BE8B87",
        color: "#BE8B87",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
      }}
      expires={365}
    >
      We use cookies to enhance your experience and analyze site traffic.{" "}
      <a
        href="/privacy"
        style={{ color: "#BE8B87", textDecoration: "underline" }}
      >
        Learn more
      </a>
    </CookieConsent>
  )
}

export default CookieConsentBanner
