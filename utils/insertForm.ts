import { htmls } from '@/utils/htmls'

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

export default function insertForm({idx, value, ele}: {idx: number, value: string, ele: Element}) {
  const form = document.createElement(isTextarea(ele) ? 'textarea' : 'input')
  form.classList.add('oeyeditor-form', 'form-control')
  form.value = value

  const preview = document.createElement('div')
  preview.classList.add('oeyeditor-preview')
  preview.innerHTML = value

  ele.after(preview, form)
  render_mathjax()
  
  form.addEventListener('input', () => {
    htmls[idx] = form.value
    preview.innerHTML = form.value
    render_mathjax()
  })

  if (isTextarea(ele)) {
    function autoHeight() {
      form.style.height = '5px'
      form.style.height = `${form.scrollHeight + 10}px`
    }
  
    autoHeight()
    form.addEventListener('keyup', autoHeight)
  }
}
