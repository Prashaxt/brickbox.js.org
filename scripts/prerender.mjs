// Runs after `vite build` and `vite build --ssr`. Writes real HTML for every route so crawlers,
// link previews and AI tools see the content without running JavaScript.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`)
}

const { render, headTags, PAGES, NOT_FOUND } = await import(
  pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href
)

// function replacers, so "$&" or "$'" in the rendered markup is never treated as a pattern
const build = (url, meta) =>
  template.replace('<!--app-head-->', () => headTags(meta)).replace('<!--app-html-->', () => render(url))

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
  template.replace('<!--app-head-->', () => headTags(NOT_FOUND)).replace('<!--app-html-->', ''),
)
console.log('prerendered 404.html')
