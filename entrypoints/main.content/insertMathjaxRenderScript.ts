export default function insertMathjaxRenderScript() {
  const script = document.createElement('script')
  script.src = browser.runtime.getURL('/render_mathjax.js')
  ;(document.head || document.documentElement).appendChild(script)
  script.addEventListener('load', script.remove)
}