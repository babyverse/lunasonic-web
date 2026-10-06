// Regenerates the hero phone screenshots (src/images/hero/<lang>.webp) from the
// iOS app's fastlane screenshots.
//
//   node bin/sync-hero-screens.js [path/to/grogu/fastlane/screenshots]
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const SOURCE_DIR = path.resolve(
  process.argv[2] || path.join(__dirname, '../../grogu/fastlane/screenshots')
)
const SOURCE_FILE = 'iPhone 17 Pro Max-03_Share.png'
const OUT_DIR = path.join(__dirname, '../src/images/hero')
// The phone screen is ~302 CSS px wide at most, so this covers 2x displays.
const WIDTH = 720

// Landing locale → fastlane locale folder. Must cover LANGUAGES in
// src/i18n/index.js. es-MX is the app's only Spanish; pt-BR (not pt-PT) matches
// the site's Brazilian Portuguese copy.
const LOCALES = {
  en: 'en-US',
  es: 'es-MX',
  de: 'de-DE',
  fr: 'fr-FR',
  pt: 'pt-BR',
  nl: 'nl-NL',
  sv: 'sv',
  no: 'no',
  da: 'da',
}

const run = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const [lang, folder] of Object.entries(LOCALES)) {
    const source = path.join(SOURCE_DIR, folder, SOURCE_FILE)
    const target = path.join(OUT_DIR, `${lang}.webp`)
    const { width, height, size } = await sharp(source)
      .resize({ width: WIDTH })
      .webp({ quality: 82 })
      .toFile(target)
    console.log(
      `${folder} -> ${path.relative(process.cwd(), target)} (${width}x${height}, ${Math.round(size / 1024)} KB)`
    )
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
