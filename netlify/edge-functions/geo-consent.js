// Countries that require consent before tracking
const CONSENT_REQUIRED_COUNTRIES = [
  // EU Member States
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA (non-EU)
  'IS', 'LI', 'NO',
  // UK and Switzerland (GDPR-equivalent laws)
  'GB', 'CH',
  // Mexico (LFPDPPP)
  'MX'
];

export default async function handler(request, context) {
  // Get country code from Netlify's geo object
  const countryCode = context.geo?.country?.code;
  
  // Determine if consent is required
  // If geo detection fails (countryCode is undefined), default to requiring consent (safe fallback)
  const consentRequired = !countryCode || CONSENT_REQUIRED_COUNTRIES.includes(countryCode);
  
  // Set cookies using Netlify's purpose-built cookie API
  // This properly handles multiple cookies without header folding issues
  context.cookies.set({
    name: "geo_consent_required",
    value: consentRequired ? "true" : "false",
    path: "/",
    maxAge: 86400, // 1 day
    sameSite: "Lax",
  });
  
  context.cookies.set({
    name: "geo_country",
    value: countryCode || "unknown",
    path: "/",
    maxAge: 86400, // 1 day
    sameSite: "Lax",
  });
  
  // Continue to the origin
  return context.next();
}

export const config = {
  path: "/*"
};
