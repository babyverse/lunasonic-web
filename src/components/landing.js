import React from 'react'

import * as styles from './landing.module.css'
import Badge from '../assets/Badge.svg'

const Landing = ({ image, title, content }) => (
  <div className={styles.landing}>
    {image && (
      <div className={styles.cover}>
        <img className={styles.image} src={image} alt={title} title={title} height="100%" width="100%" />
      </div>
    )}
    <div className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      {content && (
        <div className={styles.content}>
          {content}
        </div>
      )}
      <Badge />
    </div>
  </div>
)

export default Landing
