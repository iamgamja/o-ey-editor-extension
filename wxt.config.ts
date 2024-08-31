import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    'web_accessible_resources': [
      {
        'matches': ['*://*.acmicpc.net/*'],
        'resources': ['render_mathjax.js']
      }
    ]
  }
})
