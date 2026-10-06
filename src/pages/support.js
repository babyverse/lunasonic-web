import React from 'react'
import { graphql } from 'gatsby'
import { renderRichText } from 'gatsby-source-contentful/rich-text'

import Seo from '../components/seo'
import Layout from '../components/layout'

const SupportIndex = ({ data, location }) => (
  <Layout location={location}>
    <Seo title="Support" />
    <h1>Frequently asked questions</h1>
    <div className="faq-list">
      {data.allContentfulFaq.nodes.map((faq) => (
        <details className="faq-item" key={faq.title}>
          <summary>
            {faq.title}
            <span className="faq-icon" />
          </summary>
          <div className="faq-answer">{renderRichText(faq.answer)}</div>
        </details>
      ))}
    </div>
  </Layout>
)

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
