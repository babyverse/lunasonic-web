import React from 'react'

import Container from './container'
import * as styles from './footer.module.css'

const Footer = () => (
  <div as="footer">
    <div className={styles.container}>
      © Lunasonic 2022<br />
      <a href="javascript:gaOptout();">Deactivate Google Tracking</a>
    </div>
  </div>
)

export default Footer
