const BASE_URL = 'https://api.github.com'

type SettingKey = 'token' | 'handle' | 'repository' | 'branch'

let setting: Record<SettingKey, string>
async function fetchSetting() {
  setting = await browser.storage.local.get(['token', 'handle', 'repository', 'branch'])
}

function getHeaders() {
  return {
    'Authorization': `token ${setting.token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  }
}

/**
 * GET https://api.github.com/repos/:owner/:repo/${path}
 */
async function GET(path: string) {
  const url = `${BASE_URL}/repos/${setting.handle}/${setting.repository}/${path}`
  const options: RequestInit = {
    headers: getHeaders()
  }

  return await (await fetch(url, options)).json()
}

/**
 * POST https://api.github.com/repos/:owner/:repo/${path}
 */
async function POST(path: string, body: object) {
  const url = `${BASE_URL}/repos/${setting.handle}/${setting.repository}/${path}`
  const options: RequestInit = {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify(body)
  }

  return await (await fetch(url, options)).json()
}

/**
 * PATCH https://api.github.com/repos/:owner/:repo/${path}
 */
async function PATCH(path: string, body: object) {
  const url = `${BASE_URL}/repos/${setting.handle}/${setting.repository}/${path}`
  const options: RequestInit = {
    headers: getHeaders(),
    method: 'PATCH',
    body: JSON.stringify(body)
  }

  return await (await fetch(url, options)).json()
}


async function postNewBlob(content: string) {
  const res = await POST('git/blobs', {
    content,
    encoding: 'utf-8'
  })
  return res.sha
}

async function postTree(lastSHA: string, filename: string, id: string, content: string) {
  const index = JSON.parse(atob((await GET(`contents/index?ref=${setting.branch}`)).content))
  index[id] ??= []
  index[id].push(filename)
  index[id].sort()

  const html_blob = await postNewBlob(content)
  const index_blob = await postNewBlob(JSON.stringify(index, Object.keys(index).sort(), 2))

  const res = await POST('git/trees', {
    base_tree: lastSHA,
    tree: [
      {
        path: `src/${id}/${filename}.html`,
        mode: '100644',
        type: 'blob',
        sha: html_blob
      },
      {
        path: 'index',
        mode: '100644',
        type: 'blob',
        sha: index_blob
      }
    ]
  })
  return res.sha
}

async function postCommit(lastSHA: string, treeSHA: string, id: string, author: string) {
  const res = await POST('git/commits', {
    message: `Add ${id}`,
    author: {
      name: author,
      email: `${author}@example.com`
    },
    parents: [ lastSHA ],
    tree: treeSHA
  })
  return res.sha
}

export default async function autoCommit({id, lang, author, content}: {id: string, lang: string, author: string, content: string}) {
  await fetchSetting()

  const lastSHA = (await GET(`branches/${setting.branch}`)).commit.sha
  const treeSHA = await postTree(lastSHA, `${lang}-${author}`, id, content)
  const commitSHA = await postCommit(lastSHA, treeSHA, id, author)
  
  await PATCH(`git/refs/heads/${setting.branch}`, {
    sha: commitSHA
  })
}