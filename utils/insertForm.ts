function render_mathjax() {
  document.dispatchEvent(new CustomEvent('oeyeditor_render_mathjax'))
}

function isTextarea(ele: Element) {
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(ele.tagName.toLowerCase()))
    return false
  if (ele.id === 'problem_title')
    return false
  return true
}

export default function insertForm({htmls, idx, value, ele}: {htmls: string[], idx: number, value: string, ele: Element}) {
  const form = isTextarea(ele) ? document.createElement('textarea') : document.createElement('input')
  form.classList.add('oey-form', 'form-control')
  form.value = value

  const preview = document.createElement('div')
  preview.classList.add('oey-preview')
  preview.innerHTML = value
  
  form.addEventListener('input', () => {
    htmls[idx] = form.value
    preview.innerHTML = form.value
    render_mathjax()
  })

  ele.after(preview, form)
  render_mathjax()

  if (isTextarea(ele)) {
    function autoHeight() {
      form.style.height = '5px'
      form.style.height = `${form.scrollHeight + 10}px`
    }
  
    autoHeight()
    form.addEventListener('keyup', autoHeight)
  }
}
