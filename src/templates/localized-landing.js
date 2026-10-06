import React from 'react'

import SnugglyPage from '../components/snuggly-page'

// Rendered for each generated locale route (/es/, /de/, /pt/, …). The active
// language comes from pageContext set in gatsby-node.js.
const LocalizedLanding = ({ pageContext }) => (
  <SnugglyPage lang={pageContext.lang} />
)

export default LocalizedLanding
