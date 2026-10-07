const fs = require('fs')
const path = require('path')

// Non-default landing locales — must mirror LANGUAGES in src/i18n/index.js
// (English is the default and lives at `/`, so it is intentionally omitted).
const LANDING_LOCALES = ['es', 'de', 'fr', 'pt', 'nl', 'sv', 'no', 'da']

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Localized landing and support pages: /es/, /es/support/, /de/, … (the
  // English versions are src/pages/index.js and src/pages/support.js).
  const landing = path.resolve('./src/templates/localized-landing.js')
  const support = path.resolve('./src/templates/localized-support.js')
  LANDING_LOCALES.forEach((lang) => {
    createPage({
      path: `/${lang}/`,
      component: landing,
      context: { lang },
    })
    createPage({
      path: `/${lang}/support/`,
      component: support,
      context: { lang },
    })
  })

  const markdownPage = path.resolve('./src/templates/markdown-page.js')

  const result = await graphql(
    `
      {
        allMarkdownRemark {
          nodes {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading the markdown pages`,
      result.errors
    )
    return
  }

  // Legal pages from src/files (/privacy-policy/, /terms-and-conditions/).
  result.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: `${node.frontmatter.slug.replace(/\/$/, '')}/`,
      component: markdownPage,
      context: { id: node.id },
    })
  })
}

// Write public/sitemap.xml (referenced from static/robots.txt) listing every
// generated page.
exports.onPostBuild = async ({ graphql, reporter }) => {
  const result = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
      allSitePage {
        nodes {
          path
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`There was an error building the sitemap`, result.errors)
    return
  }

  const siteUrl = result.data.site.siteMetadata.siteUrl.replace(/\/$/, '')
  const urls = result.data.allSitePage.nodes
    .map((node) => node.path)
    .filter((pagePath) => !/^\/(dev-)?404/.test(pagePath))
    .sort()
    .map((pagePath) => `  <url><loc>${siteUrl}${encodeURI(pagePath)}</loc></url>`)

  fs.writeFileSync(
    path.join('public', 'sitemap.xml'),
    [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...urls,
      `</urlset>`,
      ``,
    ].join('\n')
  )
}
