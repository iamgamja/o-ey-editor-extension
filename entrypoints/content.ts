export default defineContentScript({
  matches: ['*://acmicpc.net/problem/*'],
  main() {
    console.log(browser)
  },
})
