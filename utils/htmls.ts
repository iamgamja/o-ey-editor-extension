// 최종 결과물
export const htmls: string[] = []
let nowidx = 0

/** @returns {number} - 추가한 원소의 idx */
export function html_push(s: string) {
  htmls.push(s)
  return nowidx++
}
