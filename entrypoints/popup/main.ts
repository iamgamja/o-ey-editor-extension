import './style.css'

(async () => {
  const res = await browser.storage.local.get(['token', 'handle', 'repository', 'branch'])

  const token = document.querySelector<HTMLInputElement>('#token')!
  const handle = document.querySelector<HTMLInputElement>('#handle')!
  const repository = document.querySelector<HTMLInputElement>('#repository')!
  const branch = document.querySelector<HTMLInputElement>('#branch')!
  
  token.value = res.token
  handle.value = res.handle
  repository.value = res.repository
  branch.value = res.branch
  
  document.querySelector('#save')!.addEventListener('click', () => {
    browser.storage.local.set({
      token: token.value,
      handle: handle.value,
      repository: repository.value,
      branch: branch.value,
    })
  })
})()
