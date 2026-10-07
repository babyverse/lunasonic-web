// Copies the iOS app's help content (its FAQ, already translated) into
// src/i18n/faq/<lang>.json so the support pages stay in sync with the app.
//
//   node bin/sync-help-content.js [path/to/grogu/Babyverse/Babyverse]
const path = require('path')
const fs = require('fs')

const SOURCE_DIR = path.resolve(
  process.argv[2] || path.join(__dirname, '../../grogu/Babyverse/Babyverse')
)
const OUT_DIR = path.join(__dirname, '../src/i18n/faq')

// Site locale → app .lproj folder. Must cover LANGUAGES in src/i18n/index.js.
const LOCALES = {
  en: 'en',
  es: 'es',
  de: 'de',
  fr: 'fr',
  pt: 'pt-BR',
  nl: 'nl',
  sv: 'sv',
  no: 'nb',
  da: 'da',
}

fs.mkdirSync(OUT_DIR, { recursive: true })
for (const [lang, folder] of Object.entries(LOCALES)) {
  const source = path.join(SOURCE_DIR, `${folder}.lproj`, 'help_content.json')
  const items = JSON.parse(fs.readFileSync(source, 'utf8')).faqItems.map(
    ({ question, answer }) => ({ question: question.trim(), answer: answer.trim() })
  )
  const target = path.join(OUT_DIR, `${lang}.json`)
  fs.writeFileSync(target, JSON.stringify(items, null, 2) + '\n')
  console.log(`${folder} -> ${path.relative(process.cwd(), target)} (${items.length} questions)`)
}
