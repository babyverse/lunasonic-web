/**
 * Utility functions for conversion tracking (Facebook Pixel + Google Analytics)
 * Only fires events if the user has consented to the respective tracker
 * Automatically includes UTM parameters and click IDs for attribution
 */

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]

// Ad platform click IDs, mapped to the campaign label used when an ad click
// arrives without UTM parameters
const CLICK_ID_SOURCES = {
  fbclid: "facebook_paid",
  gclid: "google_paid",
  ttclid: "tiktok_paid",
  msclkid: "microsoft_paid",
}

// Apple truncates campaign tokens longer than this
const CAMPAIGN_TOKEN_MAX_LENGTH = 40

// Check if user has consented to Facebook Pixel tracking
const hasPixelConsent = () => {
  if (typeof document === "undefined") return false
  return document.cookie.includes("gatsby-gdpr-facebook-pixel=true")
}

// Check if user has consented to Google Analytics tracking
const hasAnalyticsConsent = () => {
  if (typeof document === "undefined") return false
  return document.cookie.includes("gatsby-gdpr-google-analytics=true")
}

// Get URL parameters (UTM, click IDs, etc.)
const getUrlParams = () => {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)
  const result = {}

  UTM_PARAMS.concat(Object.keys(CLICK_ID_SOURCES)).forEach(param => {
    const value = params.get(param)
    if (value) result[param] = value
  })

  return result
}

// Get stored attribution data (persisted from first visit)
const getStoredAttribution = () => {
  if (typeof sessionStorage === "undefined") return {}

  try {
    const stored = sessionStorage.getItem("attribution_params")
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Store attribution params on first visit (so they persist across pages)
export const storeAttributionParams = () => {
  if (typeof sessionStorage === "undefined") return

  // Only store if not already stored (first touch attribution)
  if (sessionStorage.getItem("attribution_params")) return

  const params = getUrlParams()
  if (Object.keys(params).length > 0) {
    sessionStorage.setItem("attribution_params", JSON.stringify(params))
  }
}

// Get all attribution data (current URL params + stored first-touch params)
const getAttributionData = () => {
  const stored = getStoredAttribution()
  const current = getUrlParams()

  // Current params override stored (last-touch for click IDs, but keep first-touch UTMs)
  return {
    ...stored,
    ...current,
    // Keep first-touch UTMs if current ones aren't present
    utm_source: current.utm_source || stored.utm_source,
    utm_medium: current.utm_medium || stored.utm_medium,
    utm_campaign: current.utm_campaign || stored.utm_campaign,
  }
}

const sendPixelEvent = (method, eventName, params) => {
  if (!hasPixelConsent()) return false
  if (typeof window === "undefined" || !window.fbq) return false

  // Merge attribution data with event params
  window.fbq(method, eventName, { ...getAttributionData(), ...params })
  return true
}

// Track a Facebook Pixel standard event
export const trackEvent = (eventName, params = {}) =>
  sendPixelEvent("track", eventName, params)

// Track a custom Facebook Pixel event
export const trackCustomEvent = (eventName, params = {}) =>
  sendPixelEvent("trackCustom", eventName, params)

// Track a Google Analytics (GA4) event
export const trackAnalyticsEvent = (eventName, params = {}) => {
  if (!hasAnalyticsConsent()) return false
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false

  window.gtag("event", eventName, params)
  return true
}

// Common conversion events
export const trackLead = (params = {}) => trackEvent("Lead", params)
export const trackAppStoreClick = () => {
  trackCustomEvent("AppStoreClick", { platform: "iOS" })
  trackAnalyticsEvent("app_store_click", { platform: "iOS" })
}
export const trackContact = (params = {}) => trackEvent("Contact", params)

// Detect traffic source from referrer
export const getSourceFromReferrer = () => {
  if (typeof document === "undefined") return null

  const referrer = document.referrer.toLowerCase()
  if (!referrer) return "direct"

  // Search engines
  if (referrer.includes("google.")) return "google_organic"
  if (referrer.includes("bing.")) return "bing_organic"
  if (referrer.includes("duckduckgo.")) return "duckduckgo_organic"
  if (referrer.includes("yahoo.")) return "yahoo_organic"

  // Social media (including link shim domains)
  if (referrer.includes("facebook.") || referrer.includes("fb.") || referrer.includes("l.facebook.") || referrer.includes("lm.facebook.")) return "facebook_organic"
  if (referrer.includes("instagram.") || referrer.includes("l.instagram.") || referrer.includes("lm.instagram.")) return "instagram_organic"
  if (referrer.includes("twitter.") || referrer.includes("x.com")) return "twitter_organic"
  if (referrer.includes("tiktok.")) return "tiktok_organic"
  if (referrer.includes("pinterest.")) return "pinterest_organic"
  if (referrer.includes("linkedin.")) return "linkedin_organic"
  if (referrer.includes("reddit.")) return "reddit_organic"

  // Other
  if (referrer.includes("youtube.")) return "youtube_organic"

  // Unknown external referrer
  try {
    const url = new URL(referrer)
    return `referral_${url.hostname.replace(/\./g, "_").substring(0, 25)}`
  } catch {
    return "referral_unknown"
  }
}

// Campaign label for one set of attribution params: the UTMs when present,
// otherwise the paid source implied by an ad click ID
const campaignTokenFrom = (params) => {
  // Format: source_medium_campaign
  const fromUtm = [params.utm_source, params.utm_medium, params.utm_campaign]
    .filter(Boolean)
    .join("_")
  if (fromUtm) return fromUtm

  const clickId = Object.keys(CLICK_ID_SOURCES).find(param => params[param])
  return clickId ? CLICK_ID_SOURCES[clickId] : ""
}

// Build App Store URL with campaign tracking
export const buildAppStoreUrl = (appId, providerToken) => {
  const baseUrl = `https://apps.apple.com/app/apple-store/${appId}`

  if (typeof window === "undefined") {
    // SSR fallback - no campaign tracking available
    return `${baseUrl}?pt=${providerToken}&mt=8`
  }

  // Current URL first, then first-touch params stored earlier in the session,
  // then the referrer
  const campaignToken = (
    campaignTokenFrom(getUrlParams()) ||
    campaignTokenFrom(getStoredAttribution()) ||
    getSourceFromReferrer() ||
    "direct"
  ).substring(0, CAMPAIGN_TOKEN_MAX_LENGTH)

  return `${baseUrl}?pt=${providerToken}&ct=${encodeURIComponent(campaignToken)}&mt=8`
}
