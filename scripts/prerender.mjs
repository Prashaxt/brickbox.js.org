// Runs after `vite build` and `vite build --ssr`. Writes real HTML for every route so crawlers,
// link previews and AI tools see the content without running JavaScript.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
// Vite strips HTML comments from index.html, so we look for the head and the root div instead.
const ROOT = /<div id="root">\s*<\/div>/
const template = (await readFile(path.join(dist, 'index.html'), 'utf8')).replace(/<!--app-(head|html)-->/g, '')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head>')
if (!ROOT.test(template)) throw new Error('dist/index.html has no empty <div id="root"></div>')

const { render, headTags, PAGES, NOT_FOUND } = await import(
  pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href
)

// function replacers, so "$&" or "$'" in the rendered markup is never treated as a pattern
const fill = (head, html) =>
  template.replace('</head>', () => `  ${head}\n</head>`).replace(ROOT, () => `<div id="root">${html}</div>`)
const build = (url, meta) => fill(headTags(meta), render(url))

for (const meta of PAGES) {
  const dir = path.join(dist, meta.path)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), build(meta.path, meta))
  console.log('prerendered', meta.path)
}

// GitHub Pages serves 404.html for any unknown URL, with a real 404 status so search engines drop it.
// The app then redirects visitors to the home page, so the page body is left empty on purpose.
await writeFile(
  path.join(dist, '404.html'),
  fill(headTags(NOT_FOUND), ''),
)
console.log('prerendered 404.html')