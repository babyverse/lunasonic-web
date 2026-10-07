import React from 'react'

import SupportPage from '../components/support-page'

// Rendered for each generated locale route (/es/support/, /de/support/, …).
const LocalizedSupport = ({ pageContext }) => (
  <SupportPage lang={pageContext.lang} />
)

export default LocalizedSupport
