import './style.css'
import insertMathjaxRenderScript from './insertMathjaxRenderScript'
import insertTranslationButton from './insertTranslationButton'

export default defineContentScript({
  matches: ['*://*.acmicpc.net/problem/*'],
  async main() {
    // MathJax render 스크립트 주입
    insertMathjaxRenderScript();

    // '번역하기' 버튼 추가
    insertTranslationButton()
  },
})
