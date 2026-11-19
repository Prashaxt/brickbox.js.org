import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

/** Used only by scripts/prerender.mjs at build time. */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

export { NOT_FOUND, PAGES, headTags } from './data/seo'
