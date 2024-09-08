import autoCommit from '@/utils/autoCommit'
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
  
    // 복사 버튼
    const copyButton = document.createElement('button')
    copyButton.classList.add('btn-u', 'btn-u-blue')
    copyButton.textContent = '번역 html 복사'
    body.appendChild(copyButton)
  
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(htmls.join(''))
      copyButton.textContent = '복사됨'
      setTimeout(() => {
        copyButton.textContent = '번역 html 복사'
      }, 3000)
    })

    // 자동 commit
    const autoCommitLangInput = document.createElement('input')
    autoCommitLangInput.placeholder = '언어 코드'
    autoCommitLangInput.value = 'ko_KR'
    autoCommitLangInput.classList.add('oeyeditor-form', 'oeyeditor-lang', 'form-control')
    body.appendChild(autoCommitLangInput)

    const autoCommitButton = document.createElement('button')
    autoCommitButton.classList.add('btn-u', 'btn-u-blue')
    autoCommitButton.textContent = 'commit'
    body.appendChild(autoCommitButton)
  
    autoCommitButton.addEventListener('click', async () => {
      autoCommitButton.textContent = 'committing...'
      
      try {
        await autoCommit({
          id: window.location.pathname.split('/')[2],
          lang: (document.querySelector('.oeyeditor-lang') as HTMLInputElement).value,
          author: document.querySelector('.username')!.textContent!,
          content: htmls.join('')
        })
  
        autoCommitButton.textContent = 'commited!'
        setTimeout(() => {
          autoCommitButton.textContent = 'commit'
        }, 3000)
      } catch(e) {
        console.error(e)

        autoCommitButton.textContent = 'error: github repository 등을 팝업창에서 제대로 입력했는지 확인해주세요.'
      }
    })
  }, { once: true })
}
