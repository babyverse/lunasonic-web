import * as React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

// Social preview used by every page that does not pass its own image.
const DEFAULT_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630 }

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `
  )
  const { title, description, siteUrl } = site.siteMetadata
  return { title, description, siteUrl: (siteUrl || '').replace(/\/$/, '') }
}

// `pathname` enables the canonical link and og:url; `alternates` is a list of
// `{ hrefLang, pathname }` for pages that exist in several languages.
const Seo = ({
  description = '',
  lang = 'en',
  locale,
  meta = [],
  title,
  image,
  pathname,
  alternates = [],
}) => {
  const site = useSiteMetadata()
  const abs = (path) => `${site.siteUrl}${path}`

  const metaDescription = description || site.description
  const defaultTitle = site.title
  const socialTitle = title || defaultTitle
  const url = pathname ? abs(pathname) : null
  const imageUrl = image || abs(DEFAULT_IMAGE.path)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      defaultTitle={defaultTitle}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `theme-color`,
          content: `#FFF4EA`,
        },
        {
          property: `og:site_name`,
          content: `Snuggly`,
        },
        {
          property: `og:title`,
          content: socialTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: imageUrl,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:title`,
          content: socialTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: imageUrl,
        },
      ]
        .concat(
          image
            ? []
            : [
                { property: `og:image:width`, content: DEFAULT_IMAGE.width },
                { property: `og:image:height`, content: DEFAULT_IMAGE.height },
              ]
        )
        .concat(url ? [{ property: `og:url`, content: url }] : [])
        .concat(locale ? [{ property: `og:locale`, content: locale }] : [])
        .concat(meta)}
    >
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/fonts/newsreader-latin.woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/fonts/mulish-latin.woff2"
        crossOrigin="anonymous"
      />
      {url && <link rel="canonical" href={url} />}
      {alternates.map((alternate) => (
        <link
          key={alternate.hrefLang}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={abs(alternate.pathname)}
        />
      ))}
    </Helmet>
  )
}

export default Seo
