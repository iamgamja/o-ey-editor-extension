import './style.css'
import insertForm from '@/utils/insertForm'

// 최종 결과물
const htmls: string[] = []
let nowidx = 0;

/** @returns {number} - 추가한 원소의 idx */
function html_push(s: string) {
  htmls.push(s)
  return nowidx++;
}

// 수정 가능한 태그 목록
// 게시판 글쓰기에서 사용 가능한 태그에서 가져옴
const EDITABLE = ['p', 'li', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table']

function parse(ele: Element) {
  if (!EDITABLE.includes(ele.tagName.toLowerCase())) {
    // 수정 불가능할 경우 dfs
    const [pre, post] = ele.outerHTML.split(ele.innerHTML)
    html_push(pre)
    ;[...ele.children].forEach(parse)
    html_push(post)
  } else {
    // 수정 가능할 경우 input/textarea 추가
    const text = ele.outerHTML.replace(
      /<mjx-container\b[^>]*?>.*?<span\b[^>]*?>(.*?)<\/span>.*?<\/mjx-container>/g,
      (_, p1) => p1
    )
    insertForm({htmls, idx: html_push(text), value: text, ele: ele})
  }
}

function initEditor() {
  const body = document.querySelector('#problem-body')
  if (!body) throw new Error('element not found: `#problem-body`')

  // 먼저 제목 번역 추가
  html_push('<section id="title">')

  const title = document.querySelector('#problem_title')
  if (!title) throw new Error('element not found: `#problem_title`')
  const text = title.textContent ?? ''
  insertForm({htmls, idx: html_push(text), value: text, ele: title})
  
  html_push('</section>\n')

  const childs = body.querySelectorAll('section.problem-section:not([style])')
  for (const section of childs) {
    html_push(`<section id="${section.id}">`)
    ;[...section.children].forEach(parse)
    html_push('</section>\n')
  }

  // 복사 버튼 추가
  const btn = document.createElement('button')
  btn.className = 'btn-u btn-u-blue'
  btn.textContent = '번역 html 복사'
  body.appendChild(btn)

  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(htmls.join(''))
    btn.textContent = '복사됨'
  })
}

export default defineContentScript({
  matches: ['*://*.acmicpc.net/problem/*'],
  async main() {
    // MathJax render 스크립트 주입
    const script = document.createElement('script')
    script.src = browser.runtime.getURL('/render_mathjax.js')
    ;(document.head || document.documentElement).appendChild(script)
    script.addEventListener('load', script.remove)

    // '번역하기' 버튼 추가
    const menu = document.querySelector('.problem-menu')
    if (!menu) throw new Error('element not found: `.problem-menu`')
      
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.textContent = '번역하기'
    li.appendChild(a)
    menu.appendChild(li)

    // event listner 추가
    a.addEventListener('click', initEditor, { once: true })
  },
})
