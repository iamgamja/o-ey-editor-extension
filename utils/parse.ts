import { html_push } from '@/utils/htmls'

// 수정 가능한 태그 목록
// 게시판 글쓰기에서 사용 가능한 태그에서 가져옴
const EDITABLE = ['p', 'li', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table']

export default function parse(ele: Element) {
  if (!EDITABLE.includes(ele.tagName.toLowerCase())) {
    // 수정 불가능한 태그라면 dfs
    const [pre, post] = ele.outerHTML.split(ele.innerHTML)
    html_push(pre)
    ;[...ele.children].forEach(parse)
    html_push(post)
  } else {
    // 수정 가능한 태그라면 input/textarea 추가
    const text = ele.outerHTML.replace(
      /<mjx-container\b[^>]*?>.*?<span\b[^>]*?>(.*?)<\/span>.*?<\/mjx-container>/g,
      (_, p1) => p1
    )
    insertForm({idx: html_push(text), value: text, ele: ele})
  }
}
