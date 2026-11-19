import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, jsonLdText, metaFor } from '../data/seo'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.setAttribute('content', content)
}

/**
 * Keeps the title, description, canonical and social tags in step with the current route
 * while people move around the site. The first load gets the same tags from the prerendered HTML.
 */
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = metaFor(pathname)
    const url = SITE + (m.noindex ? '/' : m.path)
    document.title = m.title
    setMeta('name', 'description', m.description)
    setMeta('property', 'og:title', m.title)
    setMeta('property', 'og:description', m.description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', m.title)
    setMeta('name', 'twitter:description', m.description)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (m.noindex) {
      link?.remove()
      setMeta('name', 'robots', 'noindex')
    } else {
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.append(link)
      }
      link.href = url
      document.head.querySelector('meta[name="robots"]')?.remove()
    }

    /* structured data: one script tag, replaced on every route change */
    const ld = jsonLdText(m)
    let script = document.getElementById('ld-json')
    if (ld) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'ld-json'
        script.setAttribute('type', 'application/ld+json')
        document.head.append(script)
      }
      script.textContent = ld
    } else {
      script?.remove()
    }
  }, [pathname])
  return null
}
