import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { renderRichText } from 'gatsby-source-contentful/rich-text'

import Layout from '../components/layout'
import Container from '../components/container'
import Hero from '../components/hero'

class SupportIndex extends React.Component {
  render() {
    console.log(this.props.data)
    const faqs = get(this, 'props.data.allContentfulFaq.nodes')

    return (
      <Layout location={this.props.location}>
        <Container>
          <Hero
            title="Frequently asked questions"
          />
          {
            React.Children.toArray(
              faqs.map((faq) => {
                return (
                  <div>
                    <h3>{faq.title}</h3>
                    {renderRichText(faq.answer)}
                  </div>
                )
              })
            )
          }
        </Container>
      </Layout>
    )
  }
}

export default SupportIndex


export const pageQuery = graphql`
  query faqIndexQuery {
    allContentfulFaq {
      nodes {
        title
        answer {
          raw
        }
      }
    }
  }
`
