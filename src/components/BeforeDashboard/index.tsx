import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Field Notes.</h4>
      </Banner>
      Your editorial workspace is ready:
      <ul className={`${baseClass}__instructions`}>
        <li>
          Edit the seeded articles, categories and images, then <a href="/" target="_blank">view the site</a>.
        </li>
        <li>
          Public content is available through the REST API at <a href="/api/posts" target="_blank">/api/posts</a>.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
