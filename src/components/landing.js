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
      <a 
        href="https://apps.apple.com/us/app/snuggly-baby-heartbeat-listen/id1663946323?itsct=apps_box_badge&amp;itscg=30200" 
        className={styles.badgeLink}
      >
        <img
          
          src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1673913600"
          alt="Download on the App Store"
          className={styles.badgeImage}
        />
      </a>
    </div>
  </div>
)

export default Landing
