import { html_push, htmls } from '@/utils/htmls'
import parse from '@/utils/parse'

export default function insertTranslationButton() {
  const menu = document.querySelector('.problem-menu')
  if (!menu) throw new Error('element not found: `.problem-menu`')

  const li = document.createElement('li')
  const a = document.createElement('a')
  a.textContent = '번역하기'
  li.appendChild(a)
  menu.appendChild(li)

  a.addEventListener('click', () => {
    const body = document.querySelector('#problem-body')
    if (!body) throw new Error('element not found: `#problem-body`')
  
    // 먼저 제목 번역 추가
    html_push('<section id="title">')

    const title = document.querySelector('#problem_title')
    if (!title) throw new Error('element not found: `#problem_title`')
    const text = title.textContent ?? ''
    insertForm({idx: html_push(text), value: text, ele: title})

    html_push('</section>\n')

    // section 순회
    const sections = body.querySelectorAll('section.problem-section:not([style])')
    for (const section of sections) {
      html_push(`<section id="${section.id}">`)
      ;[...section.children].forEach(parse)
      html_push('</section>\n')
    }
  
    // 복사 버튼 추가
    const btn = document.createElement('button')
    btn.classList.add('btn-u', 'btn-u-blue')
    btn.textContent = '번역 html 복사'
    body.appendChild(btn)
  
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(htmls.join(''))
      btn.textContent = '복사됨'
      setTimeout(() => {
        btn.textContent = '번역 html 복사'
      }, 3000)
    })
  }, { once: true })
}
