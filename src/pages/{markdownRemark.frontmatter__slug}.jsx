import * as React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import Container from '../components/container'

class MarkdownPage extends React.Component {
  render() {
    const { markdownRemark } = this.props.data // data.markdownRemark holds your post data
    const { frontmatter, html } = markdownRemark
    
    return (
      <Layout location={this.props.location}>
        <Container>
          <h1>{frontmatter.title}</h1>
          <h4>Last updated: {frontmatter.date}</h4>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Container>
      </Layout>
    )
  }
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
