document.addEventListener('oeyeditor_render_mathjax', (e) => {
  MathJax.typeset([e.detail])
})