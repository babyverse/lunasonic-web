import React, { useState, useEffect } from 'react'

import * as styles from './landing.module.css'
import { trackLead, trackAppStoreClick, buildAppStoreUrl } from '../utils/tracking'

// App Store configuration
const APP_ID = "id1663946323"
const PROVIDER_TOKEN = "125877163"

const Landing = ({ image, title, content }) => {
  const [appStoreUrl, setAppStoreUrl] = useState(
    `https://apps.apple.com/app/apple-store/${APP_ID}?pt=${PROVIDER_TOKEN}&mt=8`
  )

  useEffect(() => {
    // Build URL with campaign params on client side
    setAppStoreUrl(buildAppStoreUrl(APP_ID, PROVIDER_TOKEN))
  }, [])

  const handleAppStoreClick = () => {
    // Track as both a Lead (standard event) and AppStoreClick (custom event)
    trackLead({ content_name: "App Store Download", content_category: "iOS App" })
    trackAppStoreClick()
  }

  return (
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
          href={appStoreUrl}
          className={styles.badgeLink}
          onClick={handleAppStoreClick}
          target="_blank"
          rel="noopener noreferrer"
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
}

export default Landing
