# lunasonic-web

Website for the Snuggly app — https://www.snugglyapp.com (also served at lunasonic.io).

Gatsby 4 site deployed on Netlify. The landing page and the support page are
localized into nine languages (`src/i18n`); the privacy policy and terms are
English-only markdown in `src/files`.

## Develop

```sh
nvm use          # Node version from .nvmrc
npm install
npm run dev      # http://localhost:8000
npm run build    # production build into public/
```

## Content synced from the iOS app

Two assets are copied from the sibling `grogu` repo (the iOS app) and
committed here; rerun the scripts after the app changes:

- `node bin/sync-hero-screens.js` — the per-language app screenshot in the
  hero phone frame, from the fastlane screenshots.
- `node bin/sync-help-content.js` — the support page FAQ, from the app's
  translated help content.

## Tracking

Google Analytics 4 and the Meta Pixel load only in production and, in
consent-required countries, only after the visitor accepts the cookie banner
(`netlify/edge-functions/geo-consent.js` detects the country). App Store links
carry a campaign token built from UTM parameters or ad click IDs
(`src/utils/tracking.js`).
