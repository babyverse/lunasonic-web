import * as React from "react"
import { graphql } from "gatsby"
import Seo from '../components/seo'
import Layout from '../components/layout'

const MarkdownPage = ({ data, location }) => {
  const { frontmatter, html } = data.markdownRemark

  return (
    <Layout>
      <Seo title={frontmatter.title} pathname={location.pathname} />
      <h1>{frontmatter.title}</h1>
      <p className="updated">Last updated: {frontmatter.date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export default MarkdownPage

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
