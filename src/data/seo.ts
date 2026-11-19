/** One place for the per-page search and social metadata. Used by the browser (Seo.tsx) and by the build (scripts/prerender.mjs). */
import { TROUBLE } from './troubleshooting'

export const SITE = 'https://brickbox.js.org'
const REPO = 'https://github.com/Prashaxt/brickbox'
const NPM = 'https://www.npmjs.com/package/brickbox'

export interface PageMeta {
  /** path with a trailing slash, as GitHub Pages serves it */
  path: string
  title: string
  description: string
  noindex?: boolean
}

export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'brickbox: give any element real depth | 3D CSS library',
    description:
      'brickbox is a small open-source library that turns any element into a 3D slab. React, HTML custom element or plain JavaScript. About 9.8 KB gzipped, no dependencies.',
  },
  {
    path: '/docs/',
    title: 'brickbox documentation: install, props, API and rules',
    description:
      'How to install and use brickbox: quick start for React, HTML and plain JavaScript, every option, control modes, nesting, server rendering, troubleshooting and changelog.',
  },
  {
    path: '/playground/',
    title: 'brickbox playground: try 3D depth, tilt and press live',
    description:
      'Tune depth, tilt, light, colour, shadow and press on a live brickbox slab, then copy the React or HTML code.',
  },
]

export const NOT_FOUND: PageMeta = {
  path: '/404.html',
  title: 'Page not found | brickbox',
  description: 'This page does not exist. Go back to the brickbox home page, docs or playground.',
  noindex: true,
}

/** Finds the metadata for a router pathname. Unknown paths get the 404 metadata. */
export function metaFor(pathname: string): PageMeta {
  const p = '/' + pathname.replace(/^\/+|\/+$/g, '')
  const norm = p === '/' ? '/' : p + '/'
  return PAGES.find((m) => m.path === norm) ?? NOT_FOUND
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The <head> tags for one page, as an HTML string (used at build time). */
export function headTags(m: PageMeta): string {
  const url = SITE + (m.noindex ? '/' : m.path)
  const t = esc(m.title)
  const d = esc(m.description)
  const ld = jsonLdText(m)
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}">`,
    m.noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`,
    `<meta property="og:site_name" content="brickbox">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    ...(ld ? [`<script type="application/ld+json" id="ld-json">${ld}</script>`] : []),
  ].join('\n  ')
}

const plain = (s: string) => s.replace(/`/g, '')

const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
})

const AUTHOR = { '@type': 'Person', name: 'Prashaxt', url: 'https://github.com/Prashaxt' }
const SOFTWARE_ID = SITE + '/#software'
const WEBSITE_ID = SITE + '/#website'

/** Structured data (schema.org JSON-LD) for one page. Unknown pages get none. */
export function jsonLdFor(m: PageMeta): object | null {
  const url = SITE + m.path
  if (m.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': WEBSITE_ID,
          url: SITE + '/',
          name: 'brickbox',
          description: m.description,
          inLanguage: 'en',
          author: AUTHOR,
        },
        {
          '@type': 'SoftwareSourceCode',
          '@id': SOFTWARE_ID,
          name: 'brickbox',
          description:
            'A small open-source JavaScript library that turns any HTML element into a 3D slab you can tilt, press and drag. The element stays real DOM. Works with React, as an HTML custom element, or from plain JavaScript.',
          url: SITE + '/',
          codeRepository: REPO,
          programmingLanguage: ['JavaScript', 'TypeScript'],
          runtimePlatform: 'Web browser',
          keywords: '3D, CSS, extrude, tilt, depth, React, web component, JavaScript',
          sameAs: [REPO, NPM],
          author: AUTHOR,
          isPartOf: { '@id': WEBSITE_ID },
        },
      ],
    }
  }
  if (m.path === '/docs/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': url + '#article',
          headline: 'brickbox documentation',
          description: m.description,
          url,
          inLanguage: 'en',
          about: { '@id': SOFTWARE_ID },
          author: AUTHOR,
          isPartOf: { '@id': WEBSITE_ID },
        },
        { ...crumbs([['brickbox', SITE + '/'], ['Documentation', url]]) },
        {
          '@type': 'FAQPage',
          '@id': url + '#troubleshooting',
          mainEntity: TROUBLE.map(([q, a]) => ({
            '@type': 'Question',
            name: plain(q),
            acceptedAnswer: { '@type': 'Answer', text: plain(a) },
          })),
        },
      ],
    }
  }
  if (m.path === '/playground/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': url + '#page',
          name: m.title,
          description: m.description,
          url,
          inLanguage: 'en',
          about: { '@id': SOFTWARE_ID },
          isPartOf: { '@id': WEBSITE_ID },
        },
        crumbs([['brickbox', SITE + '/'], ['Playground', url]]),
      ],
    }
  }
  return null
}

/** JSON for a <script type="application/ld+json">, safe to place inside HTML. */
export function jsonLdText(m: PageMeta): string | null {
  const data = jsonLdFor(m)
  return data ? JSON.stringify(data).replace(/</g, '\\u003c') : null
}
