/**
 * Utility functions for tracking events with Facebook Pixel
 * Only fires events if the user has consented to tracking
 * Automatically includes UTM parameters and click IDs for attribution
 */

// Check if user has consented to Facebook Pixel tracking
const hasPixelConsent = () => {
  if (typeof document === "undefined") return false
  return document.cookie.includes("gatsby-gdpr-facebook-pixel=true")
}

// Get URL parameters (UTM, click IDs, etc.)
const getUrlParams = () => {
  if (typeof window === "undefined") return {}
  
  const params = new URLSearchParams(window.location.search)
  const result = {}
  
  // UTM parameters
  const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
  utmParams.forEach(param => {
    const value = params.get(param)
    if (value) result[param] = value
  })
  
  // Ad platform click IDs
  const clickIds = ["fbclid", "gclid", "ttclid", "msclkid"]
  clickIds.forEach(param => {
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
    console.log("[Tracking] Stored attribution params:", params)
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

// Track a Facebook Pixel standard event
export const trackEvent = (eventName, params = {}) => {
  if (!hasPixelConsent()) {
    console.log(`[Tracking] Skipped ${eventName} - no consent`)
    return false
  }

  if (typeof window !== "undefined" && window.fbq) {
    // Merge attribution data with event params
    const attribution = getAttributionData()
    const fullParams = { ...attribution, ...params }
    
    window.fbq("track", eventName, fullParams)
    console.log(`[Tracking] Fired ${eventName}`, fullParams)
    return true
  }

  console.log(`[Tracking] Skipped ${eventName} - fbq not available`)
  return false
}

// Track a custom Facebook Pixel event
export const trackCustomEvent = (eventName, params = {}) => {
  if (!hasPixelConsent()) {
    console.log(`[Tracking] Skipped custom ${eventName} - no consent`)
    return false
  }

  if (typeof window !== "undefined" && window.fbq) {
    // Merge attribution data with event params
    const attribution = getAttributionData()
    const fullParams = { ...attribution, ...params }
    
    window.fbq("trackCustom", eventName, fullParams)
    console.log(`[Tracking] Fired custom ${eventName}`, fullParams)
    return true
  }

  console.log(`[Tracking] Skipped custom ${eventName} - fbq not available`)
  return false
}

// Common conversion events
export const trackLead = (params = {}) => trackEvent("Lead", params)
export const trackAppStoreClick = () => trackCustomEvent("AppStoreClick", { platform: "iOS" })
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

// Build App Store URL with campaign tracking
export const buildAppStoreUrl = (appId, providerToken) => {
  const baseUrl = `https://apps.apple.com/app/apple-store/${appId}`
  const baseParams = `?pt=${providerToken}&mt=8`
  
  if (typeof window === "undefined") {
    // SSR fallback - no campaign tracking available
    return `${baseUrl}${baseParams}`
  }

  const params = new URLSearchParams(window.location.search)
  
  // Build campaign token from UTM params (max 40 chars for Apple)
  const source = params.get("utm_source") || ""
  const medium = params.get("utm_medium") || ""
  const campaign = params.get("utm_campaign") || ""
  
  // Format: source_medium_campaign (truncated to 40 chars)
  let campaignToken = [source, medium, campaign]
    .filter(Boolean)
    .join("_")
    .substring(0, 40)
  
  // If no UTM params, check for stored attribution
  if (!campaignToken) {
    try {
      const stored = sessionStorage.getItem("attribution_params")
      if (stored) {
        const attrs = JSON.parse(stored)
        campaignToken = [attrs.utm_source, attrs.utm_medium, attrs.utm_campaign]
          .filter(Boolean)
          .join("_")
          .substring(0, 40)
      }
    } catch {
      // Ignore errors
    }
  }
  
  // If still no campaign token, detect from referrer
  if (!campaignToken) {
    campaignToken = getSourceFromReferrer() || "direct"
  }
  
  return `${baseUrl}?pt=${providerToken}&ct=${encodeURIComponent(campaignToken)}&mt=8`
}
